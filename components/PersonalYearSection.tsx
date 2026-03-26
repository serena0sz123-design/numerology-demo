'use client'

import { NumerologyResult } from '@/lib/numerology'

function parseInterpretation(text: string) {
  // Split at year headings like "2026年（...）"
  const parts = text.split(/(?=\d{4}年)/).filter(Boolean)
  return parts.map(part => {
    const newline = part.indexOf('\n')
    if (newline === -1) return { heading: part.trim(), body: '' }
    return {
      heading: part.slice(0, newline).trim(),
      body: part.slice(newline + 1).trim(),
    }
  })
}

export default function PersonalYearSection({
  result,
  interpretation,
}: {
  result: NumerologyResult
  interpretation: string
}) {
  const years = result.personalYears.slice(1, 4)
  const currentYear = new Date().getFullYear()
  const sections = parseInterpretation(interpretation)

  return (
    <div>
      {/* 三年数字展示 */}
      <div className="flex gap-3 mb-5">
        {years.map(({ year, number }) => {
          const isCurrent = year === currentYear
          return (
            <div
              key={year}
              className={`flex-1 rounded-xl p-4 text-center ${isCurrent ? 'current-highlight' : ''}`}
              style={{
                background: isCurrent
                  ? 'linear-gradient(135deg, rgba(201,168,76,0.22), rgba(124,58,237,0.15))'
                  : 'rgba(13,13,43,0.6)',
                border: isCurrent
                  ? '1px solid rgba(201,168,76,0.55)'
                  : '1px solid rgba(201,168,76,0.15)',
              }}
            >
              <div className="text-3xl font-bold text-gold mb-1" style={{ fontFamily: 'Georgia' }}>
                {number}
              </div>
              <div className="text-sm" style={{ color: isCurrent ? 'var(--text-main)' : 'var(--text-dim)' }}>
                {year}
              </div>
              {isCurrent && (
                <div className="text-[9px] mt-1 tracking-wider" style={{ color: 'var(--gold)' }}>
                  当前流年
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 逐年解读 */}
      {sections.length > 0 ? (
        <div className="space-y-4">
          {sections.map((s, i) => (
            <div key={i}>
              {s.heading && (
                <p className="text-sm mb-1.5" style={{ color: 'var(--text-dim)' }}>{s.heading}：</p>
              )}
              {s.body && (
                <div className="space-y-3">
                  {s.body.split('\n\n').filter(Boolean).map((para, j) => (
                    <p key={j} className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                      {para.trim()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {interpretation.split('\n\n').filter(Boolean).map((para, i) => (
            <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
              {para.trim()}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
