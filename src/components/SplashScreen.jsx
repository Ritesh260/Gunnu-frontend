import { useEffect, useState } from "react";

function SplashScreen({ onFinish }) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
      onFinish();
    }, 2800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (hide) return null;

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[99999] text-center">

      <div className="w-28 h-28 rounded-full bg-black flex items-center justify-center shadow-[0_0_30px_#8b0000] animate-pulse border-2 border-yellow-400 overflow-hidden">
        <img
          src="/logo2.png"
          alt="Logo"
          className="w-full h-full object-cover"
        />
      </div>

      <h1 className="mt-5 text-3xl md:text-4xl font-extrabold text-yellow-400 drop-shadow-[0_0_15px_#8b0000] tracking-wide">
        Gunnu Chinese Corner
      </h1>


      <p className="mt-2 text-gray-300 text-sm md:text-base">
        Authentic Chinese Taste • Fresh Ingredients • Fast Delivery
      </p>

      <div className="mt-6 flex gap-1">
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce delay-150"></span>
        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce delay-300"></span>
      </div>

      <p className="mt-3 text-gray-500 text-xs">
        Loading your delicious experience...
      </p>
    </div>
  );
}

export default SplashScreen;