import { assemblyAi } from "@/app/assembly-ai-client";
import TranscriptResult from "./transcript-result";
import ProcessingAudio from "./processing";
import Image from "next/image";
import Link from "next/link";

export default async function Transcript({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const transcript = await assemblyAi.transcripts.get(id);

  if (transcript.status !== "completed") {
    return <ProcessingAudio />;
  }

  return (
    <div className="bg-gray-50">
      <div className="flex flex-col items-center py-4">
        <Link href="https://assembly.ai/" target="_blank">
          <span className="text-sm">Powered by</span>
          <Image
            src="/assembly-ai.svg"
            width={140}
            height={24}
            alt="assembly ai logo"
          />
        </Link>
      </div>
      <TranscriptResult transcript={transcript} />
    </div>
  );
}
