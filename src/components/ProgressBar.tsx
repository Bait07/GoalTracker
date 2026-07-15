export default function ProgressBar({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent))
  return (
    <div className="w-full bg-gray-200 rounded h-2">
      <div className="bg-blue-600 h-2 rounded" style={{ width: `${clamped}%` }} />
    </div>
  )
}
