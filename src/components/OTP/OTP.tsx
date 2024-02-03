import { ChangeEvent, useEffect, useRef, useState } from "react";
let currentOTPIndex = 0;
const OTP = ({
  size,
  setOtpValue,
  disabled,
}: {
  size: number;
  setOtpValue: (value: string) => void;
  disabled: boolean;
}) => {
  const [otp, setOtp] = useState(Array(size).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const inputRef = useRef<null | HTMLInputElement>(null);

  const handleOTPChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newOTP = [...otp];
    const value = e?.target?.value;
    newOTP[currentOTPIndex] = value.substring(value.length - 1);

    if (!value) setActiveOTPIndex(currentOTPIndex - 1);
    else setActiveOTPIndex(currentOTPIndex + 1);
    setOtp(newOTP);
    setOtpValue(newOTP.join(""));
  };
  const handleOnKeyDown = (key: string, index: number) => {
    currentOTPIndex = index;
    if (key === "Backspace") setActiveOTPIndex(currentOTPIndex - 1);
  };

  useEffect(() => {
    if (!disabled) {
      inputRef?.current?.focus();
    }
  }, [activeOTPIndex, disabled]);
  return otp.map((_, index) => {
    return (
      <input
        disabled={disabled}
        key={index}
        ref={index === activeOTPIndex ? inputRef : null}
        type="text"
        className="w-12 h-12 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl border-gray-400 focus:border-gray-700 focus:text-gray-700 text-gray-400 transition spin-button-none disabled:cursor-not-allowed"
        onChange={handleOTPChange}
        value={otp[index]}
        onKeyDown={(e) => handleOnKeyDown(e.key, index)}
      />
    );
  });
};

export { OTP };
