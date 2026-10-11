import { Coffee } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="w-14 h-14 rounded-full bg-[#C89B5E]/15 border border-[#C89B5E]/30 flex items-center justify-center text-[#C89B5E] animate-pulse">
        <Coffee className="w-7 h-7 animate-bounce" />
      </div>
      <div className="space-y-1 text-center">
        <p className="font-serif text-lg font-semibold text-[#F5E6D3]">
          Brewing Chocobliss...
        </p>
        <p className="text-xs text-[#F5E6D3]/60 font-sans tracking-wide">
          Preparing your artisanal coffee experience
        </p>
      </div>
    </div>
  );
}
