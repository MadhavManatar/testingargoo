const useSearchTranscript = (
  searchVal: string,
  searchIds: { uId: number; wId: number },
  utterances: Array<any>
) => {
  const handleReverseSearchTranscript = (searchText: string) => {
    const isExist = utterances
      .flatMap((u) => u.words)
      .some((w) => w.punctuated_word.toLowerCase().includes(searchText));

    if (!searchText || !isExist) {
      return { uId: -1, wId: -1 };
    }

    const uttCount = utterances.length - 1;
    const uttReverse = utterances.slice().reverse();

    if (searchVal !== searchText) {
      const revUId = uttReverse.findIndex((u) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const uId = uttCount - revUId;

      const wordReverse = utterances[uId].words.slice().reverse();
      const wordCount = wordReverse.length - 1;
      const revWId = wordReverse.findIndex((w: any) =>
        w.punctuated_word.toLowerCase().includes(searchText)
      );
      const wId = wordCount - revWId;
      return { uId, wId };
    }

    const revUId = uttReverse.findIndex((u, idx) => {
      if (uttCount - idx === searchIds.uId) {
        return u.words.some((w: any, idx1: number) => {
          return (
            idx1 < searchIds.wId &&
            w.punctuated_word.toLowerCase().includes(searchText)
          );
        });
      }
      if (uttCount - idx < searchIds.uId) {
        return u.words.some((w: any) => {
          return w.punctuated_word.toLowerCase().includes(searchText);
        });
      }

      return false;
    });

    const isLast = !(revUId > -1) && isExist;

    if (isLast) {
      const revUIdInner = uttReverse.findIndex((u) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const uIdInner = uttCount - revUIdInner;

      if (uIdInner > -1) {
        const wordReverse = utterances[uIdInner].words.slice().reverse();
        const wordCount = wordReverse.length - 1;

        const revWId = wordReverse.findIndex((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
        const wId = wordCount - revWId;

        return { uId: uIdInner, wId };
      }
    }

    const uId = uttCount - revUId;
    const wordReverse = utterances[uId].words.slice().reverse();
    const wordCount = wordReverse.length - 1;

    const revWId = wordReverse.findIndex((w: any, idx: number) => {
      if (uId === searchIds.uId) {
        return (
          wordCount - idx < searchIds.wId &&
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      }
      return w.punctuated_word.toLowerCase().includes(searchText);
    });

    const wId = wordCount - revWId;
    return { uId, wId };
  };

  const handleSearchTranscript = (searchText: string) => {
    const isExist = utterances
      .flatMap((u) => u.words)
      .find((w) => w.punctuated_word.toLowerCase().includes(searchText));

    if (!searchText || !isExist) {
      return { uId: -1, wId: -1 };
    }

    if (searchVal !== searchText) {
      const uId = utterances.findIndex((u) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const wId = utterances[uId].words.findIndex((w: any) =>
        w.punctuated_word.toLowerCase().includes(searchText)
      );
      return { uId, wId };
    }

    const uId = utterances.findIndex((u, idx) => {
      if (idx === searchIds.uId) {
        return u.words.some((w: any, idx1: number) => {
          return (
            idx1 > searchIds.wId &&
            w.punctuated_word.toLowerCase().includes(searchText)
          );
        });
      }
      if (idx > searchIds.uId) {
        return u.words.some((w: any) => {
          return w.punctuated_word.toLowerCase().includes(searchText);
        });
      }

      return false;
    });

    const isLast = !(uId > -1) && isExist;

    if (isLast) {
      const uIdInner = utterances.findIndex((u) => {
        return u.words.some((w: any) =>
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      });

      const wId = utterances[uIdInner].words.findIndex((w: any) =>
        w.punctuated_word.toLowerCase().includes(searchText)
      );

      return { uId: uIdInner, wId };
    }

    const wId = utterances[uId].words.findIndex((w: any, idx: number) => {
      if (uId === searchIds.uId) {
        return (
          idx > searchIds.wId &&
          w.punctuated_word.toLowerCase().includes(searchText)
        );
      }
      return w.punctuated_word.toLowerCase().includes(searchText);
    });

    return { uId, wId };
  };

  return { handleSearchTranscript, handleReverseSearchTranscript };
};

export default useSearchTranscript;
