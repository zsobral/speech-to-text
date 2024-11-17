"use client";

import { type Transcript, type TranscriptWord } from "assemblyai";
import {
  forwardRef,
  Fragment,
  ReactEventHandler,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { contentModeration, findNearestIndex } from "./utils";

export default function TranscriptResult({
  transcript,
}: {
  transcript: Transcript;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const markedRef = useRef<HTMLElement | null>(null);

  const wordsStart = useMemo(
    () => transcript.words!.map((word) => word.start),
    [transcript]
  );

  const handleWordClick = (word: TranscriptWord) => {
    const startInSeconds = word.start / 1000;

    audioRef.current!.currentTime = startInSeconds;
  };

  const handleOnTimeUpdate = () => {
    const startInMs = audioRef.current!.currentTime * 1000;
    const index = findNearestIndex(wordsStart, startInMs);
    const id = wordsStart[index];

    if (markedRef.current != null) {
      markedRef.current!.classList.remove("bg-amber-100");
    }

    markedRef.current = document.getElementById(`word-${id}`);
    if (markedRef.current != null) {
      markedRef.current!.classList.add("bg-amber-100");
    }
  };

  return (
    <>
      <Audio
        ref={audioRef}
        source={transcript.audio_url}
        onTimeUpdate={handleOnTimeUpdate}
      />
      <Transcript transcript={transcript} onWordClick={handleWordClick} />
    </>
  );
}

const Audio = forwardRef(function Audio(
  props: { source: string; onTimeUpdate: ReactEventHandler<HTMLAudioElement> },
  ref: React.Ref<HTMLAudioElement>
) {
  return (
    <div className="fixed bottom-0 py-4 bg-white border-t w-full">
      <div className="max-w-screen-md mx-auto">
        <audio
          controls
          ref={ref}
          onTimeUpdate={props.onTimeUpdate}
          style={{ width: "100%" }}
          controlsList="nodownload noplaybackrate"
        >
          <source src={props.source} />
        </audio>
      </div>
    </div>
  );
});
Audio.displayName = "Audio";

const Transcript = (props: {
  transcript: Transcript;
  onWordClick: (word: TranscriptWord) => void;
}) => {
  const wordsStart = useMemo(
    () => props.transcript.words!.map((word) => word.start),
    [props.transcript]
  );

  const wordsEnd = useMemo(
    () => props.transcript.words!.map((word) => word.end),
    [props.transcript]
  );

  const sentimentalAnalysis = useMemo(() => {
    return (
      props.transcript.sentiment_analysis_results?.map((result) => {
        const begin = findNearestIndex(wordsStart, result.start);
        const end = findNearestIndex(wordsEnd, result.end);

        return {
          ...result,
          wordsStart:
            props.transcript.words
              ?.slice(begin, end + 1)
              .map((word) => word.start) ?? [],
        };
      }) ?? []
    );
  }, [props.transcript, wordsStart, wordsEnd]);

  useEffect(() => {
    sentimentalAnalysis.forEach((analysis) => {
      const elements = document.querySelectorAll(
        analysis.wordsStart.map((wordStart) => `#word-${wordStart}`).join()
      );

      const span = document.createElement("span");

      if (analysis.sentiment === "NEGATIVE") {
        span.className = "bg-red-50";
      }

      if (analysis.sentiment === "POSITIVE") {
        span.className = "bg-green-100";
      }

      let parent: HTMLElement;

      elements.forEach((element, index) => {
        parent = element.parentElement!;

        if (index === 0) {
          parent!.insertBefore(span, element);
        }

        span.appendChild(element);
        span.appendChild(document.createTextNode(" "));
      });
    });
  }, [sentimentalAnalysis]);

  return (
    <div className="max-w-screen-md mx-auto pt-8 pb-24 bg-white px-8 shadow">
      <h1 className="font-bold text-2xl mb-4">{props.transcript.summary}</h1>
      <hr className="my-4" />
      <h2 className="font-bold text-lg mb-4">Content Safety</h2>

      {Object.keys(props.transcript.content_safety_labels!.summary).map(
        (key) => {
          const content = contentModeration(key);

          return (
            <p key={key} className="py-2">
              <span className="font-bold">{content?.label}:</span>{" "}
              {content?.description}
            </p>
          );
        }
      )}

      <hr className="my-4" />
      <h2 className="font-bold text-lg mb-4">Transcript</h2>
      {props.transcript.utterances?.map((utterance, index) => (
        <div key={index} className="py-2">
          <div className="font-bold">Speaker {utterance.speaker}</div>
          <p>
            {utterance.words.map((word, index) => (
              <Fragment key={index}>
                <span
                  id={`word-${word.start}`}
                  onClick={() => props.onWordClick(word)}
                >
                  {word.text}
                </span>{" "}
              </Fragment>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
};
