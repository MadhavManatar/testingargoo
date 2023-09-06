// ** import packages **
import { ReactNode, useEffect, useRef } from 'react';

type InfiniteScrollProps = {
  next: () => void;
  hasMore: boolean;
  children: ReactNode;
  isLoading?: boolean;
  Loader?: ReactNode;
  scrollableTarget: string;
};

function InfiniteScroll(props: InfiniteScrollProps) {
  const {
    hasMore,
    next,
    children,
    Loader,
    isLoading = false,
    scrollableTarget,
  } = props;
  const hashMoreRef = useRef<boolean>();
  const isLoadingRef = useRef<boolean>();

  hashMoreRef.current = hasMore;
  isLoadingRef.current = isLoading;
  useEffect(() => {
    document
      .getElementById(`${scrollableTarget}`)
      ?.addEventListener('scroll', (e) => {
        const { scrollTop, scrollHeight, clientHeight } =
          e.target as HTMLElement;

        if (
          scrollTop + clientHeight === scrollHeight &&
          hashMoreRef.current &&
          !isLoadingRef.current
        ) {
          next();
        }
      });
  }, [hasMore]);

  return (
    <>
      {isLoading ? Loader : children}
    </>
  );
}

export default InfiniteScroll;
