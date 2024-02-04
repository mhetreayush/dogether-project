"use client";
import { authentication } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Box } from "@mui/system";
import { TextField, Typography } from "@mui/material";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDone } from "react-icons/md";
import { HiArrowRight } from "react-icons/hi";
import { OTP } from "@/components/OTP";
import { RecruiterModal } from "@/components/RecruiterModal";
import { BsInfoCircleFill } from "react-icons/bs";
import { useUser } from "@/store/useUser";
const otpStatus = {
  pending: <HiArrowRight />,
  inProgress: <AiOutlineLoading3Quarters className="animate-spin" />,
  success: <MdDone />,
};
const Index = () => {
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSentStatus, setOtpSentStatus] = useState<
    "pending" | "inProgress" | "success"
  >("pending");
  const [otpValue, setOtpValue] = useState("");
  const [openRecruiterModal, setOpenRecruiterModal] = useState(false);
  const phoneRef = useRef<null | HTMLInputElement>(null);
  const { setUser } = useUser();
  const onSignInSubmit = useCallback(() => {
    const appVerifier = window.recaptchaVerifier;
    const finalPhoneNumber = "+91" + phoneNumber;
    setOtpSentStatus("inProgress");
    signInWithPhoneNumber(authentication, finalPhoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP Sent");
        setOtpSentStatus("success");
        setShowOtp(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [phoneNumber]);
  useEffect(() => {
    const generateRecaptcha = () => {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          authentication,
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              onSignInSubmit();
            },
          }
        );
        window?.recaptchaVerifier?.render();
      }
    };
    phoneRef.current?.focus();
    return generateRecaptcha();
  }, [onSignInSubmit]);

  const signInWithOtp = (e: FormEvent) => {
    e.preventDefault();
    window?.confirmationResult
      .confirm(otpValue)
      .then((result: any) => {
        const user = result.user;
        setUser(user);

        toast.success("User Signed In");
        router.push("/home");
      })
      .catch((error: Error) => {
        toast.error(error.message);
        console.log(error);
      });
  };

  useEffect(() => {
    document.title = "Login";
  }, []);
  return (
    <div className="bg-[url('/assets/loginBgMobile.svg')] md:bg-[url('/assets/loginBg.svg')] bg-cover bg-center min-h-screen min-w-screen">
      <div className="min-h-screen md:w-1/2 h-full flex items-center justify-center  rounded-md">
        <div className="bg-white h-fit w-[95%] md:w-3/4 p-8 flex flex-col gap-y-8 rounded-md drop-shadow-lg">
          <Typography variant="h4" className="text-center mb-4">
            Login
          </Typography>
          <Box className="flex flex-col gap-y-4">
            <button
              className="w-fit px-4 py-2 actionButton flex gap-x-2 items-center mb-4"
              onClick={() => setOpenRecruiterModal(true)}
            >
              <span>
                <BsInfoCircleFill size={25} />
              </span>{" "}
              For recruiters
            </button>
            <Box>
              <form
                action="()=>{}"
                onSubmit={signInWithOtp}
                className="w-full relative flex items-center "
              >
                <TextField
                  required
                  label="Phone Number"
                  inputRef={phoneRef}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  fullWidth
                />
                <button
                  onClick={onSignInSubmit}
                  type="submit"
                  className="absolute right-5 disabled:bg-gray-400 disabled:text-gray-200 text-2xl disabled:cursor-not-allowed p-1 border border-gray-300 rounded-full transition-all duration-300 bg-black text-white"
                  disabled={
                    !phoneNumber.match(/^[0-9]{10}$/) ||
                    otpSentStatus === "inProgress" ||
                    otpSentStatus === "success"
                  }
                >
                  {otpStatus[otpSentStatus]}
                </button>
              </form>
            </Box>

            <Box className="flex w-full justify-between">
              <OTP size={6} setOtpValue={setOtpValue} disabled={!showOtp} />
            </Box>
          </Box>

          <button
            disabled={!otpValue.match(/^[0-9]{6}$/)}
            onClick={signInWithOtp}
            className="w-full actionButton disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        </div>
        <RecruiterModal
          setOpenModal={setOpenRecruiterModal}
          openModal={openRecruiterModal}
        />
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Index;
