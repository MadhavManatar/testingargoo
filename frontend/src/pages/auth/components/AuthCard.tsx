// **  Type **
import { AuthCardProps } from '../types/authCard.types';

// ** Icons **
import SignUpBackArrow from 'assets/images/signupBackArrow.svg';

const AuthCard = (props: AuthCardProps) => {
  const { title, subTitle, showHeader = true, children } = props;
  const { showBackBtn = false, onBackBtnClicked } = props;
  return (
    <>
      {showBackBtn && (
        <div className="w-[489px] max-w-full mx-auto mt-[22px]">
          <a
            href="#"
            onClick={onBackBtnClicked}
            className="text-disableLight__TextColor text-[18px] font-biotif__Regular inline-flex items-center"
          >
            <img className="mr-[7px]" src={SignUpBackArrow} alt="" />
            Back
          </a>
        </div>
      )}
      <div className="card signup__Card w-[489px] max-w-full mx-auto mt-[20px]">
        {showHeader && (
          <div className="signup__Card__Header">
            {title && <h2 className="i__Heading">{title}</h2>}
            {subTitle && (
              <p className="i__Text">
                <span>{subTitle}</span>
              </p>
            )}
          </div>
        )}
        <div className="signup__Card__Body">{children}</div>
      </div>
    </>
  );
};

export default AuthCard;
