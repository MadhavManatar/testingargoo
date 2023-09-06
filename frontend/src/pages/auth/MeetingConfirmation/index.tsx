import React from 'react';
import Smackdab from 'assets/images/Smackdab.png';
import SignUpBG from 'assets/images/signupBg.png';
import { useParams } from 'react-router-dom';

const MeetingConfirmation = () => {

  const { action } = useParams();
  return (
    <>
      <div className="h-[100dvh] w-[100dvw] flex items-center justify-center relative p-4">
        <img
          src={SignUpBG}
          className="w-full h-full object-cover absolute top-0 left-0 pointer-events-none"
          alt=""
        />
        <div className="max-w-[453px] w-full mx-auto">
          <div className="text-center bg-white shadow-[0px_4px_58px_rgba(0,_0,_0,_0.04)] p-[30px] rounded-[10px]">
            <div className="w-[85px] h-[85px] mx-auto">
              {action === "YES" && (
                <svg
                className="w-full h-full"
                width="85"
                height="84"
                viewBox="0 0 85 84"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle opacity="0.2" cx="42.5" cy="42" r="42" fill="#24BD64" />
                <circle cx="42.5" cy="42" r="27" fill="#24BD64" />
                <path
                  d="M33.8604 43.6823L37.4424 47.1395C38.2173 47.8874 39.4453 47.8874 40.2202 47.1395L51.1404 36.6"
                  stroke="white"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
              )}
              {action === "NO" &&(
                <svg width="85" height="84" viewBox="0 0 85 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.2" d="M42.5 84C65.696 84 84.5 65.196 84.5 42C84.5 18.804 65.696 0 42.5 0C19.304 0 0.5 18.804 0.5 42C0.5 65.196 19.304 84 42.5 84Z" fill="#FF0000"/>
                <path d="M42.5 69C57.4117 69 69.5 56.9117 69.5 42C69.5 27.0883 57.4117 15 42.5 15C27.5883 15 15.5 27.0883 15.5 42C15.5 56.9117 27.5883 69 42.5 69Z" fill="#FF0000"/>
                <path d="M44.2291 42L50.7197 35.4879C51.0647 35.1429 51.0647 34.6038 50.7197 34.2588C50.3747 33.9137 49.8356 33.9137 49.4906 34.2588L43 40.7709L36.4879 34.2803C36.1429 33.9353 35.6038 33.9353 35.2588 34.2803C34.9137 34.6253 34.9137 35.1644 35.2588 35.5094L41.7709 42L35.2803 48.5121C34.9353 48.8571 34.9353 49.3962 35.2803 49.7412C35.6253 50.0863 36.1644 50.0863 36.5094 49.7412L43 43.2291L49.5121 49.7412C49.8571 50.0863 50.3962 50.0863 50.7412 49.7412C51.0863 49.3962 51.0863 48.8571 50.7412 48.5121L44.2291 42Z" fill="white"/>
                <defs>
                <clipPath id="clip0_17498_159351">
                <rect width="85" height="84" fill="white"/>
                </clipPath>
                </defs>
                </svg>
              )}

              {action === "MAYBE" && (
                <svg width="85" height="84" viewBox="0 0 85 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.2" d="M42.5 84C65.696 84 84.5 65.196 84.5 42C84.5 18.804 65.696 0 42.5 0C19.304 0 0.5 18.804 0.5 42C0.5 65.196 19.304 84 42.5 84Z" fill="#737373"/>
                <path d="M42.5 69C57.4117 69 69.5 56.9117 69.5 42C69.5 27.0883 57.4117 15 42.5 15C27.5883 15 15.5 27.0883 15.5 42C15.5 56.9117 27.5883 69 42.5 69Z" fill="#737373"/>
                <path d="M42.6625 32C41.8755 32 41.2375 32.638 41.2375 33.425L41.475 45.5375C41.475 46.1933 42.0067 46.725 42.6625 46.725C43.3184 46.725 43.85 46.1933 43.85 45.5375L44.0875 33.425C44.0875 32.638 43.4495 32 42.6625 32ZM42.6625 47.675C41.7443 47.675 41 48.4193 41 49.3375C41 50.2557 41.7443 51 42.6625 51C43.5807 51 44.325 50.2557 44.325 49.3375C44.325 48.4193 43.5807 47.675 42.6625 47.675Z" fill="white"/>
                <defs>
                <clipPath id="clip0_17498_159355">
                <rect width="85" height="84" fill="white"/>
                </clipPath>
                </defs>
                </svg>
              )}
            </div>
            {action === "YES" && (
              <p className="mt-6 text-black text-lg leading-6 opacity-50">
              Awesome!<br /> Your meeting status has been confirm.
            </p>
            )}
            {action === "NO" && (
              <p className="mt-6 text-black text-lg leading-6 opacity-50">
              Oh no!<br />Your meeting status has been decline. 
            </p>
            )}
            {action === "MAYBE" && (
              <p className="mt-6 text-black text-lg leading-6 opacity-50">
              Awaiting! <br /> Your meeting status has been Tentative.
            </p>
            )}
            

            <div className="max-w-[150px] mt-10 mx-auto">
              <img className="singupBG" src={Smackdab} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MeetingConfirmation;
