"use client";

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

  return <div className="flex justify-center py-10">processing...</div>;
}
