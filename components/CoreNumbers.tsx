'use client'

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

export default function CoreNumbers({ numbers, labels, activeNumber, onSelect, interpretations }: Props) {
  return (
    <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
      {/* 5个数字球 */}
      <div className="flex justify-center gap-3 flex-wrap mb-2">
        {numbers.map(({ key, value }) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className={`number-orb rounded-full flex flex-col items-center justify-center ${activeNumber === key ? 'active' : ''}`}
            style={{ width: '80px', height: '80px' }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: activeNumber === key ? '#f0d080' : 'var(--gold)', fontFamily: 'Georgia' }}
            >
              {formatMasterNum(value)}
            </span>
            <span className="text-[9px] tracking-wider mt-0.5" style={{ color: 'var(--text-dim)' }}>
              {labels[key]?.en.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* 点击提示 */}
      <p className="text-center text-xs mb-4" style={{ color: 'var(--text-dim)', letterSpacing: '0.15em' }}>
        点击数字 · 查看解读
      </p>

      {/* 展开的数字解读 */}
      {activeNumber && (
        <div className="card-cosmic rounded-xl p-5 animate-fade-in-up">
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
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-main)' }}>
            {interpretations[activeNumber] || ''}
          </p>
        </div>
      )}
    </div>
  )
}

