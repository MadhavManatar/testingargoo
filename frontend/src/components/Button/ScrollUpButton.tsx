import { useState, useEffect } from 'react';

const ScrollUpButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScroll = () => {
    setIsVisible(window.scrollY > 200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return isVisible ? (
    <button
      className="scroll-up-button fixed right-[20px] bottom-[20px] w-[40px] h-[40px] rounded-full bg-primaryColor text-[0px] before:content-[''] before:absolute before:top-[15px] before:left-[19px] before:bg-white before:w-[2px] before:h-[12px] after:content-[''] after:absolute after:top-[15px] after:left-[16px] after:w-[8px] after:h-[8px] after:border-l-[2px] after:border-b-[2px] after:border-l-white after:border-b-white after:rotate-[135deg]"
      onClick={scrollToTop}
    >
      .
    </button>
  ) : (
    <></>
  );
};

export default ScrollUpButton;
