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

      let parent;

      elements.forEach((element) => {
        parent = element.parentElement;

        span.appendChild(element);
        span.appendChild(document.createTextNode(" "));
      });

      parent!.appendChild(span);
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

function findNearestIndex(arr: Array<number>, target: number) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const diffLeft = Math.abs(arr[mid] - target);
    const diffRight = Math.abs(arr[mid + 1] - target);

    if (diffLeft <= diffRight) {
      right = mid - 1;
    } else {
      left = mid + 1;
    }
  }

  return left;
}

function contentModeration(value: string) {
  return {
    accidents: {
      label: "Accidents",
      description:
        "Any man-made incident that happens unexpectedly and results in damage, injury, or death.",
    },
    alcohol: {
      label: "Alcohol",
      description:
        "Content that discusses any alcoholic beverage or its consumption.",
    },
    financials: {
      label: "Company Financials",
      description:
        "Content that discusses any sensitive company financial information.",
    },
    crime_violence: {
      label: "Crime Violence",
      description:
        "Content that discusses any type of criminal activity or extreme violence that is criminal in nature.",
    },
    drugs: {
      label: "Drugs",
      description: "Content that discusses illegal drugs or their usage.",
    },
    gambling: {
      label: "Gambling",
      description:
        "Includes gambling on casino-based games such as poker, slots, etc. as well as sports betting.",
    },
    hate_speech: {
      label: "Hate Speech",
      description:
        "Content that's a direct attack against people or groups based on their sexual orientation, gender identity, race, religion, ethnicity, national origin, disability, etc.",
    },
    health_issues: {
      label: "Health Issues",
      description:
        "Content that discusses any medical or health-related problems.",
    },
    manga: {
      label: "Manga",
      description:
        "Mangas are comics or graphic novels originating from Japan with some of the more popular series being 'Pokemon', 'Naruto', 'Dragon Ball Z', 'One'",
    },
    marijuana: {
      label: "Marijuana",
      description:
        "This category includes content that discusses marijuana or its usage.",
    },
    disasters: {
      label: "Natural Disasters",
      description:
        "Phenomena that happens infrequently and results in damage, injury, or death. Such as hurricanes, tornadoes, earthquakes, volcano eruptions, and firestorms.",
    },
    negative_news: {
      label: "Negative News",
      description:
        "News content with a negative sentiment which typically occur in the third person as an unbiased recapping of events.",
    },
    nsfw: {
      label: "NSFW (Adult Content)",
      description:
        "Content considered 'Not Safe for Work' and consists of content that a viewer would not want to be heard/seen in a public environment",
    },
    pornography: {
      label: "Pornography",
      description: "Content that discusses any sexual content or material.",
    },
    profanity: {
      label: "Profanity",
      description: "Any profanity or cursing.",
    },
    sensitive_social_issues: {
      label: "Sensitive Social Issues",
      description:
        "This category includes content that may be considered insensitive, irresponsible, or harmful to certain groups based on their beliefs, political affiliation, sexual",
    },
    terrorism: {
      label: "Terrorism",
      description:
        "Includes terrorist acts as well as terrorist groups. Examples include bombings, mass shootings, and ISIS. Note that many texts corresponding to this topic may also be classified into the crime violence topic.",
    },
    tobacco: {
      label: "Tobacco",
      description:
        "Text that discusses tobacco and tobacco usage, including e-cigarettes, nicotine, vaping, and general discussions about smoking.",
    },
    weapons: {
      label: "Weapons",
      description:
        "Text that discusses any type of weapon including guns, ammunition, shooting, knives, missiles, torpedoes, etc.",
    },
  }[value];

  // Accidents	Any man-made incident that happens unexpectedly and results in damage, injury, or death.	accidents	Yes
  // Alcohol	Content that discusses any alcoholic beverage or its consumption.	alcohol	Yes
  // Company Financials	Content that discusses any sensitive company financial information.	financials	No
  // Crime Violence	Content that discusses any type of criminal activity or extreme violence that is criminal in nature.	crime_violence	Yes
  // Drugs	Content that discusses illegal drugs or their usage.	drugs	Yes
  // Gambling	Includes gambling on casino-based games such as poker, slots, etc. as well as sports betting.	gambling	Yes
  // Hate Speech	Content that's a direct attack against people or groups based on their sexual orientation, gender identity, race, religion, ethnicity, national origin, disability, etc.	hate_speech	Yes
  // Health Issues	Content that discusses any medical or health-related problems.	health_issues	Yes
  // Manga	Mangas are comics or graphic novels originating from Japan with some of the more popular series being "Pokemon", "Naruto", "Dragon Ball Z", "One Punch Man", and "Sailor Moon".	manga	No
  // Marijuana	This category includes content that discusses marijuana or its usage.	marijuana	Yes
  // Natural Disasters	Phenomena that happens infrequently and results in damage, injury, or death. Such as hurricanes, tornadoes, earthquakes, volcano eruptions, and firestorms.	disasters	Yes
  // Negative News	News content with a negative sentiment which typically occur in the third person as an unbiased recapping of events.	negative_news	No
  // NSFW (Adult Content)	Content considered "Not Safe for Work" and consists of content that a viewer would not want to be heard/seen in a public environment.	nsfw	No
  // Pornography	Content that discusses any sexual content or material.	pornography	Yes
  // Profanity	Any profanity or cursing.	profanity	Yes
  // Sensitive Social Issues	This category includes content that may be considered insensitive, irresponsible, or harmful to certain groups based on their beliefs, political affiliation, sexual orientation, or gender identity.	sensitive_social_issues	No
  // Terrorism	Includes terrorist acts as well as terrorist groups. Examples include bombings, mass shootings, and ISIS. Note that many texts corresponding to this topic may also be classified into the crime violence topic.	terrorism	Yes
  // Tobacco	Text that discusses tobacco and tobacco usage, including e-cigarettes, nicotine, vaping, and general discussions about smoking.	tobacco	Yes
  // Weapons	Text that discusses any type of weapon including guns, ammunition, shooting, knives, missiles, torpedoes, etc.	weapons	Yes
}
