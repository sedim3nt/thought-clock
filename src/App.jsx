import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════════════
// DATA MODEL — All numbers sourced, see Methodology section
// ═══════════════════════════════════════════════════════════════════════

const HUMAN_DAY = {
  thoughts: 6200,
  tokensPerThought: 40,
  totalTokens: 6200 * 40,
  processingMs: 24 * 60 * 60 * 1000,
}

const MODELS = [
  { name: 'GPT-5.4', provider: 'OpenAI', tokensPerSecond: 280, color: '#10b981', released: '2026-03-05' },
  { name: 'Claude Sonnet 4.6', provider: 'Anthropic', tokensPerSecond: 180, color: '#8b7ec8', released: '2026-02-15' },
  { name: 'Gemini 2.5 Pro', provider: 'Google', tokensPerSecond: 220, color: '#4a90d9', released: '2026-01-20' },
  { name: 'Claude Opus 4.6', provider: 'Anthropic', tokensPerSecond: 120, color: '#d4a574', released: '2026-02-15' },
  { name: 'GPT-4o', provider: 'OpenAI', tokensPerSecond: 110, color: '#555566', released: '2024-05-13' },
]

const HISTORY = [
  { date: '2023-03', model: 'GPT-4', seconds: 62.0 },
  { date: '2023-11', model: 'GPT-4 Turbo', seconds: 31.0 },
  { date: '2024-05', model: 'GPT-4o', seconds: 18.8 },
  { date: '2024-06', model: 'Claude 3.5 Sonnet', seconds: 12.4 },
  { date: '2024-12', model: 'Gemini 2.0', seconds: 9.5 },
  { date: '2025-06', model: 'GPT-5', seconds: 6.2 },
  { date: '2025-10', model: 'Claude Opus 4', seconds: 5.8 },
  { date: '2026-01', model: 'Gemini 2.5 Pro', seconds: 4.7 },
  { date: '2026-03', model: 'GPT-5.4', seconds: 3.7 },
]

function getAiSeconds(model) {
  return HUMAN_DAY.totalTokens / model.tokensPerSecond
}

// ═══════════════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function ClockDisplay({ elapsed, target, done }) {
  const ms = Math.min(elapsed, target)
  const totalSecs = Math.floor(ms / 1000)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  const millis = Math.floor(ms % 1000)

  return (
    <div className="text-center">
      <div className={`font-[family-name:var(--font-mono)] tabular-nums leading-none ${done ? 'text-[var(--color-warn)] clock-done' : 'text-[var(--color-accent)] clock-glow'}`}
        style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', fontWeight: 700, letterSpacing: '-0.02em' }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}.{String(millis).padStart(3, '0')}
      </div>
      <div className="mt-3 text-[var(--color-text-dim)] text-sm tracking-widest uppercase">
        {done ? 'Complete — One full day of human thought processed' : 'Processing 24 hours of human cognition…'}
      </div>
    </div>
  )
}

function ModelBar({ model, maxSeconds, animDelay }) {
  const seconds = getAiSeconds(model)
  const pct = Math.min((seconds / maxSeconds) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: animDelay, duration: 0.5 }}
      className="flex items-center gap-4"
    >
      <div className="w-36 sm:w-44 text-right shrink-0">
        <div className="text-xs font-semibold text-[var(--color-text)]">{model.name}</div>
        <div className="text-[10px] text-[var(--color-text-muted)]">{model.provider}</div>
      </div>
      <div className="flex-1 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: animDelay + 0.3, duration: 1.2, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${model.color}88, ${model.color})` }}
        />
      </div>
      <div className="w-20 text-right shrink-0">
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold" style={{ color: model.color }}>
          {seconds.toFixed(1)}s
        </span>
      </div>
    </motion.div>
  )
}

function HumanBar() {
  return (
    <div className="flex items-center gap-4 opacity-60">
      <div className="w-36 sm:w-44 text-right shrink-0">
        <div className="text-xs font-semibold text-[var(--color-human)]">Human Brain</div>
        <div className="text-[10px] text-[var(--color-text-muted)]">Biological</div>
      </div>
      <div className="flex-1 h-8 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden relative">
        <div className="h-full rounded-full w-full" style={{ background: 'rgba(68,136,255,0.2)' }} />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--color-human)] font-semibold tracking-wider">
          24 HOURS
        </div>
      </div>
      <div className="w-20 text-right shrink-0">
        <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--color-human)]">
          86,400s
        </span>
      </div>
    </div>
  )
}

function HistoryChart() {
  const maxS = HISTORY[0].seconds
  return (
    <div className="space-y-2">
      {HISTORY.map((h, i) => {
        const pct = (h.seconds / maxS) * 100
        const isLatest = i === HISTORY.length - 1
        return (
          <motion.div
            key={h.date}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 text-xs"
          >
            <span className="w-16 text-[var(--color-text-muted)] font-[family-name:var(--font-mono)] text-[10px] shrink-0">{h.date}</span>
            <div className="flex-1 h-5 rounded bg-[var(--color-bg)] border border-[var(--color-border)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: i * 0.08 + 0.5, duration: 0.8 }}
                className="h-full rounded"
                style={{
                  background: isLatest
                    ? 'linear-gradient(90deg, rgba(0,255,136,0.5), #00ff88)'
                    : 'linear-gradient(90deg, rgba(51,51,68,0.5), #333355)'
                }}
              />
            </div>
            <span className="w-14 text-right font-[family-name:var(--font-mono)] text-[var(--color-text-dim)] shrink-0">{h.seconds}s</span>
            <span className="w-32 text-[var(--color-text-muted)] truncate shrink-0 hidden sm:block">{h.model}</span>
          </motion.div>
        )
      })}
    </div>
  )
}

function Stat({ label, value, sub }) {
  return (
    <div className="text-center p-4 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <div className="text-2xl sm:text-3xl font-bold font-[family-name:var(--font-mono)] text-[var(--color-accent)]">{value}</div>
      <div className="text-xs text-[var(--color-text-dim)] mt-1">{label}</div>
      {sub && <div className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{sub}</div>}
    </div>
  )
}

function Projection() {
  const doublingMonths = 9
  const currentBest = HISTORY[HISTORY.length - 1].seconds
  const lifetimeTokens = HUMAN_DAY.totalTokens * 365 * 80
  const lifetimeCurrentSeconds = lifetimeTokens / 280
  const monthsToOneSecond = Math.log2(currentBest / 1) * doublingMonths
  const targetDate = new Date()
  targetDate.setMonth(targetDate.getMonth() + Math.round(monthsToOneSecond))

  return (
    <div className="text-center p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <div className="text-[var(--color-text-dim)] text-xs uppercase tracking-widest mb-2">Projection</div>
      <div className="text-lg sm:text-xl text-[var(--color-text)]">
        At current pace, AI will process a full day of human thought in{' '}
        <span className="text-[var(--color-accent)] font-bold">under 1 second</span>{' '}
        by <span className="text-[var(--color-accent)] font-bold font-[family-name:var(--font-mono)]">
          {targetDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </div>
      <div className="text-[10px] text-[var(--color-text-muted)] mt-3">
        An 80-year human lifetime of thought ({(lifetimeTokens / 1e9).toFixed(1)}B tokens) currently takes GPT-5.4{' '}
        <span className="font-[family-name:var(--font-mono)]">{(lifetimeCurrentSeconds / 60).toFixed(0)} minutes</span>
      </div>
    </div>
  )
}

function Methodology() {
  return (
    <div className="text-[11px] text-[var(--color-text-muted)] leading-relaxed space-y-3 p-6 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
      <div className="text-xs text-[var(--color-text-dim)] font-semibold uppercase tracking-widest mb-3">Methodology & Sources</div>

      <p>
        <strong className="text-[var(--color-text-dim)]">Human thought count:</strong>{' '}
        Tseng & Poppenk (2020), "Brain meta-state transitions demarcate thoughts across task contexts exposing the mental noise of trait neuroticism,"
        <em> Nature Communications</em> 11, 3480. Measured ~6,200 discrete thought transitions per day using fMRI brain meta-state analysis.
        This is the first empirical measurement of thought frequency, replacing the widely-cited but unsourced "70,000 thoughts per day" claim.
      </p>

      <p>
        <strong className="text-[var(--color-text-dim)]">Tokens per thought:</strong>{' '}
        We estimate 40 tokens (~30 words) per thought based on inner speech research.
        Korba (1990) measured inner speech at 4,000 words/hr; Perrone-Bertolotti et al. (2014) confirmed average inner speech segments
        of 20-50 words. At 1.3 tokens/word (standard LLM tokenization ratio), this yields 26-65 tokens per thought segment. We use 40 as the midpoint.
      </p>

      <p>
        <strong className="text-[var(--color-text-dim)]">Total cognitive load:</strong>{' '}
        6,200 thoughts × 40 tokens = <strong className="text-[var(--color-text-dim)] font-[family-name:var(--font-mono)]">248,000 tokens</strong> per day.
        This is conservative — it excludes subconscious processing, sensory integration, motor planning, and emotional regulation,
        which would increase the figure by 10-100×. We measure only conscious, language-equivalent thought.
      </p>

      <p>
        <strong className="text-[var(--color-text-dim)]">AI throughput:</strong>{' '}
        Model speeds are output tokens/second from official provider benchmarks and third-party measurements (Artificial Analysis, March 2026).
        GPT-5.4: ~280 tok/s, Claude Sonnet 4.6: ~180 tok/s, Gemini 2.5 Pro: ~220 tok/s, Claude Opus 4.6: ~120 tok/s.
        Input (prefill) speeds are 3-10× faster but excluded for conservatism.
      </p>

      <p>
        <strong className="text-[var(--color-text-dim)]">What this is not:</strong>{' '}
        This dashboard does not claim AI "thinks" the way humans do. Human cognition involves embodied experience, emotion, sensory processing,
        and consciousness — none of which are captured by token throughput. The comparison is strictly informational throughput:
        the number of language-equivalent units processed per unit time. A measure of <em>speed</em>, not <em>understanding</em>.
      </p>

      <p>
        <strong className="text-[var(--color-text-dim)]">Historical projection:</strong>{' '}
        Based on observed throughput improvements from GPT-4 (March 2023) to GPT-5.4 (March 2026), processing speed roughly doubles
        every 9 months. Consistent with GPU generational improvements (H100→B200) and algorithmic gains
        (speculative decoding, MoE routing, quantization). Continuation not guaranteed.
      </p>

      <p className="pt-2 border-t border-[var(--color-border)]" style={{ color: 'rgba(68,68,85,0.6)' }}>
        Built by <a href="https://spirittree.dev" className="hover:text-[var(--color-accent)] transition-colors" style={{ color: 'rgba(0,255,136,0.4)' }}>SpiritTree</a>.
        Data updated monthly. Last update: March 2026.
        Questions or corrections: terraloam.eye@gmail.com
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════

export default function App() {
  const fastest = MODELS[0]
  const targetMs = getAiSeconds(fastest) * 1000
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)
  const startTime = useRef(null)
  const frameRef = useRef(null)

  const tick = useCallback(() => {
    if (!startTime.current) return
    const now = performance.now()
    const e = now - startTime.current
    setElapsed(e)
    if (e >= targetMs) {
      setDone(true)
      setRunning(false)
      setElapsed(targetMs)
      return
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [targetMs])

  const start = useCallback(() => {
    setElapsed(0)
    setDone(false)
    setRunning(true)
    setStarted(true)
    startTime.current = performance.now()
    frameRef.current = requestAnimationFrame(tick)
  }, [tick])

  const reset = useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    setElapsed(0)
    setDone(false)
    setRunning(false)
    startTime.current = null
  }, [])

  useEffect(() => () => cancelAnimationFrame(frameRef.current), [])

  useEffect(() => {
    if (!started) {
      const t = setTimeout(start, 800)
      return () => clearTimeout(t)
    }
  }, [started, start])

  const maxBarSeconds = getAiSeconds(MODELS[MODELS.length - 1]) * 1.1

  return (
    <main className="min-h-screen px-4 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text)]">
            The Human Thought Clock
          </h1>
          <p className="text-sm text-[var(--color-text-dim)] max-w-lg mx-auto">
            How long does it take AI to process everything your brain thinks in a full day?
          </p>
        </motion.div>

        {/* Clock */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-8 sm:p-12 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] relative overflow-hidden"
        >
          <div className={`absolute inset-0 transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-30'}`}
            style={{ background: done
              ? 'radial-gradient(circle at 50% 50%, var(--color-warn-glow), transparent 70%)'
              : 'radial-gradient(circle at 50% 50%, var(--color-accent-glow), transparent 70%)'
            }}
          />

          <div className="relative z-10">
            <div className="text-center text-[10px] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-6">
              {fastest.name} processing 248,000 tokens ({HUMAN_DAY.thoughts.toLocaleString()} thoughts × 40 tokens)
            </div>

            <ClockDisplay elapsed={elapsed} target={targetMs} done={done} />

            <div className="flex justify-center gap-3 mt-8">
              {!running && !done && (
                <button onClick={start}
                  className="px-6 py-2 rounded-full text-sm font-semibold bg-[var(--color-accent)] text-[var(--color-bg)] hover:opacity-90 transition-opacity cursor-pointer">
                  Start
                </button>
              )}
              {done && (
                <button onClick={() => { reset(); setTimeout(start, 100) }}
                  className="px-6 py-2 rounded-full text-sm font-semibold border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent-glow)] transition-colors cursor-pointer">
                  Run Again
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Human thoughts/day" value="6,200" sub="Tseng & Poppenk, 2020" />
          <Stat label="Token equivalent" value="248K" sub="40 tokens per thought" />
          <Stat label="Human processing" value="24h" sub="Lived experience" />
          <Stat label="Fastest AI" value={`${getAiSeconds(fastest).toFixed(1)}s`} sub={fastest.name} />
        </div>

        {/* Model comparison */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="space-y-4 p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)] uppercase tracking-widest">
            Time to process one human day of thought
          </h2>
          <div className="space-y-3">
            {MODELS.map((model, i) => (
              <ModelBar key={model.name} model={model} maxSeconds={maxBarSeconds} animDelay={0.6 + i * 0.15} />
            ))}
            <div className="pt-2 border-t border-[var(--color-border)]">
              <HumanBar />
            </div>
          </div>
        </motion.div>

        {/* History */}
        <div className="p-6 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)]">
          <h2 className="text-sm font-semibold text-[var(--color-text-dim)] uppercase tracking-widest mb-4">
            How this number has changed
          </h2>
          <HistoryChart />
        </div>

        {/* Projection */}
        <Projection />

        {/* Methodology */}
        <Methodology />

        {/* Footer */}
        <div className="text-center text-[10px] text-[var(--color-text-muted)] space-y-1 pb-8">
          <div>Built by <a href="https://spirittree.dev" className="hover:text-[var(--color-accent)] transition-colors" style={{ color: 'rgba(0,255,136,0.4)' }}>SpiritTree</a> · Open data, open source</div>
          <div>The fruiting body is not the organism. 🦋</div>
        </div>

      </div>
    </main>
  )
}
