export default function Loading() {
  return (
    <div className="min-h-screen grid place-items-center bg-savanna-gradient">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-12 w-12">
          <div className="absolute inset-0 rounded-full border-4 border-forest/20" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-forest animate-spin" />
        </div>
        <p className="text-sm text-forest/70 font-medium">Loading…</p>
      </div>
    </div>
  );
}
