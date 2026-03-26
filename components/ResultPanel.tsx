'use client'

import { useState } from 'react'
import { NumerologyResult } from '@/lib/numerology'
import CoreNumbers from './CoreNumbers'
import LoShuSection from './LoShuSection'
import PinnaclesSection from './PinnaclesSection'
import PersonalYearSection from './PersonalYearSection'

interface Props {
  result: NumerologyResult
  summary: string
  interpretations: Record<string, string>
  sectionTexts: Record<string, string>
  onReset: () => void
}

const NUMBER_LABELS: Record<string, { zh: string; en: string }> = {
  lifePath:    { zh: '生命数', en: 'Life Path' },
  birthday:    { zh: '生日数', en: 'Birthday' },
  expression:  { zh: '天赋数', en: 'Expression' },
  soulUrge:    { zh: '灵魂数', en: 'Soul Urge' },
  personality: { zh: '人格数', en: 'Personality' },
}

export default function ResultPanel({ result, summary, interpretations, sectionTexts, onReset }: Props) {
  const [activeNumber, setActiveNumber] = useState<string | null>(null)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  const coreNumbers = [
    { key: 'lifePath',    value: result.lifePath },
    { key: 'birthday',    value: result.birthday },
    { key: 'expression',  value: result.expression },
    { key: 'soulUrge',    value: result.soulUrge },
    { key: 'personality', value: result.personality },
  ]

  function toggleAccordion(key: string) {
    setOpenAccordion(prev => prev === key ? null : key)
  }

  return (
    <div className="min-h-screen px-4 py-12 max-w-2xl mx-auto">
      {/* 顶部：用户信息 */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="divider-gold w-12"></div>
          <span style={{ color: 'var(--gold)', fontSize: '16px' }}>✦</span>
          <div className="divider-gold w-12"></div>
        </div>
        <p className="text-xs tracking-[0.3em] mb-1" style={{ color: 'var(--gold)' }}>NUMEROLOGY CHART</p>
        <h2 className="text-2xl font-bold text-gold mb-1" style={{ fontFamily: 'Georgia' }}>
          {result.name.toUpperCase()}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
          {result.birthDate.replace(/-/g, ' · ')}
        </p>
      </div>

      {/* 第一区：5个核心数字 */}
      <CoreNumbers
        numbers={coreNumbers}
        labels={NUMBER_LABELS}
        activeNumber={activeNumber}
        onSelect={key => setActiveNumber(prev => prev === key ? null : key)}
        result={result}
        interpretations={interpretations}
      />

      <div className="card-cosmic rounded-2xl p-6 mb-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <p className="text-xs tracking-[0.2em] mb-3" style={{ color: 'var(--gold)' }}>
          ✦ 命盘整体解读 · CHART READING
        </p>
        {(() => {
          const parts = summary.split('\n\n')
          const highlight = parts[0]
          const body = parts.slice(1).join('\n\n')
          return (
            <>
              <p className="text-sm font-semibold leading-relaxed mb-3"
                style={{ color: 'var(--gold)', fontFamily: 'Georgia', letterSpacing: '0.03em' }}>
                {highlight}
              </p>
              {body && (
                <div className="space-y-3">
                  {body.split('\n\n').filter(Boolean).map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: 'var(--text-main)' }}>
                      {para.trim()}
                    </p>
                  ))}
                </div>
              )}
            </>
          )
        })()}
      </div>

      {/* 第二区：风琴式展开 */}
      <div className="flex flex-col gap-3 mb-6">
        <AccordionSection
          id="pinnacles"
          title="人生四格 · 巅峰周期"
          subtitle="Four Pinnacles"
          icon="◈"
          isOpen={openAccordion === 'pinnacles'}
          onToggle={() => toggleAccordion('pinnacles')}
        >
          <PinnaclesSection result={result} interpretation={sectionTexts.pinnacles || ''} />
        </AccordionSection>

        <AccordionSection
          id="personalyear"
          title="近三年流年解读"
          subtitle="Personal Year"
          icon="◎"
          isOpen={openAccordion === 'personalyear'}
          onToggle={() => toggleAccordion('personalyear')}
        >
          <PersonalYearSection result={result} interpretation={sectionTexts.personalyear || ''} />
        </AccordionSection>

        <AccordionSection
          id="loshu"
          title="命理九宫格"
          subtitle="Lo Shu Grid"
          icon="⬡"
          isOpen={openAccordion === 'loshu'}
          onToggle={() => toggleAccordion('loshu')}
        >
          <LoShuSection result={result} interpretation={sectionTexts.loshu || ''} />
        </AccordionSection>
      </div>

      {/* 下一版迭代示意 */}
      <div className="flex flex-col gap-3 mb-10">
        <div
          className="rounded-xl px-6 py-5 flex items-center justify-between"
          style={{ background: 'rgba(13,13,43,0.3)', border: '1px solid rgba(136,136,170,0.12)' }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: 'rgba(136,136,170,0.35)', fontSize: '18px' }}>◈</span>
            <div>
              <p className="text-sm font-medium" style={{ color: 'rgba(136,136,170,0.5)' }}>合盘解读</p>
              <p className="text-xs" style={{ color: 'rgba(136,136,170,0.35)' }}>你和TA的命数合盘测算</p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs" style={{ color: 'rgba(136,136,170,0.3)', letterSpacing: '0.1em' }}>
          开发ing，期待见面
        </p>
      </div>

      {/* 重新测算 */}
      <div className="text-center mb-12">
        <button
          onClick={onReset}
          className="text-xs tracking-[0.2em] px-6 py-2 rounded-full border transition-all hover:opacity-80"
          style={{ borderColor: 'rgba(201,168,76,0.3)', color: 'var(--gold)' }}
        >
          ← 重新测算
        </button>
      </div>
    </div>
  )
}

// 风琴组件
function AccordionSection({
  title, subtitle, icon, isOpen, onToggle, children
}: {
  id: string
  title: string
  subtitle: string
  icon: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) {
  return (
    <div className={`accordion-item card-cosmic rounded-xl overflow-hidden ${isOpen ? 'open' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left transition-all"
      >
        <div className="flex items-center gap-3">
          <span style={{ color: 'var(--gold)', fontSize: '18px' }}>{icon}</span>
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-main)' }}>{title}</p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>{subtitle}</p>
          </div>
        </div>
        <span
          className="text-lg transition-transform duration-300"
          style={{
            color: 'var(--gold)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}
        >
          ⌄
        </span>
      </button>

      {isOpen && (
        <div className="px-6 pb-6 animate-fade-in-up">
          <div className="divider-gold mb-4"></div>
          {children}
        </div>
      )}
    </div>
  )
}

