import { useUser } from "@/store/useUser";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const RecruiterModal = ({
  setOpenModal,
  openModal,
}: {
  setOpenModal: (value: boolean) => void;
  openModal: boolean;
}) => {
  const [redirectingIn, setRedirectingIn] = useState(10);
  const router = useRouter();
  const { setUser } = useUser();
  useEffect(() => {
    if (!openModal) {
      setRedirectingIn(10);
      return;
    }
    const interval = setInterval(() => {
      setRedirectingIn((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [openModal]);

  useEffect(() => {
    if (redirectingIn <= 0) {
      setOpenModal(false);
      setUser({
        uid: "recruiter",
        name: "recruiter",
        phoneNumber: "+91 1234567890",
      });

      router.push("/home");
    }
  }, [router, openModal, redirectingIn, setOpenModal, setUser]);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openModal}
        onClose={() => setOpenModal(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openModal}>
          <Box className="modalStyle rounded-md bg-primaryYellow p-2 md:p-4 flex flex-col md:justify-between gap-y-3 justify-center ">
            <h1 className="textHeadings text-center mb-2 md:mb-8">
              Recruiter login
            </h1>

            <Box className="flex w-full items-center justify-center">
              <Box className="md:w-3/4">
                <ol style={{ listStyleType: "disc" }} className="p-4">
                  <li>
                    The project does not allow read/write without
                    authentication.
                  </li>
                  <li>
                    But for recruiters, I have considered the following points:
                    <ul style={{ listStyle: "circle" }} className="pl-6">
                      <li>
                        They might not be ready to share email-id/ phone number
                      </li>
                      <li>They might not be ready to create an account.</li>
                      <li>They might not be ready to share their details.</li>
                      <li>
                        Hence, I have given the option to get authenticated as a
                        recruiter and use the app.
                      </li>
                    </ul>
                  </li>
                </ol>
              </Box>
            </Box>

            <Box className="flex flex-col gap-y-8 ">
              <h1 className="text-center text-gray-400">
                Automatically redirecting to home page in {redirectingIn}{" "}
                seconds
              </h1>

              <button
                type="submit"
                className="actionButton w-3/4 self-center"
                onClick={() => router.push("/home")}
              >
                Redirect now
              </button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export { RecruiterModal };
