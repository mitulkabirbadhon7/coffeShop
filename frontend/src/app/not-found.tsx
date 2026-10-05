import Link from "next/link";
import { Coffee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-lg w-full space-y-8">
        <div className="relative inline-block">
          <span className="font-serif text-8xl sm:text-9xl font-extrabold text-[#C89B5E]/20 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#6B4423]/30 border border-[#C89B5E]/40 flex items-center justify-center text-[#C89B5E] shadow-lg">
              <Coffee className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F5E6D3]">
            Coffee Spilled, Cup Missing
          </h2>
          <p className="text-base text-[#F5E6D3]/75 font-sans max-w-md mx-auto leading-relaxed">
            The vintage blend or roastery page you are seeking seems to have evaporated or moved to another shelf.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/">
            <Button
              variant="primary"
              className="inline-flex items-center gap-2 px-8 py-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to the Roastery</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
