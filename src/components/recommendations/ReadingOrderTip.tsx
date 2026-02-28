'use client'

interface ReadingOrderTipProps {
  tip: string
}

export default function ReadingOrderTip({ tip }: ReadingOrderTipProps) {
  return (
    <div className="bg-bg-card border border-border rounded-card px-6 py-4 mb-8">
      <div className="flex items-start gap-3">
        <span className="text-lg shrink-0 mt-0.5">📖</span>
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[1px] text-ink-faint block mb-1">
            Reading Order Tip
          </span>
          <p className="text-[13px] text-ink-light leading-relaxed">{tip}</p>
        </div>
      </div>
    </div>
  )
}
