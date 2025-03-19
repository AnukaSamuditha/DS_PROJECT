import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { ChevronRight } from "lucide-react";

export function AnimatedGradientTextDemo({ text }) {
  return (
    <div className="group w-[220px] h-[30px] relative flex items-center justify-center rounded-full px-5 py-3 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
      {/* Gradient Border */}
      <div
        className="absolute inset-0 rounded-full p-[2px]"
        style={{
          background: "linear-gradient(to right, #ffaa40, #9c40ff, #ffaa40)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex items-center">
        🛵 <hr className="mx-2 h-4 w-px shrink-0 bg-neutral-500" />
        <AnimatedGradientText className="text-sm font-medium">{text}</AnimatedGradientText>
        <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
      </div>
    </div>
  );
}