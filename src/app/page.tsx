import Link from "next/link";
import TranscribeActionForm from "./transcribe-action-form";

export default async function Home() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <div className="min-w-96 mx-auto p-8 bg-white rounded drop-shadow">
        <h1 className="font-bold text-lg mb-4">Transcribe</h1>
        <TranscribeActionForm />
        <hr className="my-4" />

        <h2 className="font-bold text-md">Demo</h2>
        <Link
          className="text-blue-500 hover:underline"
          href="/transcripts/a60ec53a-32df-4930-be47-ccffdafdf3d4"
        >
          wildfires.mp3
        </Link>
      </div>
    </div>
  );
}
