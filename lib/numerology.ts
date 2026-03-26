// 毕达哥拉斯数字命理学 核心计算逻辑
// Pythagorean Numerology Core Calculations

// 字母对应数值表（A=1, B=2, ... Z=26 → 再化简）
const LETTER_VALUES: Record<string, number> = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

// 主数字：11、22、33 不继续化简（大师数）
const MASTER_NUMBERS = new Set([11, 22, 33])

// 将数字反复相加直到个位数（保留大师数 11/22/33）
export function reduceToSingleDigit(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n).split('').reduce((sum, d) => sum + Number(d), 0)
  }
  return n
}

// 强制化简到个位数（不保留大师数，用于巅峰数/流年数）
export function reduceStrict(n: number): number {
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + Number(d), 0)
  }
  return n
}

// 清理姓名：只保留字母并转大写
function cleanName(name: string): string {
  return name.toUpperCase().replace(/[^A-Z]/g, '')
}

// ① 生命数 Life Path Number — 生日所有数字相加
export function calcLifePath(birthDate: string): number {
  // birthDate 格式：YYYY-MM-DD
  const digits = birthDate.replace(/-/g, '').split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  return reduceToSingleDigit(sum)
}

// ② 生日数 Birthday Number — 出生日（不化简到个位，只化简到两位内）
export function calcBirthday(birthDate: string): number {
  const day = parseInt(birthDate.split('-')[2], 10)
  return reduceToSingleDigit(day)
}

// ③ 天赋数 Expression Number — 姓名所有字母数值之和
export function calcExpression(name: string): number {
  const letters = cleanName(name).split('')
  const sum = letters.reduce((acc, l) => acc + (LETTER_VALUES[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

// ④ 灵魂数 Soul Urge Number — 姓名元音字母数值之和
export function calcSoulUrge(name: string): number {
  const vowels = cleanName(name).split('').filter(l => VOWELS.has(l))
  const sum = vowels.reduce((acc, l) => acc + (LETTER_VALUES[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

// ⑤ 人格数 Personality Number — 姓名辅音字母数值之和
export function calcPersonality(name: string): number {
  const consonants = cleanName(name).split('').filter(l => !VOWELS.has(l))
  const sum = consonants.reduce((acc, l) => acc + (LETTER_VALUES[l] || 0), 0)
  return reduceToSingleDigit(sum)
}

// ⑥ 命理九宫格 Lo Shu Grid — 统计生日各数字出现次数
export interface LoShuGrid {
  grid: (number[] )[]  // 3x3 宫格，每格存该数字出现次数
  counts: Record<number, number>  // 1-9 各数字出现次数
  missing: number[]  // 缺失的数字
}

export function calcLoShuGrid(birthDate: string): LoShuGrid {
  const digits = birthDate.replace(/-/g, '').split('').map(Number).filter(d => d !== 0)
  const counts: Record<number, number> = { 1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0 }
  digits.forEach(d => { if (d >= 1 && d <= 9) counts[d]++ })

  // 洛书九宫格位置：
  // 4 9 2
  // 3 5 7
  // 8 1 6
  const positions = [
    [4, 9, 2],
    [3, 5, 7],
    [8, 1, 6],
  ]
  const grid = positions.map(row => row.map(n => counts[n]))
  const missing = Object.entries(counts).filter(([,v]) => v === 0).map(([k]) => Number(k))

  return { grid, counts, missing }
}

// ⑦ 人生四格 Four Pinnacles
export interface Pinnacle {
  number: number
  challenge: number
  startAge: number
  endAge: number | null  // null 表示终身
  label: string
}

export function calcPinnacles(birthDate: string): Pinnacle[] {
  const [year, month, day] = birthDate.split('-').map(Number)
  const lifePath = calcLifePath(birthDate)

  const m = reduceToSingleDigit(month)
  const d = reduceToSingleDigit(day)
  const y = reduceToSingleDigit(
    String(year).split('').reduce((a, b) => a + Number(b), 0)
  )

  const p1 = reduceStrict(m + d)
  const p2 = reduceStrict(d + y)
  const p3 = reduceStrict(p1 + p2)
  const p4 = reduceStrict(m + y)

  // 挑战数：用 reduceStrict（不保留大师数），绝对差值
  const cm = reduceStrict(month)
  const cd = reduceStrict(day)
  const cy = reduceStrict(String(year).split('').reduce((a, b) => a + Number(b), 0))
  const c1 = Math.abs(cm - cd)
  const c2 = Math.abs(cd - cy)
  const c3 = Math.abs(c1 - c2)
  const c4 = Math.abs(cm - cy)

  // 第一巅峰结束年龄：36 - LP底层单数（大师数取底层：11→2, 22→4, 33→6）
  const baseLP = lifePath === 11 ? 2 : lifePath === 22 ? 4 : lifePath === 33 ? 6 : lifePath
  const firstEnd = 36 - baseLP

  return [
    { number: p1, challenge: c1, startAge: 0,           endAge: firstEnd,     label: '第一巅峰' },
    { number: p2, challenge: c2, startAge: firstEnd,     endAge: firstEnd+9,   label: '第二巅峰' },
    { number: p3, challenge: c3, startAge: firstEnd+9,   endAge: firstEnd+18,  label: '第三巅峰' },
    { number: p4, challenge: c4, startAge: firstEnd+18,  endAge: null,         label: '第四巅峰' },
  ]
}

// ⑧ 流年数 Personal Year Number
export function calcPersonalYear(birthDate: string, year: number): number {
  const [, month, day] = birthDate.split('-').map(Number)
  const m = reduceToSingleDigit(month)
  const d = reduceToSingleDigit(day)
  const y = reduceToSingleDigit(
    String(year).split('').reduce((a, b) => a + Number(b), 0)
  )
  return reduceStrict(m + d + y)
}

// 汇总计算所有数据
export interface NumerologyResult {
  name: string
  birthDate: string
  lifePath: number
  birthday: number
  expression: number
  soulUrge: number
  personality: number
  loShu: LoShuGrid
  pinnacles: Pinnacle[]
  personalYears: { year: number; number: number }[]
}

export function calcAll(name: string, birthDate: string): NumerologyResult {
  const currentYear = new Date().getFullYear()
  return {
    name,
    birthDate,
    lifePath:    calcLifePath(birthDate),
    birthday:    calcBirthday(birthDate),
    expression:  calcExpression(name),
    soulUrge:    calcSoulUrge(name),
    personality: calcPersonality(name),
    loShu:       calcLoShuGrid(birthDate),
    pinnacles:   calcPinnacles(birthDate),
    personalYears: [
      { year: currentYear - 1, number: calcPersonalYear(birthDate, currentYear - 1) },
      { year: currentYear,     number: calcPersonalYear(birthDate, currentYear) },
      { year: currentYear + 1, number: calcPersonalYear(birthDate, currentYear + 1) },
      { year: currentYear + 2, number: calcPersonalYear(birthDate, currentYear + 2) },
    ],
  }
}
