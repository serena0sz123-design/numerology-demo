import { NextRequest, NextResponse } from 'next/server'
import { NumerologyResult } from '@/lib/numerology'

const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const MODEL = 'deepseek-ai/DeepSeek-V3'

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

请生成此人的命盘整体解读，严格按以下格式输出，不输出格式外任何文字：

先写一句命盘总结（15–30字），有画面感、有洞察力，单独成段，不加【】标记。

然后按顺序输出以下四段，每段以【标题】开头：

【你的人生剧本主线】
基于生命数${formatNum(result.lifePath)}，一句话说明这个人被推动成为什么样的人

【你的核心张力】
将生命数${formatNum(result.lifePath)}、天赋数${formatNum(result.expression)}、灵魂数${formatNum(result.soulUrge)}三者组合分析，写出它们之间产生的独特矛盾，必须出现具体数字，体现"这个组合才会这样"，参考结构："你被推动去___，但内在却更需要___，因此在___情境下容易___"，2–3句

【你这套组合的特别之处】
写这套数字组合的突出特质，1–2句，有具体依据，不能泛化

【此生最值得关注的一件事】
针对这套组合给出1条具体可执行的建议，与上方冲突结构直接相关，指向行为调整而非情绪安慰

格式规则：全程用"你"，不提姓名，所有数字用阿拉伯数字，不使用**加粗**，不使用---分隔线，约200字`
  }

  if (type === 'number' && numberKey) {
    const numValue = result[numberKey as keyof NumerologyResult] as number
    const displayValue = formatNum(numValue)
    const isMaster = [11, 22, 33].includes(numValue)

    return `你是一位精通毕达哥拉斯数字命理学的解读师。

${base}

请解读此人的${NUMBER_NAMES[numberKey]}：${displayValue}

严格按以下格式输出，每段以【标题】开头，不输出格式外任何文字：

【关键词】3–4个核心词，用·分隔（如：领导·成就·掌控）

${isMaster ? `【▲ 主数提示】
1–2句，说明${displayValue}大师数的双重能量与特殊使命

` : ''}【自拟天赋标题，根据该数字特性选最贴切者，如"核心天赋""你的感召力""你给世界的印象"等，直接用该标题替换这段说明文字】
2–3句，描述该数字带来的核心天赋与自然优势

【自拟挑战标题，如"核心挑战""隐藏的矛盾""潜在误读"等，选最贴切者替换】
2–3句，描述内在张力与成长课题；如与命盘其他数字存在明显张力，必须点出具体数字

【给你的话】
一句温暖有画面感、适合截图分享的话

格式规则：全程用"你"，不提姓名，所有数字用阿拉伯数字，不使用**加粗**，约150字`
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

请严格按以下格式输出，每个阶段用"====="单独一行分隔，最后以"=====总结"开头输出总结。不要输出任何阶段标题，直接从【外在推动】开始：

【外在推动】（2句，说明这个阶段世界在推你做什么，具体不空泛）
【内在阻力】（2句，说明你容易卡在哪里）
【核心矛盾】你被推动去[...]，但内在[...]（1句话，直接体现张力）
【行动建议】• [具体可执行的建议1] • [具体可执行的建议2] • [具体可执行的建议3]
【风险提醒】⚠ [一条具体风险，避免"提升自己"等空泛词]

=====

【外在推动】...
【内在阻力】...
【核心矛盾】...
【行动建议】...
【风险提醒】...

=====

【外在推动】...
【内在阻力】...
【核心矛盾】...
【行动建议】...
【风险提醒】...

=====

【外在推动】...
【内在阻力】...
【核心矛盾】...
【行动建议】...
【风险提醒】...

=====总结
【人生路径】主题A → 主题B → 主题C → 主题D（关键词式，体现四段变化）
【核心课题】（识别重复出现的挑战数，说明这一课题的含义）
【下一阶段预告】（当前阶段之后的下一段主题；若已是最后阶段则写"你正处于人生的最终巅峰"）

格式规则：全程用"你"，不提姓名，所有数字用阿拉伯数字，不使用**加粗**，严格保持=====分隔符，约400字。`
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

    const response = await fetch(SILICONFLOW_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: type === 'pinnacles' ? 800 : 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`SiliconFlow API error: ${response.status} ${errText}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content ?? ''
    return NextResponse.json({ text })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

