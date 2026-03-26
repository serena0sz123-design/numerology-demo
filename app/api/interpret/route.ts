import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { NumerologyResult } from '@/lib/numerology'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const NUMBER_NAMES: Record<string, string> = {
  lifePath:    '生命数（Life Path Number）',
  birthday:    '生日数（Birthday Number）',
  expression:  '天赋数（Expression Number）',
  soulUrge:    '灵魂数（Soul Urge Number）',
  personality: '人格数（Personality Number）',
}

function formatNum(n: number): string {
  if (n === 11) return '11/2'
  if (n === 22) return '22/4'
  if (n === 33) return '33/6'
  return String(n)
}

function buildPrompt(type: string, numberKey: string | undefined, result: NumerologyResult): string {
  const base = `用户录入拼音/英文名：${result.name}，出生日期：${result.birthDate}
核心数字：生命数${formatNum(result.lifePath)}、生日数${formatNum(result.birthday)}、天赋数${formatNum(result.expression)}、灵魂数${formatNum(result.soulUrge)}、人格数${formatNum(result.personality)}`

  if (type === 'summary') {
    return `你是一位精通毕达哥拉斯数字命理学的解读师。

${base}

请严格按以下结构输出（共约200字）：

第一段：一句生动提炼的命盘总结（15-30字），单独成段，要有画面感和洞察力，例如"权利与创造力的双重烙印：以掌控之力构建世界，以表达之光照亮他人"。

空一行后，写正面能量解读（1-2句，展现此人核心天赋与优势能量）。

空一行后，写挑战与成长课题（1-2句，点出此人需要突破的核心课题）。

重要格式规则：
- 最多提及用户录入的拼音"${result.name}"一次，其余均用"你"指代
- 所有数字一律用阿拉伯数字，不用汉字
- 引用文字用"..."双引号，不使用**加粗**，不使用---分隔线`
  }

  if (type === 'number' && numberKey) {
    const numValue = result[numberKey as keyof NumerologyResult] as number
    const displayValue = formatNum(numValue)
    const isMaster = [11, 22, 33].includes(numValue)
    const masterInstruction = isMaster
      ? `\n注意：${displayValue}是大师数，解读时必须涵盖：该大师数的特殊意义、双数(${numValue})的高层能量、单数底层逻辑、高中低不同状态下的表现与挑战。`
      : ''

    return `你是一位精通毕达哥拉斯数字命理学的解读师。

${base}

请解读此人的${NUMBER_NAMES[numberKey]}：${displayValue}${masterInstruction}

请严格按以下格式输出：

第一行：${displayValue}·[该数字的核心关键词，3-8字]（直接写这一行，如：8·权力与掌控，22/4·建筑师的面孔）

空一行后写正面能量段落（能量特质与天赋表现，2-3句）

空一行后写挑战与课题段落（2-3句）

空一行后最后一段，段落开头固定写"给你的话："，然后接一句温暖有力的个人化建议

重要格式规则：
- 全程只用"你"指代用户，不提及任何姓名
- 所有数字一律用阿拉伯数字，不用汉字
- 引用文字用"..."双引号，不使用**加粗**，不使用---分隔线
约200字，中文为主，适当保留英文术语。`
  }

  if (type === 'loshu') {
    const { counts, missing } = result.loShu
    const present = Object.entries(counts).filter(([,v]) => v > 0).map(([k,v]) => `${k}出现${v}次`).join('、')
    return `你是一位精通毕达哥拉斯数字命理学的解读师。

${base}
九宫格分布：${present}
缺失数字：${missing.length > 0 ? missing.join('、') : '无'}

请解读此人的命理九宫格，重点分析：
1. 数字分布反映的能量格局
2. 缺失数字代表的成长空间
3. 整体命盘的特征

流畅段落，正面与挑战分段呈现，约150字。

格式规则：全程用"你"，不提姓名，所有数字用阿拉伯数字，不使用**加粗**，不使用---分隔线，段落间空行即可。`
  }

  if (type === 'pinnacles') {
    const ps = result.pinnacles.map(p =>
      `${p.label}（${p.startAge}岁${p.endAge ? `–${p.endAge}岁` : '以后'}）：巅峰数${p.number} / 挑战数${p.challenge}`
    ).join('\n')
    return `你是一位精通毕达哥拉斯数字命理学的解读师。

${base}
人生四格：
${ps}

请按以下三步结构输出解读，约250字：

第一步：逐段解读每个巅峰阶段（每段2-3句）
格式：「在这一阶段，你被推动去【巅峰数主题】，但内在可能受到【挑战数课题】的影响。」
体现外在主题与内在阻力的张力，语言自然不模板化。

第二步：整体人生路径总结（2-3句）
描述从第一到第四阶段的变化脉络，找出重复出现的挑战数（核心课题），给出一句路径描述（例如：从表达走向自由）。

格式规则：全程用"你"，不提姓名，所有数字用阿拉伯数字，不使用**加粗**，不使用---分隔线，各段落间空行即可。`
  }

  if (type === 'personalyear') {
    const currentYear = new Date().getFullYear()
    const years = result.personalYears.slice(1, 4)
    const ys = years.map(y => `${y.year}年（${y.year === currentYear ? '当前' : ''}流年数${y.number}）`).join('、')
    return `你是一位精通毕达哥拉斯数字命理学的解读师。

${base}
流年：${ys}

请为这三年分别写解读，每年包含：
1. 当年主题与核心能量（1句）
2. 该年的潜在挑战或需要注意的方向（1句）
当前年份重点突出。约180字。

格式规则：全程用"你"，不提姓名，所有数字用阿拉伯数字，不使用**加粗**，不使用---分隔线，各段落间空行即可。`
  }

  return ''
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, numberKey, result } = body as {
      type: string
      numberKey?: string
      result: NumerologyResult
    }

    const prompt = buildPrompt(type, numberKey, result)
    if (!prompt) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return NextResponse.json({ text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

