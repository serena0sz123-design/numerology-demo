'use client'

import { NumerologyResult } from '@/lib/numerology'

export default function PersonalYearSection({
  result,
  interpretation,
}: {
  result: NumerologyResult
  interpretation: string
}) {
  const years = result.personalYears.slice(1, 4)
  const currentYear = new Date().getFullYear()

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

      <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-main)' }}>
        {interpretation}
      </p>
    </div>
  )
}
