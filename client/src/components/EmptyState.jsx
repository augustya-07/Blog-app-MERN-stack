export default function EmptyState({ title = 'Nothing here yet', text = 'Try changing your filters or check back later.' }) {
  return (
    <div className="rounded-md border border-dashed border-line bg-white px-6 py-12 text-center shadow-sm">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm text-ink/60">{text}</p>
    </div>
  );
}
