"use client";

import {
  ContentSafetyLabelsResult,
  SentimentAnalysisResult,
  type Transcript,
  type TranscriptWord,
} from "assemblyai";
import Link from "next/link";
import {
  forwardRef,
  Fragment,
  ReactEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { contentModeration, isElementVisible } from "./utils";
import { Checkbox } from "@/app/ui/checkbox";
import { H1, H2 } from "@/app/ui/typography";
import { Divider } from "@/app/ui/divider";

export default function TranscriptResult({
  transcript,
}: {
  transcript: Transcript;
}) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [showConfidence, setShowConfidence] = useState<boolean>(false);
  const [showContentSafety, setShowContentSafety] = useState<boolean>(false);
  const [showSentimentalAnalysis, setShowSentimentalAnalysis] =
    useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const handleWordClick = (word: TranscriptWord) => {
    const startInSeconds = word.start / 1000;

    audioRef.current!.currentTime = startInSeconds;
  };

  const handleOnTimeUpdate = () => {
    const startInMs = audioRef.current!.currentTime * 1000;

    setCurrentTime(startInMs);
  };

  return (
    <>
      <div className="fixed bottom-0 py-4 bg-white border-t w-full">
        <div className="max-w-screen-md mx-auto">
          <div className="flex justify-center mb-2">
            <Checkbox
              id="show-confidence"
              label="Confidence"
              checked={showConfidence}
              onChange={() => setShowConfidence(!showConfidence)}
            />
            <div className="w-4" />
            <Checkbox
              id="show-sentimental"
              label="Sentimental Analysis"
              checked={showSentimentalAnalysis}
              onChange={() =>
                setShowSentimentalAnalysis(!showSentimentalAnalysis)
              }
            />
            <div className="w-4" />
            <Checkbox
              id="show-content-safety"
              label="Content Safety"
              checked={showContentSafety}
              onChange={() => setShowContentSafety(!showContentSafety)}
            />
          </div>
          <Audio
            ref={audioRef}
            source={transcript.audio_url}
            onTimeUpdate={handleOnTimeUpdate}
          />
        </div>
      </div>
      <Transcript
        currentTime={currentTime}
        transcript={transcript}
        onWordClick={handleWordClick}
        showConfidence={showConfidence}
        showSentimentalAnalysis={showSentimentalAnalysis}
        showContentSafety={showContentSafety}
      />
    </>
  );
}

const Audio = forwardRef(function Audio(
  props: { source: string; onTimeUpdate: ReactEventHandler<HTMLAudioElement> },
  ref: React.Ref<HTMLAudioElement>
) {
  return (
    <audio
      controls
      ref={ref}
      onTimeUpdate={props.onTimeUpdate}
      style={{ width: "100%" }}
      controlsList="nodownload noplaybackrate"
    >
      <source src={props.source} />
    </audio>
  );
});
Audio.displayName = "Audio";

const Transcript = (props: {
  transcript: Transcript;
  currentTime: number;
  onWordClick: (word: TranscriptWord) => void;
  showConfidence: boolean;
  showSentimentalAnalysis: boolean;
  showContentSafety: boolean;
}) => {
  return (
    <div className="max-w-screen-md mx-auto pt-8 pb-32 bg-white px-8 shadow">
      <Link href="/" className="underline block">
        Home
      </Link>
      <Divider />
      <H1>{props.transcript.summary}</H1>
      <Divider />
      <H2>Content Safety</H2>
      {props.transcript.content_safety_labels &&
      Object.keys(props.transcript.content_safety_labels.summary).length > 0 ? (
        Object.keys(props.transcript.content_safety_labels.summary).map(
          (key) => {
            const content = contentModeration(key);

            return (
              <p key={key} className="py-2">
                <span className="font-bold">{content?.label}:</span>{" "}
                {content?.description}
              </p>
            );
          }
        )
      ) : (
        <p>No content safety labels found</p>
      )}
      <Divider />
      <H2>Transcript</H2>

      {props.transcript.utterances?.map((utterance, index) => (
        <div key={index} className="py-2">
          <div className="font-bold">Speaker {utterance.speaker}</div>
          <p>
            {utterance.words.map((word, index) => (
              <Fragment key={index}>
                <Word
                  word={word}
                  currentTime={props.currentTime}
                  onWordClick={props.onWordClick}
                  showConfidence={props.showConfidence}
                  showSentimentalAnalysis={props.showSentimentalAnalysis}
                  sentimentalAnalysisResult={
                    props.transcript.sentiment_analysis_results ?? []
                  }
                  showContentSafety={props.showContentSafety}
                  contentSafetyLabels={
                    props.transcript.content_safety_labels ?? null
                  }
                />
                {index == utterance.words.length - 1 ? "" : " "}
              </Fragment>
            ))}
          </p>
        </div>
      ))}

      <Divider />

      <p>
        <b>{props.transcript.words?.length ?? 0}</b> words with a confidence of{" "}
        <b>{((props.transcript.confidence ?? 0) * 100).toFixed(2)}%</b>
      </p>
    </div>
  );
};

const Word = ({
  word,
  currentTime,
  onWordClick,
  showConfidence,
  showSentimentalAnalysis,
  sentimentalAnalysisResult,
  showContentSafety,
  contentSafetyLabels,
}: {
  word: TranscriptWord;
  currentTime: number;
  onWordClick: (word: TranscriptWord) => void;
  showConfidence: boolean;
  showSentimentalAnalysis: boolean;
  sentimentalAnalysisResult: SentimentAnalysisResult[];
  showContentSafety: boolean;
  contentSafetyLabels: ContentSafetyLabelsResult | null;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  // Add a bit of margin to compute if the word should be highlighted
  // The event frequency is dependent on the system load
  // https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event
  const eventFrequencyInMs = 50;
  const isHighlighted =
    currentTime + eventFrequencyInMs >= word.start &&
    currentTime - eventFrequencyInMs <= word.end;

  const wordSentimentalAnalysis = useMemo(
    () =>
      showSentimentalAnalysis
        ? sentimentalAnalysisResult.find(
            (result) => result.start <= word.start && result.end >= word.end
          ) ?? null
        : null,
    [showSentimentalAnalysis, sentimentalAnalysisResult, word]
  );

  const contentSafetyLabelsAnalysis = useMemo(
    () =>
      showContentSafety
        ? contentSafetyLabels?.results.find(
            (result) =>
              result.timestamp.start <= word.start &&
              result.timestamp.end >= word.end
          ) ?? null
        : null,
    [contentSafetyLabels?.results, showContentSafety, word]
  );

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) {
      return "bg-green-100";
    }

    if (confidence >= 0.5) {
      return "bg-yellow-100";
    }

    return "bg-red-100";
  };

  useEffect(() => {
    if (isHighlighted && !isElementVisible(ref.current!)) {
      ref.current!.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  return (
    <span
      ref={ref}
      className={[
        isHighlighted ? "!bg-blue-100" : "",
        showConfidence ? getConfidenceColor(word.confidence) : "",
        wordSentimentalAnalysis?.sentiment === "NEGATIVE" ? "bg-red-100" : "",
        wordSentimentalAnalysis?.sentiment === "POSITIVE" ? "bg-green-100" : "",
        wordSentimentalAnalysis?.sentiment === "NEUTRAL" ? "bg-gray-100" : "",
        contentSafetyLabelsAnalysis != null ? "bg-red-100" : "",
      ].join(" ")}
      onClick={() => onWordClick(word)}
    >
      {word.text}
    </span>
  );
};
