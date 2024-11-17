import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src="/spinner.svg" alt="spinner" width={24} height={24} priority />
      <div>Loading</div>
    </div>
  );
}
