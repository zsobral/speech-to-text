"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProcessingAudio() {
  const router = useRouter();

  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src="/spinner.svg" alt="spinner" width={24} height={24} priority />
      <div>Please wait while the audio is being processed...</div>
    </div>
  );
}
