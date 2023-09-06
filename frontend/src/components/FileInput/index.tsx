import React, { InputHTMLAttributes } from 'react';



const FileInput = React.forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(
  (
    { ...otherData }: InputHTMLAttributes<HTMLInputElement>,
    ref: React.ForwardedRef<HTMLInputElement>
  ) => {
    return (
      <input
        ref={ref}
        type="file"
        accept="image/png, image/jpeg"
        {...otherData}
        className="hidden"
        
      />
    );
  }
);


export default FileInput;
