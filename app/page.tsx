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

async function fetchInterpret(body: object): Promise<string> {
  const res = await fetch('/api/interpret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  return cleanText(data.text || '')
}

export default function Home() {
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
        <div style={phase !== 'input' ? { display: 'none' } : undefined}>
          <InputForm onSubmit={handleSubmit} loading={false} apiError={apiError} />
        </div>
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

