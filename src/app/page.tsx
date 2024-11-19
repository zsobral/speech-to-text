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
          className="text-blue-500 hover:underline block"
          href="/transcripts/a60ec53a-32df-4930-be47-ccffdafdf3d4"
        >
          wildfires.mp3
        </Link>
        <Link
          className="text-blue-500 hover:underline block"
          href="/transcripts/44894593-949a-4bde-bda2-ea9287e5d3a6"
        >
          steves.mp3
        </Link>

        <Link
          className="text-blue-500 hover:underline block"
          href="transcripts/3c4132c4-d26b-4094-9c59-704f49c89f7c"
        >
          kids.mp3
        </Link>
      </div>
    </div>
  );
}
