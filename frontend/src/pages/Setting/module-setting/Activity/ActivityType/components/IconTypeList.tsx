import Icon, { IconTypes } from 'components/Icon';
import { Children } from 'react';

interface IconTypeListProps {
  setIconType: React.Dispatch<React.SetStateAction<string>>;
  iconType: string;
  setIconImage: (fileObj: File | string) => void;
  disabled: boolean | undefined;
}

const IconTypeList = (props: IconTypeListProps) => {
  const { setIconType, iconType, setIconImage, disabled = false } = props;

  const IconTypeArray: IconTypes[] = [
    'phoneFilled',
    'mailFilled',
    'commentFilled',
    'imageIconFilledBlack',
    'calendarFilled',
    'activitiesFilledBlackIcon',
    'lunchFilledIcon',
    'deadlineFilledIcon',
    'followupFilledIcon',
    'campaingFilledIcon',
    'reminderFilledIcon',
    'chatFilledIcon',
    'inpersonmeetingFilledIcon',
    'coldcallingFilledIcon',
    'negotiationFilledIcon',
    'promotionaleventsFilledIcon',
    'upsellingFilledIcon',
    'managepaymentFilledIcon',
    'manageincidentFilledIcon',
    'costomerresearchFilledIcon',
    'margincalculateFilledIcon',
    'publicspeechFilledIcon',
    'contractdraftingFilledIcon',
    'producttrainingFilledIcon',
    'datacaptureFilledIcon',
    'feedbacksurveyFilledIcon',
    'croossellingFilledIon',
    'productdemonstrationFilledIcon',
    'proofofconceptFilledIcon',
    'solutiondesignFilledIcon',
    'needanalyticsFilledIcon',
    'competitiveanalysisFilledIcon',
    'assignmemberFilledIcon',
    'teaFilledIcon',
    'creatteamFilledIcon',
  ];

  return (
    <div className="icon__libraryBox__wrapper">
      <h3 className="title text-[18px] font-biotif__SemiBold mb-[10px]">
        Pick an icon for your activity
      </h3>
      <div className="inner__wrapper flex flex-wrap justify-between mx-[-10px] after:content-[''] after:flex-auto">
        {Children.toArray(
          IconTypeArray.map((val, index) => (
            <div className="px-[10px] mb-[15px] w-[7.69%] md:w-[8.33%] sm:w-[10%] xsm:!w-[20%]">
              <div
                key={index}
                onClick={() => {
                  setIconType(iconType === val ? '' : val);
                  setIconImage('');
                }}
                className={`icon__libraryBox inline-block ${
                  iconType === val ? 'active' : ''
                } ${
                  disabled ? 'pointer-events-none' : ''
                } relative cursor-pointer before:content-[''] before:absolute before:left-[50%] before:top-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[calc(100%_+_6px)] before:h-[calc(100%_+_6px)] before:border before:border-ipBlack__borderColor before:rounded-[8px] before:opacity-0 before:duration-500 hover:before:opacity-100`}
              >
                <Icon className="highlighted p-[8px]" iconType={val} />
                <span className='close__btn hidden absolute top-[-8px] right-[-8px] w-[16px] h-[16px] rounded-full bg-white border-[1px] border-black before:content-[""] before:absolute before:top-[50%] before:left-[50%] before:translate-x-[-50%] before:translate-y-[-50%] before:w-[9px] before:h-[1px] before:bg-black before:rotate-45 after:content-[""] after:absolute after:top-[50%] after:left-[50%] after:translate-x-[-50%] after:translate-y-[-50%] after:w-[9px] after:h-[1px] after:bg-black after:-rotate-45' />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default IconTypeList;
