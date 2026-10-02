import LoadingCup from '@/components/ui/LoadingCup';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-coffee-dark/95 backdrop-blur-md">
      <LoadingCup size={240} />
    </div>
  );
}
