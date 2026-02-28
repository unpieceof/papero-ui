/** Format date to YYYY.MM.DD */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

/** Extract year from date string */
export function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear()
}

/** Generate paper number string like "No.012" */
export function formatPaperNumber(index: number): string {
  return `No.${String(index).padStart(3, '0')}`
}

/** Truncate text to maxLen with ellipsis */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen) + '...'
}

/** Get a deterministic pattern class from paper id */
export function getPatternClass(id: string): string {
  const patterns = ['pattern-1', 'pattern-2', 'pattern-3', 'pattern-4', 'pattern-5']
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return patterns[Math.abs(hash) % patterns.length]
}

/** Get a math symbol for thumbnail decoration */
export function getThumbSymbol(id: string): string {
  const symbols = ['Σ', 'Φ', '∂', 'π', '∞', '∇', 'θ', 'Ω', 'λ', 'δ']
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
  }
  return symbols[Math.abs(hash) % symbols.length]
}

/** Color presets for profile customization */
export const COLOR_PRESETS = [
  '#c0392b', '#e74c3c', '#d35400', '#f39c12',
  '#27ae60', '#2c3e8c', '#8e44ad', '#2c3e50',
]

/** Stamp icon presets */
export const STAMP_ICON_PRESETS = [
  '◉', '◈', '✦', '❋', '✿', '♠', '★', '◆',
]

/** Pattern background colors for card thumbnails */
export const PATTERN_BACKGROUNDS: Record<string, string> = {
  'pattern-1': '#2c2c2c',
  'pattern-2': '#3a3a3a',
  'pattern-3': '#1a1a1a',
  'pattern-4': '#333333',
  'pattern-5': '#282828',
}
