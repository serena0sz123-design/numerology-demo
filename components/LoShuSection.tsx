'use client'

import { NumerologyResult } from '@/lib/numerology'

const LO_SHU_NUMBERS = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6],
]

const NUMBER_MEANINGS: Record<number, string> = {
  1: '领导力', 2: '合作', 3: '创造力',
  4: '稳定', 5: '自由', 6: '责任',
  7: '智慧', 8: '力量', 9: '人道',
}

export default function LoShuSection({
  result,
  interpretation,
}: {
  result: NumerologyResult
  interpretation: string
}) {
  const { counts, missing } = result.loShu

  return (
    <div>
      {/* 九宫格图示 */}
      <div className="flex justify-center mb-5">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: 'repeat(3, 72px)', gridTemplateRows: 'repeat(3, 72px)' }}
        >
          {LO_SHU_NUMBERS.flat().map((num, idx) => {
            const count = counts[num] || 0
            const hasNum = count > 0
            return (
              <div
                key={idx}
                className="rounded-lg flex flex-col items-center justify-center"
                style={{
                  background: hasNum
                    ? 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(124,58,237,0.1))'
                    : 'rgba(13,13,43,0.5)',
                  border: hasNum
                    ? '1px solid rgba(201,168,76,0.4)'
                    : '1px solid rgba(201,168,76,0.1)',
                }}
              >
                <span
                  className="text-xs mb-0.5"
                  style={{ color: hasNum ? 'var(--gold)' : 'var(--text-dim)', opacity: hasNum ? 1 : 0.3 }}
                >
                  {num}
                </span>
                <div className="flex gap-0.5">
                  {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className="rounded-full" style={{ width: '6px', height: '6px', background: 'var(--gold)' }} />
                  ))}
                  {count === 0 && (
                    <div className="rounded-full" style={{ width: '6px', height: '6px', background: 'rgba(136,136,170,0.2)' }} />
                  )}
                </div>
                <span className="text-[8px] mt-0.5" style={{ color: 'var(--text-dim)' }}>
                  {NUMBER_MEANINGS[num]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 缺失数字 */}
      {missing.length > 0 && (
        <div className="mb-4">
          <p className="text-xs tracking-wider mb-2" style={{ color: 'var(--gold)' }}>
            缺失数字 · Missing Numbers
          </p>
          <div className="flex gap-2 flex-wrap">
            {missing.map(n => (
              <span
                key={n}
                className="text-xs px-3 py-1 rounded-full"
                style={{ border: '1px solid rgba(201,168,76,0.3)', color: 'var(--text-dim)' }}
              >
                {n} · {NUMBER_MEANINGS[n]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI解读 */}
      <div className="space-y-3">
        {interpretation.split('\n\n').filter(Boolean).map((para, i) => (
          <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
            {para.trim()}
          </p>
        ))}
      </div>
    </div>
  )
}
