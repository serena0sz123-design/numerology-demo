'use client'

import { NumerologyResult, Pinnacle } from '@/lib/numerology'

export default function PinnaclesSection({
  result,
  interpretation,
}: {
  result: NumerologyResult
  interpretation: string
}) {
  const today = new Date()
  const birth = new Date(result.birthDate)
  const hadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate())
  const currentAge = today.getFullYear() - birth.getFullYear() - (hadBirthdayThisYear ? 0 : 1)

  function isCurrent(p: Pinnacle): boolean {
    return currentAge >= p.startAge && (p.endAge === null || currentAge < p.endAge)
  }

  const currentIndex = result.pinnacles.findIndex(isCurrent)
  const nextPinnacle = currentIndex >= 0 && currentIndex < result.pinnacles.length - 1
    ? result.pinnacles[currentIndex + 1]
    : null
  const currentPinnacle = currentIndex >= 0 ? result.pinnacles[currentIndex] : null

  return (
    <div>
      {/* Layer 1：概览卡片 */}
      <div className="flex gap-2 mb-6">
        {result.pinnacles.map((p, i) => {
          const current = isCurrent(p)
          return (
            <div key={i} className="flex-1 relative">
              <div
                className={`rounded-lg p-3 text-center ${current ? 'current-highlight' : ''}`}
                style={{
                  background: current
                    ? 'linear-gradient(135deg, rgba(201,168,76,0.22), rgba(124,58,237,0.15))'
                    : 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(124,58,237,0.05))',
                  border: current
                    ? '1px solid rgba(201,168,76,0.55)'
                    : '1px solid rgba(201,168,76,0.2)',
                }}
              >
                {/* 巅峰数 */}
                <div className="text-2xl font-bold text-gold mb-0.5" style={{ fontFamily: 'Georgia' }}>
                  {p.number}
                </div>
                {/* 挑战数 */}
                <div className="text-[10px] mb-1" style={{ color: 'rgba(180,160,220,0.7)' }}>
                  ▲{p.challenge}
                </div>
                <div className="text-xs mb-1" style={{ color: current ? 'var(--text-main)' : 'var(--text-dim)' }}>
                  {p.label}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                  {birth.getFullYear() + p.startAge}{p.endAge ? `–${birth.getFullYear() + p.endAge}` : '+'}
                </div>
                <div className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                  {p.startAge}岁{p.endAge ? `–${p.endAge}岁` : '以后'}
                </div>
                {current && (
                  <div className="text-[9px] mt-1 tracking-wider" style={{ color: 'var(--gold)' }}>
                    当前周期
                  </div>
                )}
              </div>
              {i < result.pinnacles.length - 1 && (
                <div
                  className="absolute top-1/2 -right-1 z-10 text-xs"
                  style={{ color: 'var(--gold)', transform: 'translateY(-50%)' }}
                >›</div>
              )}
            </div>
          )
        })}
      </div>

      {/* 图例说明 */}
      <div className="flex gap-4 mb-5 text-[10px]" style={{ color: 'var(--text-dim)' }}>
        <span><span style={{ color: 'var(--gold)' }}>数字</span> = 巅峰数（外在主题）</span>
        <span><span style={{ color: 'rgba(180,160,220,0.8)' }}>▲数字</span> = 挑战数（内在阻力）</span>
      </div>

      {/* Layer 2：AI 阶段详情解读 */}
      <p className="text-sm leading-relaxed whitespace-pre-line mb-6" style={{ color: 'var(--text-main)' }}>
        {interpretation}
      </p>

      {/* Layer 4：趋势提示 */}
      {(currentPinnacle || nextPinnacle) && (
        <div className="flex flex-col gap-2">
          {currentPinnacle && (
            <div
              className="rounded-lg px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(180,160,220,0.08)', border: '1px solid rgba(180,160,220,0.2)' }}
            >
              <span className="text-xs mt-0.5" style={{ color: 'rgba(180,160,220,0.7)' }}>▲</span>
              <div>
                <p className="text-[10px] tracking-wider mb-0.5" style={{ color: 'rgba(180,160,220,0.6)' }}>
                  当前挑战数 {currentPinnacle.challenge}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  这是你此阶段的内在成长课题，也是突破的核心方向。
                </p>
              </div>
            </div>
          )}
          {nextPinnacle && (
            <div
              className="rounded-lg px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)' }}
            >
              <span className="text-xs mt-0.5" style={{ color: 'rgba(201,168,76,0.5)' }}>→</span>
              <div>
                <p className="text-[10px] tracking-wider mb-0.5" style={{ color: 'rgba(201,168,76,0.5)' }}>
                  下一阶段 {nextPinnacle.label}（{nextPinnacle.startAge}岁起）
                </p>
                <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                  巅峰数 {nextPinnacle.number} · 挑战数 {nextPinnacle.challenge}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
