import { assemblyAi } from "@/app/assembly-ai-client";
import TranscriptResult from "./transcript-result";
import ProcessingAudio from "./processing";

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
      <TranscriptResult transcript={transcript} />
    </div>
  );
}
