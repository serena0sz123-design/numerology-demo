'use client'

import { useState } from 'react'
import InputForm from '@/components/InputForm'
import ResultPanel from '@/components/ResultPanel'
import StarField from '@/components/StarField'
import { calcAll, NumerologyResult } from '@/lib/numerology'

function cleanText(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^-{3,}\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative mb-10" style={{ width: '140px', height: '140px' }}>
        <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ border: '1px solid rgba(201,168,76,0.35)' }} />
        <div className="absolute animate-pulse rounded-full" style={{ inset: '16px', border: '1px solid rgba(201,168,76,0.55)' }} />
        <div className="absolute rounded-full" style={{ inset: '32px', border: '1px solid rgba(201,168,76,0.2)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="animate-pulse text-3xl" style={{ color: 'var(--gold)' }}>✦</span>
        </div>
      </div>
      <p className="text-sm tracking-[0.3em]" style={{ color: 'var(--text-dim)' }}>
        正在解析您的生命密码
      </p>
    </div>
  )
}

const NUMBER_KEYS = ['lifePath', 'birthday', 'expression', 'soulUrge', 'personality']
const SECTION_KEYS = ['loshu', 'pinnacles', 'personalyear']

// ── MOCK MODE：测试用，上线前删除此块并恢复 fetchInterpret ──
const MOCK_MODE = true

const MOCK_DATA: Record<string, string> = {
  summary: `权力与表达的双重烙印：以掌控之力构建世界，以创造之光照亮他人。\n\n你天生具备强大的组织力与领导直觉，能在复杂局面中迅速找到核心，并以务实的方式推动事情落地。你的存在本身就是一种能量场。\n\n核心课题在于学会放下对结果的过度掌控，信任过程与他人的力量。当你允许自己"不完美地前进"，反而能到达更远的地方。`,
  lifePath: `8·权力与掌控\n\n你天生具备领导力和商业头脑，对权威和成就有本能的渴望。你的能量是务实的、有力量的，适合在需要决策力和资源整合的领域发光。财富和影响力对你而言是工具，而非终点。\n\n挑战在于警惕控制欲和对失败的恐惧。当事情不按计划进行时，你容易陷入焦虑甚至强硬推进。学会接受失控的部分，才能真正驾驭大局。\n\n给你的话：你已经拥有撬动世界的力量，现在需要的是松开一点手，让更多人愿意与你同行。`,
  birthday: `5·自由与冒险\n\n出生日5赋予你对变化的敏锐感知和适应力。你厌倦一成不变，喜欢探索不同的可能性，在多元环境中如鱼得水。这份灵活性是你的超能力。\n\n挑战是容易在太多选项中分散注意力，难以在某一方向上深耕。对自由的渴望有时会让你逃避真正需要承担的责任。\n\n给你的话：自由不是逃离，而是在你选择的事情上全然投入。`,
  expression: `3·创造与表达\n\n天赋数3意味着你有天生的语言天赋和创造力，能用语言、文字或艺术触动他人。你的表达方式往往充满感染力，能让复杂的事情变得生动易懂。\n\n挑战在于情绪化和注意力分散。当灵感枯竭或外界不给予反馈时，你容易陷入自我怀疑，失去创作的热情。\n\n给你的话：你的声音本身就是礼物，不需要等待完美时机才开口。`,
  soulUrge: `8·内在对成就的渴望\n\n灵魂深处，你渴望被认可为有能力、有影响力的人。成就感是你的核心驱动力，你对平庸有本能的抗拒。这股力量推动你不断突破自我设定的边界。\n\n当外在成就无法满足内心期待时，你容易产生深层的空虚感。学会区分"外在成功"和"内在满足"，是你一生的功课。\n\n给你的话：你追求的那些成就，本质上是为了证明自己的价值。而你的价值，早已存在。`,
  personality: `22/4·建筑师的面孔\n\n人格数22/4让你在他人眼中呈现出稳重、可靠、有原则的形象。你给人一种"值得托付"的感觉，在团队或关系中常常自然承担起"稳定锚"的角色。\n\n挑战是这种形象有时会让你压抑自己的感性和冲动，表现得过于严肃或不苟言笑。人们可能敬重你，但不一定真正了解你。\n\n给你的话：让人们看见你柔软的一面，不会削弱你的力量，只会让你更完整。`,
  loshu: `你的九宫格呈现出一个能量高度集中的命盘——数字分布偏向行动力与物质层面，精神与情感向度相对留白，这正是你成长的空间所在。\n\n缺失的数字提示你：在高效推进目标的同时，需要有意识地培养内省与感受力。这些"空缺"不是弱点，而是你尚未开发的潜力矿藏。\n\n整体来看，你的命盘具有强烈的建设者特质——你来这里是为了创造真实可见的影响，而非停留在想象中。`,
  pinnacles: `【外在推动】这一阶段世界推动你通过创造与表达建立自我存在感，写作、语言或艺术类场景频繁出现在你的轨道上。外部环境鼓励你展示个人风格、赢得他人认可，机会往往以"被看见"的形式出现。\n【内在阻力】挑战数1意味着你容易在需要独立做决定时产生自我怀疑，害怕"如果只靠自己会不会失败"。对他人认可的需求有时会消耗本该用于创造的能量。\n【核心矛盾】你被推动去大胆表达、站上舞台，但内在却不断质疑自己是否有资格成为那个发光的人。\n【行动建议】• 选择一个具体的表达载体持续输出满3个月，用频率代替质量焦虑 • 每次做决定前设定48小时截止期，强制独立判断 • 建立"被看见记录"，每周写下1件因你的表达产生连接的真实事件\n【风险提醒】⚠ 你容易把"还没准备好"当成合理借口，在机会出现时以打磨细节为由反复拖延。\n=====\n【外在推动】30岁起，世界要求你从表达者转变为建造者，职业架构、项目落地、财务基础搭建成为主旋律。系统性、可交付的工作方式开始被环境奖励。\n【内在阻力】挑战数2让你在合作关系中容易陷入要不要妥协的拉锯，搭档或上级的意见会频繁动摇你对自己方案的信心。\n【核心矛盾】你被推动去构建扎实的事业地基，但内在的自由本能不断发出"这不是我真正想要的生活"的警报。\n【行动建议】• 把一个核心项目分解为90天里程碑，每完成一个就庆祝 • 在重要合作中提前约定决策边界，减少消耗性摩擦 • 每季度做一次"这件事值得继续吗"的诚实复盘\n【风险提醒】⚠ 过于关注稳定而错过窗口期，在"再等等"中消耗黄金阶段的能量。\n=====\n【外在推动】这一阶段主题从建造转向深化，世界推动你成为某一领域真正的专家或精神引领者。真正属于你的独特视角开始显现价值。\n【内在阻力】挑战数1的课题再度浮现——你容易在获得一定成就后反而开始怀疑"这真的是我想要的吗"，对权威和体制产生抗拒。\n【核心矛盾】你被推动去深入一个方向并成为标杆，但内在的探索欲让你不断想往外看、往别处走。\n【行动建议】• 每年深度投入一个领域，拒绝分散注意力的"新机会" • 找一个你尊重的人做思想伙伴，定期对话 • 把你的专业见解写成可分享的内容，让影响力开始流动\n【风险提醒】⚠ 对"深度"的追求可能演变为孤立，警惕把自我封闭误认为内省。\n=====\n【外在推动】走过前三段的积累，这一阶段世界邀请你以更柔软、更宏观的方式影响他人。表达、连接与智慧传递成为核心主题。\n【内在阻力】挑战数1的最终课题：真正的独立不是不需要他人，而是在与他人深度连接的同时保持自我核心。\n【核心矛盾】你被推动去开放、分享与传递，但深层的独立意志让你难以真正放下防御、接受被需要。\n【行动建议】• 把你积累的智慧系统化，以导师或创作者的身份传递出去 • 练习"接受帮助"，让他人支持你完成更大的事 • 重新定义成功：不是你一个人做到多大，而是你帮助多少人走得更远\n【风险提醒】⚠ 晚年容易陷入"我早就知道了"的优越感，这会阻断真正有价值的连接。\n=====总结\n【人生路径】表达 → 建造 → 深化 → 传递\n【核心课题】挑战数1贯穿你的人生四格，核心课题是：在独立自主与真正连接他人之间找到平衡，学会在不失去自我的前提下依赖与被依赖。\n【下一阶段预告】你即将进入第二巅峰——建造阶段。世界开始考验你能否把想法变成实际成果，脚踏实地将是这一阶段最重要的能力。`,
  personalyear: `2026年（当前流年数6）\n这是关于责任、爱与关系修复的一年，家庭、合作与情感连接会成为核心议题。\n需要警惕过度付出导致自我消耗，在照顾他人的同时记得划定边界。\n\n2027年（流年数7）\n一个向内沉淀、深度思考的年份，适合学习、研究和精神探索。\n避免过度孤立，保持与外界的适度连接，防止钻牛角尖。\n\n2028年（流年数8）\n收获与权力运动的年份，过去几年的投入开始看到回报，职业与财务运势上升。\n警惕在成功面前变得傲慢或急于扩张，稳中求进才是关键。`,
}

async function fetchInterpret(body: { type: string; numberKey?: string }): Promise<string> {
  if (MOCK_MODE) {
    await new Promise(r => setTimeout(r, 300)) // 模拟加载感
    const key = body.type === 'number' ? (body.numberKey ?? '') : body.type
    return MOCK_DATA[key] ?? '（测试模式：暂无此项 mock 数据）'
  }
  const res = await fetch('/api/interpret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return cleanText(data.text || '')
}

export default function HomeClient() {
  const [phase, setPhase] = useState<'input' | 'loading' | 'result'>('input')
  const [result, setResult] = useState<NumerologyResult | null>(null)
  const [summary, setSummary] = useState('')
  const [interpretations, setInterpretations] = useState<Record<string, string>>({})
  const [sectionTexts, setSectionTexts] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  async function handleSubmit(name: string, birthDate: string) {
    setApiError('')
    setPhase('loading')
    try {
      const data = calcAll(name, birthDate)

      const [summaryText, ...allTexts] = await Promise.all([
        fetchInterpret({ type: 'summary', result: data }),
        ...NUMBER_KEYS.map(key => fetchInterpret({ type: 'number', numberKey: key, result: data })),
        ...SECTION_KEYS.map(type => fetchInterpret({ type, result: data })),
      ])

      const preloaded: Record<string, string> = {}
      NUMBER_KEYS.forEach((key, i) => { preloaded[key] = allTexts[i] })

      const sections: Record<string, string> = {}
      SECTION_KEYS.forEach((key, i) => { sections[key] = allTexts[NUMBER_KEYS.length + i] })

      setSummary(summaryText)
      setInterpretations(preloaded)
      setSectionTexts(sections)
      setResult(data)
      setPhase('result')
    } catch (e) {
      console.error('Error:', e)
      setApiError(e instanceof Error && e.message ? e.message : '网络错误，请重试')
      setPhase('input')
    }
  }

  function handleReset() {
    setResult(null)
    setSummary('')
    setInterpretations({})
    setSectionTexts({})
    setApiError('')
    setPhase('input')
  }

  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      <StarField />
      <div className="relative z-10">
        {phase === 'input' && (
          <InputForm onSubmit={handleSubmit} loading={false} apiError={apiError} />
        )}
        {phase === 'loading' && <LoadingScreen />}
        {phase === 'result' && result && (
          <ResultPanel
            result={result}
            summary={summary}
            interpretations={interpretations}
            sectionTexts={sectionTexts}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}
