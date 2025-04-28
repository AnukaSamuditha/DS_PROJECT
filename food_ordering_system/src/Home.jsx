import { DotBackgroundDemo } from "./components/magicui/dot-pattern";
import Lottie from "lottie-react";
import scooterMan from "./assets/scooter-person.json";
import { AnimatedGradientTextDemo } from "./components/magicui/gradient-button";
import { useAuth } from "./Providers/AuthProvider";
import { motion } from "framer-motion";

export default function Home() {
 
  return (
    <section className="w-full h-auto flex flex-col bg-black justify-center items-center">
      <div className="w-[80%] h-full absolute opacity-30">
        <DotBackgroundDemo />
      </div>
      <div className="w-full h-[100px] flex justify-center items-center mt-20 ">
        <AnimatedGradientTextDemo text="Deliver your order now!" />
      </div>
      <div className="w-full h-[120px] flex flex-col justify-center items-center">
        <h1 className="font-bold bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text text-transparent tracking-tight text-6xl z-50 text-center mb-3">
          Crave it? - We deliver it
        </h1>
        <p className="text-zinc-400 font-semibold text-xs text-center tracking-wide z-50">
          Hungry? Skip the wait and get your favorite meals delivered in
          minutes!{" "}
        </p>
      </div>
      <motion.div initial={{translateX:-400}} animate={{translateX:0,transition:{duration:2}}} className="w-full h-[300px] flex justify-center items-center absolute top-72">
        <Lottie
          animationData={scooterMan}
          loop={true}
          className="w-[300px] h-[300px]"
        />
      </motion.div>
    </section>
  );
}