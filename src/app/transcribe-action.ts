"use server";

import { assemblyAi } from "./assembly-ai-client";

export type TranscribeActionState = {
  transcriptId: string | null;
};

export async function transcribeAction(
  prevState: TranscribeActionState,
  formData: FormData
): Promise<TranscribeActionState> {
  const audioUrl = formData.get("audio-url") as string;

  const result = await assemblyAi.transcripts.transcribe({
    audio_url: audioUrl,
    content_safety: true,
    speaker_labels: true,
    sentiment_analysis: true,
    summarization: true,
    summary_type: "headline",
    summary_model: "conversational",
  });

  return { transcriptId: result.id };
}
