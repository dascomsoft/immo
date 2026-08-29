export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-12 h-12 border-4 border-stone-medium border-t-bronze rounded-full animate-spin"></div>
      <p className="mt-4 text-stone-light">Chargement en cours...</p>
    </div>
  )
}
