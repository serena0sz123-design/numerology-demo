'use client'

import { useState } from 'react'
import { NumerologyResult } from '@/lib/numerology'

// ── Number keyword mappings ────────────────────────────────
const PINNACLE_KW: Record<number, string[]> = {
  1: ['领导', '开创', '独立'], 2: ['合作', '平衡', '直觉'],
  3: ['创造', '表达', '社交'], 4: ['建设', '秩序', '稳定'],
  5: ['自由', '变化', '探索'], 6: ['责任', '爱', '和谐'],
  7: ['智慧', '内省', '探寻'], 8: ['权力', '成就', '掌控'],
  9: ['慈悲', '完成', '宏观'], 11: ['灵性', '启发', '直觉'],
  22: ['宏图', '实践', '影响'], 33: ['疗愈', '奉献', '指引'],
}

const CHALLENGE_KW: Record<number, string[]> = {
  0: ['全维挑战'], 1: ['独断', '自负'], 2: ['优柔', '敏感'],
  3: ['散漫', '逃避'], 4: ['僵化', '执控'], 5: ['冲动', '不稳'],
  6: ['完美主义', '过付'], 7: ['封闭', '怀疑'],
  8: ['权力执念', '物质'], 9: ['难放下', '理想化'],
}

// ── Parsing ───────────────────────────────────────────────
interface ParsedStage {
  external: string
  resistance: string
  tension: string
  advice: string[]
  risk: string
}
interface ParsedSummary { path: string; lesson: string; nextStage: string }

function extractSection(text: string, marker: string): string {
  const m = text.match(new RegExp(`【${marker}】([^【]*)`, 's'))
  return m ? m[1].trim() : ''
}

function parseInterpretation(text: string): { stages: ParsedStage[]; summary: ParsedSummary } {
  // Split summary first
  const summaryIdx = text.search(/={3,}\s*总结/)
  const mainText = summaryIdx >= 0 ? text.slice(0, summaryIdx) : text
  const summaryText = summaryIdx >= 0 ? text.slice(summaryIdx) : ''

  // Split stages by ===== separator
  let stageParts = mainText.split(/={3,}/).map(s => s.trim()).filter(Boolean)

  // Fallback: if we didn't get 4 parts, split by 【外在推动】 lookahead
  if (stageParts.length !== 4) {
    const chunks = mainText.split(/(?=【外在推动】)/).map(s => s.trim()).filter(Boolean)
    if (chunks.length > stageParts.length) stageParts = chunks
  }

  // Take up to 4 stage parts
  stageParts = stageParts.slice(0, 4)

  const stages: ParsedStage[] = stageParts.map(part => {
    const advText = extractSection(part, '行动建议')
    const advice = advText.split('•').map(s => s.trim()).filter(Boolean)
    return {
      external: extractSection(part, '外在推动'),
      resistance: extractSection(part, '内在阻力'),
      tension: extractSection(part, '核心矛盾'),
      advice,
      risk: extractSection(part, '风险提醒').replace(/^⚠\s*/, ''),
    }
  })

  // Pad to 4
  while (stages.length < 4) {
    stages.push({ external: '', resistance: '', tension: '', advice: [], risk: '' })
  }

  return {
    stages,
    summary: {
      path: extractSection(summaryText, '人生路径'),
      lesson: extractSection(summaryText, '核心课题'),
      nextStage: extractSection(summaryText, '下一阶段预告'),
    },
  }
}

// ── Section label component (unified style) ───────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-sm mb-1.5" style={{ color: 'var(--text-dim)' }}>
      {children}
    </p>
  )
}

// ── Main Component ────────────────────────────────────────
export default function PinnaclesSection({
  result,
  interpretation,
}: {
  result: NumerologyResult
  interpretation: string
}) {
  const today = new Date()
  const birth = new Date(result.birthDate)
  const hadBirthday =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  const currentAge = today.getFullYear() - birth.getFullYear() - (hadBirthday ? 0 : 1)

  function isCurrent(p: { startAge: number; endAge: number | null }) {
    return currentAge >= p.startAge && (p.endAge === null || currentAge < p.endAge)
  }

  const currentIndex = result.pinnacles.findIndex(isCurrent)
  const [activeIndex, setActiveIndex] = useState(currentIndex >= 0 ? currentIndex : 0)

  const { stages, summary } = parseInterpretation(interpretation)
  const activePinnacle = result.pinnacles[activeIndex]
  const activeStage = stages[activeIndex]
  const birthYear = birth.getFullYear()

  function ageLabel(p: { startAge: number; endAge: number | null }) {
    return `${p.startAge}–${p.endAge ?? '∞'}岁`
  }

  const hasParsed = activeStage.external || activeStage.resistance || activeStage.tension

  return (
    <div className="space-y-4">

      {/* ── Layer 1: Timeline ── */}
      <div className="flex gap-2">
        {result.pinnacles.map((p, i) => {
          const current = isCurrent(p)
          const active = i === activeIndex
          return (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className="flex-1 rounded-xl p-2.5 text-center transition-all"
              style={{
                background: active
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.18), rgba(124,58,237,0.1))'
                  : 'rgba(255,255,255,0.02)',
                border: active
                  ? '1px solid rgba(201,168,76,0.55)'
                  : '1px solid rgba(255,255,255,0.07)',
                boxShadow: current && active ? '0 0 14px rgba(201,168,76,0.15)' : 'none',
              }}
            >
              <div className="text-2xl font-bold" style={{ color: 'var(--gold)', fontFamily: 'Georgia', lineHeight: 1 }}>
                {p.number}
              </div>
              <div className="text-[11px]" style={{ color: 'rgba(160,140,220,0.8)' }}>▲{p.challenge}</div>
              <div className="text-[10px] mt-1" style={{ color: active ? 'var(--text-main)' : 'var(--text-dim)' }}>
                第{['一','二','三','四'][i]}巅峰
              </div>
              <div className="text-[9px]" style={{ color: 'var(--text-dim)' }}>{ageLabel(p)}</div>
              {current && (
                <div className="text-[8px] mt-1 tracking-wider" style={{ color: 'var(--gold)' }}>◉ 当前</div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px]" style={{ color: 'var(--text-dim)' }}>
        <span><span style={{ color: 'var(--gold)' }}>大数字</span> = 巅峰数（外在推动）</span>
        <span><span style={{ color: 'rgba(160,140,220,0.8)' }}>▲</span> = 挑战数（内在阻力）</span>
      </div>

      {/* ── Layer 2: Active Stage Detail ── */}
      <div className="space-y-4 pt-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs tracking-wider mb-1" style={{ color: 'var(--gold)' }}>
              {activePinnacle.label} · {ageLabel(activePinnacle)}
              · {birthYear + activePinnacle.startAge}{activePinnacle.endAge ? `–${birthYear + activePinnacle.endAge}` : '+'}
            </p>
            {isCurrent(activePinnacle) && (
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>◉ 当前阶段</p>
            )}
          </div>
          {/* 外在 · 内在 pill badges */}
          <div className="flex gap-2 shrink-0">
            <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--gold)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }}></span>
              外在 {activePinnacle.number}
            </span>
            <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5"
              style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.28)', color: 'rgba(180,160,240,1)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(180,160,240,1)' }}></span>
              内在 {activePinnacle.challenge}
            </span>
          </div>
        </div>

        {/* Keywords — unified pill style */}
        <div className="flex flex-wrap gap-1.5">
          {(PINNACLE_KW[activePinnacle.number] ?? []).map(kw => (
            <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(201,168,76,0.09)', color: 'rgba(201,168,76,0.85)', border: '1px solid rgba(201,168,76,0.18)' }}>
              {kw}
            </span>
          ))}
          {(CHALLENGE_KW[activePinnacle.challenge] ?? []).map(kw => (
            <span key={kw} className="text-[10px] px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(124,58,237,0.09)', color: 'rgba(160,140,220,0.85)', border: '1px solid rgba(124,58,237,0.18)' }}>
              {kw}
            </span>
          ))}
        </div>

        {/* Structured sections */}
        {hasParsed ? (
          <div className="space-y-4">
            {activeStage.external && (
              <div>
                <SectionLabel>外在推动</SectionLabel>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>{activeStage.external}</p>
              </div>
            )}
            {activeStage.resistance && (
              <div>
                <SectionLabel>内在阻力</SectionLabel>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>{activeStage.resistance}</p>
              </div>
            )}
            {activeStage.tension && (
              <div>
                <SectionLabel>核心矛盾</SectionLabel>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>{activeStage.tension}</p>
              </div>
            )}
            {activeStage.advice.length > 0 && (
              <div>
                <SectionLabel>行动建议</SectionLabel>
                <div className="space-y-1.5">
                  {activeStage.advice.map((a, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                      · {a}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {activeStage.risk && (
              <div>
                <SectionLabel>风险提醒</SectionLabel>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-dim)' }}>{activeStage.risk}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-main)' }}>
            {interpretation}
          </p>
        )}
      </div>
    </div>
  )
}
