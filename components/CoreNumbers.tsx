'use client'

import { useEffect } from 'react'
import { NumerologyResult } from '@/lib/numerology'

interface Props {
  numbers: { key: string; value: number }[]
  labels: Record<string, { zh: string; en: string }>
  activeNumber: string | null
  onSelect: (key: string) => void
  result: NumerologyResult
  interpretations: Record<string, string>
}

function formatMasterNum(value: number): string {
  if (value === 11) return '11/2'
  if (value === 22) return '22/4'
  if (value === 33) return '33/6'
  return String(value)
}

const NUMBER_HEADLINES: Record<string, string> = {
  lifePath:    '此生的核心课题与使命',
  birthday:    '与生俱来的天赋特质',
  expression:  '你给世界呈现的能力与潜力',
  soulUrge:    '内心最深的欲望与驱动',
  personality: '你给别人的第一印象',
}

interface ParsedNumber {
  keywords: string[]
  sections: { title: string; body: string }[]
}

function parseNumberInterpretation(text: string): ParsedNumber {
  const matches = [...text.matchAll(/【([^】]+)】([^【]*)/gs)]
  if (matches.length === 0) return { keywords: [], sections: [] }

  const keywords: string[] = []
  const sections: { title: string; body: string }[] = []

  for (const m of matches) {
    const title = m[1].trim()
    const body = m[2].trim()
    if (title === '关键词') {
      keywords.push(...body.split(/[··、,，]/).map(k => k.trim()).filter(Boolean))
    } else {
      sections.push({ title, body })
    }
  }

  return { keywords, sections }
}

export default function CoreNumbers({ numbers, labels, activeNumber, onSelect, interpretations }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const idx = numbers.findIndex(n => n.key === activeNumber)
      if (e.key === 'ArrowLeft') {
        const next = idx <= 0 ? numbers.length - 1 : idx - 1
        onSelect(numbers[next].key)
      }
      if (e.key === 'ArrowRight') {
        const next = idx < 0 || idx >= numbers.length - 1 ? 0 : idx + 1
        onSelect(numbers[next].key)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [numbers, activeNumber, onSelect])

  const orbButton = (key: string, value: number) => (
    <button
      key={key}
      onClick={() => onSelect(key)}
      className={`number-orb rounded-full flex flex-col items-center justify-center ${activeNumber === key ? 'active' : ''}`}
      style={{ width: '80px', height: '80px' }}
    >
      <span
        className="text-2xl font-bold"
        style={{ color: activeNumber === key ? '#f0d080' : 'var(--gold)', fontFamily: 'Georgia', lineHeight: 1 }}
      >
        {formatMasterNum(value)}
      </span>
      <span className="text-[8px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
        {labels[key]?.en}
      </span>
    </button>
  )

  return (
    <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* Desktop: 5 in a row */}
      <div className="hidden sm:flex justify-center gap-3 mb-2">
        {numbers.map(({ key, value }) => orbButton(key, value))}
      </div>

      {/* Mobile: 3 top + 2 bottom centered */}
      <div className="sm:hidden flex flex-col gap-3 mb-2">
        <div className="flex justify-center gap-3">
          {numbers.slice(0, 3).map(({ key, value }) => orbButton(key, value))}
        </div>
        <div className="flex justify-center gap-3">
          {numbers.slice(3).map(({ key, value }) => orbButton(key, value))}
        </div>
      </div>

      {/* 点击提示 */}
      <p className="text-center text-xs mb-4" style={{ color: 'var(--text-dim)', letterSpacing: '0.15em' }}>
        点击数字 · 查看解读
      </p>

      {/* 展开的数字解读 */}
      {activeNumber && (() => {
        const raw = interpretations[activeNumber] || ''
        const parsed = parseNumberInterpretation(raw)
        const hasStructure = parsed.sections.length > 0

        return (
          <div className="card-cosmic rounded-xl p-5 animate-fade-in-up">
            {/* 卡片头部 */}
            <div className="flex items-center gap-3 mb-1">
              <span className="text-2xl font-bold text-gold" style={{ fontFamily: 'Georgia' }}>
                {formatMasterNum(numbers.find(n => n.key === activeNumber)?.value ?? 0)}
              </span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>
                  {labels[activeNumber]?.zh} · {labels[activeNumber]?.en}
                </p>
                <p className="text-xs" style={{ color: 'var(--gold)', opacity: 0.8 }}>
                  {NUMBER_HEADLINES[activeNumber]}
                </p>
              </div>
            </div>
            <div className="divider-gold mb-3" />

            {/* 关键词标签 */}
            {parsed.keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {parsed.keywords.map(kw => (
                  <span key={kw} className="text-[10px] px-2.5 py-1.5 rounded-xl inline-flex items-center justify-center"
                    style={{ background: 'rgba(201,168,76,0.09)', color: 'rgba(201,168,76,0.85)', border: '1px solid rgba(201,168,76,0.18)' }}>
                    {kw}
                  </span>
                ))}
              </div>
            )}

            {/* 解读内容 */}
            {hasStructure ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {parsed.sections.map((s, i) => (
                  <div key={i}>
                    <p className="text-xs mb-1" style={{ color: 'var(--gold)' }}>{s.title}</p>
                    {s.body.split('\n\n').filter(Boolean).map((para, j) => (
                      <p key={j} className="text-sm leading-relaxed"
                        style={{ color: 'var(--text-main)', marginTop: j > 0 ? '8px' : 0 }}>
                        {para.trim()}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              /* 旧格式兼容 */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {raw.split('\n\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                    {para.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
