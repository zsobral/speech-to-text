import { assemblyAi } from "@/app/assembly-ai-client";
import TranscriptResult from "./transcript-result";

export default async function Transcript({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const transcript = await assemblyAi.transcripts.get(id);

  return (
    <div className="bg-gray-50">
      <TranscriptResult transcript={transcript} />
    </div>
  );
}
