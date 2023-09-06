export const getUpdatedUtterances = (initialUtterances: any) => {
  const utterances = (initialUtterances || []).map((element: any) => {
    const speakerCount = new Set(element.words.map((w: any) => w.speaker));

    if (!element.words.length || speakerCount.size === 1) {
      return { ...element, subTranscriptions: [element] };
    }

    /* If transcript contain more speakers */
    const subTranscriptionArr: Array<any> = [];
    let currentSpeaker: any = null;
    let currentWords: any = [];

    const addSubTranscription = () => {
      const { start } = currentWords[0];
      const { end } = currentWords[currentWords.length - 1];
      const transcript = currentWords
        .map((w: any) => w.punctuated_word)
        .join(' ');
      const confidence = currentWords
        .map((w: any) => w.confidence)
        .reduce((p: any, c: any) => p + c, 0);

      const newTranscriptObj = {
        start,
        end,
        transcript,
        confidence: confidence / currentWords.length,
        channel: element.channel,
        speaker: currentSpeaker,
        words: currentWords,
      };
      subTranscriptionArr.push(newTranscriptObj);
    };

    element.words.forEach((word: any) => {
      if (currentSpeaker === null && !currentWords.length) {
        currentSpeaker = word.speaker;
        currentWords = [word];
      }

      if (currentSpeaker === word.speaker) {
        currentWords.push(word);
      } else {
        addSubTranscription();
        currentSpeaker = word.speaker;
        currentWords = [word];
      }
    });
    addSubTranscription();
    return { ...element, subTranscriptions: subTranscriptionArr };
  });

  return utterances.flatMap((transcript: any) => transcript.subTranscriptions);
};

export const isBetween = (number: number, start: number, end: number) => {
  return number >= start && number <= end;
};

export const formattedVideoTime = (time = 0, showHrs = false) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  if (showHrs || hours > 0) {
    return formattedTime;
  }

  return formattedTime.substring(3);
};
