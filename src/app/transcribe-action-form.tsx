"use client";

import { useActionState, useEffect } from "react";
import {
  transcribeAction,
  type TranscribeActionState,
} from "./transcribe-action";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

const initialState: TranscribeActionState = {
  transcriptId: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-sky-500 px-2 py-2 rounded w-full my-4 text-white font-bold disabled:bg-slate-500"
    >
      {pending ? "Loading..." : "Submit"}
    </button>
  );
}

export default function TranscribeActionForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(transcribeAction, initialState);

  useEffect(() => {
    if (state.transcriptId != null) {
      router.push(`/transcripts/${state.transcriptId}`);
    }
  }, [router, state.transcriptId]);

  return (
    <form action={formAction}>
      <label
        htmlFor="audio-url"
        className="block text-sm font-medium text-slate-700 mb-2"
      >
        Audio URL
      </label>
      <input
        id="audio-url"
        type="url"
        name="audio-url"
        required
        className="block w-full border border-slate-300 rounded-md py-2 px-2 focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1"
      />

      <SubmitButton />
    </form>
  );
}
