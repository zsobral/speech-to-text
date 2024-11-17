
export function findNearestIndex(arr: Array<number>, target: number) {
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

export function contentModeration(value: string) {
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
}
