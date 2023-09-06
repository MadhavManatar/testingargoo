// ** Import Packages **
import { useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';

// ** Components **
import Icon from 'components/Icon';
import useVoipCall from 'pages/Dashboard/hooks/useVoipCall';

// ** Types **
import { ToggleStateType } from 'pages/Dashboard/types/toggleTypes/index.types';

interface Props {
  initialToggleValue: ToggleStateType;
  setHeaderToggle: React.Dispatch<React.SetStateAction<ToggleStateType>>;
  voipObj: ReturnType<typeof useVoipCall>;
}

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '*', '#'];

const DialPad = ({ voipObj, setHeaderToggle, initialToggleValue }: Props) => {
  const { makeCall, sendDTMF, endCall } = voipObj;

  const dtmfInputRef = useRef<HTMLInputElement>(null);
  const [number, setNumber] = useState('');
  const [DTMF, setDTMF] = useState('');

  const callStarted = !!voipObj.callStatus.accepted;

  useEffect(() => {
    dtmfInputRef.current?.focus();
  }, []);

  return (
    <div className="inner__wrapper w-[295px] bg-white shadow-[0px_3px_17px_#0000001a] rounded-[10px] overflow-hidden">
      <h3 className="text-[18px] font-biotif__Medium text-black pt-[14px] pb-[10px] px-[16px]">
        {callStarted && (
          <button
            onClick={() => {
              setHeaderToggle({
                ...initialToggleValue,
                dialer: { callScreen: true, dialPed: false },
              });
            }}
            className='backBtn inline-block text-[0px] relative top-[-6px] mr-[6px] cursor-pointer w-[20px] h-[15px] bg-red after:content-[""] after:absolute after:top-[4px] after:left-0 after:w-[8px] after:h-[8px] after:border-l-[2px] after:border-l-ipBlack__borderColor after:border-b-[2px] after:border-b-ipBlack__borderColor after:rotate-45 before:content-[""] before:absolute before:top-[7px] before:left-[0px] before:w-[12px] before:bg-ipBlack__bgColor before:h-[2px]'
          >
            .
          </button>
        )}
        Voip call
      </h3>

      <div className="inputBox px-[16px] pb-[14px] flex items-center justify-between">
        {callStarted ? (
          <input
            ref={dtmfInputRef}
            className="w-[calc(100%_-_36px)] h-[33px] rounded-[5px] border border-[#CCCCCC]/50 text-[#2E3234] text-[14px] font-biotif__Regular placeholder:text-[#2E3234]/50 duration-500 px-[9px] py-[2px] focus:border focus:border-[#000000] focus:outline-none focus:shadow-none"
            type="text"
            value={DTMF}
            onChange={(e) => {
              if (digits.includes(e.target.value.toString())) {
                sendDTMF(e.target.value);
              }
              setDTMF(e.target.value);
            }}
          />
        ) : (
          <PhoneInput
            country="us"
            value={number}
            onChange={(val) => setNumber(val)}
            copyNumbersOnly={false}
          />
        )}

        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => {
                return prev === '' ? '' : prev.substring(0, prev.length - 1);
              });
            } else {
              setDTMF((prev) => {
                return prev === '' ? '' : prev.substring(0, prev.length - 1);
              });
            }
          }}
          className='clearBtn w-[20px] h-[20px] bg-[#FF0000] rounded-[3px] relative duration-500 group hover:bg-[#cc0909] before:content-[""] before:absolute before:top-[3px] before:left-[9px] before:w-[2px] before:h-[14px] before:rotate-45 before:bg-white after:content-[""] after:absolute after:top-[3px] after:left-[9px] after:w-[2px] after:h-[14px] after:rotate-[-45deg] after:bg-white'
        >
          <span className="crossBtn absolute w-[0px] h-[0px] border-[10px] border-transparent border-r-[10px] border-r-[#FF0000] left-[-18px] top-0 duration-500 group-hover:border-r-[#cc0909]" />
        </button>
      </div>
      <div className="dialer__number__wrapper flex flex-wrap">
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 1);
            } else {
              sendDTMF(1);
              setDTMF((prev) => prev + 1);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-l-0 border-b-0"
        >
          1
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 2);
            } else {
              sendDTMF(2);
              setDTMF((prev) => prev + 2);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-l-0 border-b-0 border-r-0"
        >
          2
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 3);
            } else {
              sendDTMF(3);
              setDTMF((prev) => prev + 3);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-r-0 border-b-0"
        >
          3
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 4);
            } else {
              sendDTMF(4);
              setDTMF((prev) => prev + 4);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-l-0 border-b-0"
        >
          4
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 5);
            } else {
              sendDTMF(5);
              setDTMF((prev) => prev + 5);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-l-0 border-b-0 border-r-0"
        >
          5
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 6);
            } else {
              sendDTMF(6);
              setDTMF((prev) => prev + 6);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-r-0 border-b-0"
        >
          6
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 7);
            } else {
              sendDTMF(7);
              setDTMF((prev) => prev + 7);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-b-0 border-l-0"
        >
          7
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 8);
            } else {
              sendDTMF(8);
              setDTMF((prev) => prev + 8);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-b-0 border-l-0 border-r-0"
        >
          8
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => prev + 9);
            } else {
              sendDTMF(9);
              setDTMF((prev) => prev + 9);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-b-0 border-r-0"
        >
          9
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => `${prev}*`);
            } else {
              sendDTMF('*');
              setDTMF((prev) => `${prev}*`);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center pt-[31px] h-[66px] text-[#999999] text-[60px] leading-[60px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-b-0 border-l-0"
        >
          *
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => `${prev}0`);
            } else {
              sendDTMF('0');
              setDTMF((prev) => `${prev}0`);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-primaryColor text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-b-0 border-l-0 border-r-0"
        >
          0
        </button>
        <button
          onClick={() => {
            if (!callStarted) {
              setNumber((prev) => `${prev}#`);
            } else {
              sendDTMF('#');
              setDTMF((prev) => `${prev}#`);
            }
          }}
          className="dialer__number__item duration-500 hover:bg-[#f4f4f4] flex items-center justify-center h-[66px] text-[#999999] text-[30px] font-biotif__Regular w-1/3 border border-[#CCCCCC]/50 border-b-0 border-r-0"
        >
          #
        </button>
      </div>
      {!callStarted ? (
        <button
          onClick={() => makeCall(`+${number}`)}
          // onClick={() => makeCall(`804-222-1111`)}
          className="callBtn w-full h-[60px] flex items-center justify-center duration-500 bg-[#24BD64] hover:bg-[#118E45]"
        >
          <Icon className="w-[38px] h-[38px]" iconType="phoneFilled" />
        </button>
      ) : (
        <button
          className="callBtn w-full h-[60px] flex items-center justify-center duration-500 bg-[#FF0000] hover:bg-[#cc0909]"
          onClick={() => {
            endCall();
            setHeaderToggle({
              ...initialToggleValue,
              dialer: { callScreen: false, dialPed: false },
            });
          }}
        >
          <Icon
            className="w-[40px] h-[40px] rotate-[133deg]"
            iconType="phoneFilled"
          />
        </button>
      )}
    </div>
  );
};

export default DialPad;
