import { useEffect, useRef } from 'react';
import { convertAtoB } from 'utils/util';

interface PropsType {
  information: string | undefined;
  className?: string;
  setUrl?: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const DisplayRichTextContent = (props: PropsType) => {
  const { information, className = '', setUrl } = props;
  const userSignRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (information) {
      const data = convertAtoB(information);
      if (userSignRef?.current) {
        userSignRef.current.innerHTML = data;
      }
      if (setUrl) {
        const urlValidator = /https?:\/\/[^"\s]+/g;
        const firstUrl = data?.match(urlValidator);
        setUrl(firstUrl?.[0]);
      }
    }
  }, [information]);

  return <div ref={userSignRef} className={className} />;
};

export default DisplayRichTextContent;
