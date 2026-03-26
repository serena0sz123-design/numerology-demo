'use client'

import { useState } from 'react'

interface Props {
  onSubmit: (name: string, birthDate: string) => void
  loading: boolean
  apiError?: string
}

export default function InputForm({ onSubmit, loading, apiError }: Props) {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')
  const [month, setMonth] = useState('')
  const [day, setDay] = useState('')
  const [error, setError] = useState('')

  function validate() {
    if (!name.trim()) return '请输入您的姓名拼音或英文名'
    if (!/^[a-zA-Z\s]+$/.test(name)) return '姓名请使用字母（拼音或英文）'
    const y = parseInt(year), m = parseInt(month), d = parseInt(day)
    if (!year || !month || !day) return '请输入完整的出生日期'
    if (isNaN(y) || y < 1900 || y > new Date().getFullYear()) return '请输入正确的年份'
    if (isNaN(m) || m < 1 || m > 12) return '请输入正确的月份（1-12）'
    if (isNaN(d) || d < 1 || d > 31) return '请输入正确的日期（1-31）'
    return ''
  }

  function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    const birthDate = `${year}-${String(parseInt(month)).padStart(2, '0')}-${String(parseInt(day)).padStart(2, '0')}`
    onSubmit(name.trim(), birthDate)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      {/* 标题区 */}
      <div className="text-center mb-12 animate-fade-in-up">
        {/* 顶部装饰符号 */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="divider-gold w-16" />
          <span style={{ color: 'var(--gold)', fontSize: '20px' }}>✦</span>
          <div className="divider-gold w-16" />
        </div>

        <p className="text-sm tracking-[0.3em] mb-3" style={{ color: 'var(--gold)', fontFamily: 'Georgia' }}>
          PYTHAGOREAN NUMEROLOGY
        </p>
        <h1 className="text-5xl font-bold mb-3 text-gold" style={{ fontFamily: 'Georgia', letterSpacing: '0.05em' }}>
          数字命盘
        </h1>
        <p className="text-base" style={{ color: 'var(--text-dim)', letterSpacing: '0.2em' }}>
          THE NUMEROLOGY CHART
        </p>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="divider-gold w-16" />
          <span style={{ color: 'var(--gold)', fontSize: '20px' }}>✦</span>
          <div className="divider-gold w-16" />
        </div>

        <p className="mt-8 text-sm leading-relaxed max-w-sm mx-auto" style={{ color: 'var(--text-dim)' }}>
          数字是宇宙的语言，每个人的生命都藏着<br />独一无二的数字密码
        </p>
      </div>

      {/* 输入卡片 */}
      <div
        className="card-cosmic rounded-2xl p-8 w-full max-w-md animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 姓名 */}
          <div>
            <label className="block text-xs tracking-[0.2em] mb-2" style={{ color: 'var(--gold)' }}>
              YOUR NAME · 姓名拼音 / 英文名
            </label>
            <input
              type="text"
              placeholder="e.g. ZhangSan/Emma Watson"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-cosmic w-full rounded-lg px-4 py-3 text-sm"
            />
            <p className="mt-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
              中文名请输入拼音，如：张三 → Zhang San
            </p>
          </div>

          {/* 生日 */}
          <div>
            <label className="block text-xs tracking-[0.2em] mb-2" style={{ color: 'var(--gold)' }}>
              DATE OF BIRTH · 出生日期
            </label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="年 YYYY"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="input-cosmic w-full rounded-lg px-3 py-3 text-sm"
                inputMode="numeric"
                pattern="[0-9]*"
                suppressHydrationWarning
              />
              <input
                type="text"
                placeholder="月 MM"
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="input-cosmic w-full rounded-lg px-3 py-3 text-sm"
                inputMode="numeric"
                pattern="[0-9]*"
                suppressHydrationWarning
              />
              <input
                type="text"
                placeholder="日 DD"
                value={day}
                onChange={e => setDay(e.target.value)}
                className="input-cosmic w-full rounded-lg px-3 py-3 text-sm"
                inputMode="numeric"
                pattern="[0-9]*"
                suppressHydrationWarning
              />
            </div>
            <p className="mt-1.5 text-xs" style={{ color: 'var(--text-dim)' }}>
              请使用阳历日期
            </p>
          </div>

          {/* 错误提示 */}
          {(error || apiError) && (
            <p className="text-sm text-center" style={{ color: '#f87171' }}>{error || apiError}</p>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full rounded-xl py-4 text-sm tracking-[0.2em] mt-2"
            style={{ touchAction: 'manipulation' }}
          >
            {loading ? '测算中...' : '✦ 解读我的数字命盘 ✦'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-xs" style={{ color: 'var(--text-dim)', opacity: 0.5 }}>
        基于毕达哥拉斯数字命理学体系 · Pythagorean Numerology
      </p>
    </div>
  )
}
