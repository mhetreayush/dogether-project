"use client";
import { Navbar } from "@/components/Navbar";
import { PageWrapper } from "@/components/PageWrapper";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  arrayUnion,
  getDoc,
  doc,
} from "firebase/firestore";
import { BiArrowBack } from "react-icons/bi";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { GroupChats } from "@/components/GroupChat";
import { Project } from "@/types/project";

type ProjectId = Project["projectId"];

const ProjectsPage = () => {
  const router = useRouter();
  const [openChatOnPhone, setOpenChatOnPhone] = useState(false);
  const searchParams = useSearchParams();
  const projId = searchParams.get("id");
  const isEnrolled = searchParams.get("isEnrolled");
  const [showConfirm, setShowConfirm] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const getProject = async (projId: ProjectId) => {
    const projectRef = collection(db, "projects");
    const q = query(projectRef, where("projectId", "==", projId));
    const querySnapshot = await getDocs(q);
    setProject(querySnapshot?.docs[0]?.data() as Project);
  };

  useEffect(() => {
    projId && getProject(projId as ProjectId);
  }, [projId]);

  const Divider = () => {
    return <hr className="border-b border-gray-300 my-2" />;
  };
  const SemiSection = ({
    title,
    children,
    className,
  }: {
    title: string;
    children?: JSX.Element | string;
    className?: string;
  }) => {
    return (
      <div className={`flex flex-col gap-y-2 ${className}`}>
        <h1 className="text-lg font-semibold">{title}</h1>
        {children && <p className="text-sm font-extralight">{children}</p>}
      </div>
    );
  };

  const handleStartProject = async () => {
    const uid = JSON.parse(localStorage?.getItem("user") ?? "{}").uid;

    const user = await getDoc(doc(db, "userProfiles", uid));

    try {
      await setDoc(
        doc(db, "projects", projId ?? " "),
        {
          members: arrayUnion({
            name: user?.data()?.name ?? "",
            uid,
          }),
        },
        { merge: true }
      );
      router.push("/profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Navbar />
      <PageWrapper title="Project details">
        <div className="flex justify-between items-center">
          <Link href="/home">
            <div className="flex item-center gap-x-3">
              <BiArrowBack className="self-center" />
              <h1 className="self-center">Back</h1>
            </div>
          </Link>
          {isEnrolled && (
            <button
              onClick={() => setOpenChatOnPhone(!openChatOnPhone)}
              className="md:hidden actionButton rounded-md"
            >
              {openChatOnPhone ? "View Details" : "Open Chat"}
            </button>
          )}
        </div>
        {!openChatOnPhone && (
          <div className="flex gap-x-3 relative">
            <div
              className={`w-full flex flex-col gap-y-4  mt-4 ${
                isEnrolled ? "md:w-1/2" : "md:w-full"
              }`}
            >
              <div className="flex justify-between">
                <div className="flex gap-x-3 items-center">
                  <h1 className="text-lg font-semibold">{project?.name}</h1>
                  <div className="flex gap-x-2">
                    {project?.tags?.map((tag, idx) => {
                      return (
                        <h1 key={idx} className="tagClass">
                          {tag.trim()}
                        </h1>
                      );
                    })}
                  </div>
                </div>
                {!isEnrolled && (
                  <button
                    className="actionButton !rounded-md"
                    onClick={() => setShowConfirm(true)}
                  >
                    Start Now
                  </button>
                )}
              </div>
              <h1 className="flex items-center">
                Expected Payment:&nbsp;
                <span className="text-lg text-textHeading">
                  Rs. {project?.expectedPayment}
                </span>
              </h1>
              <Divider />
              <SemiSection
                title="Description"
                className={`${!isEnrolled ? "w-3/4" : "w-full"}`}
              >
                {project?.desc}
              </SemiSection>
              <SemiSection title="Duration">{project?.duration}</SemiSection>
              <SemiSection title="Final Shipment">
                {project?.finalShipment}
              </SemiSection>

              <SemiSection title="Project Instructions">
                {project?.instructions}
              </SemiSection>
              <SemiSection title="Materials Required">
                {project?.materials}
              </SemiSection>
              <Divider />
              <SemiSection title="Project Posted By">
                {project?.createdBy.name}
              </SemiSection>
            </div>
          </div>
        )}
        {isEnrolled && (
          <div className="rounded-md hidden md:flex static w-full md:w-[40vw] md:ml-10 mt-4 md:mt-0 md:fixed items-center justify-center z-[1000] top-[15vh] left-[52vw] bg-primaryYellow">
            <GroupChats projectId={projId as ProjectId} />
          </div>
        )}
        {isEnrolled && openChatOnPhone && (
          <div className="rounded-md flex static w-full md:w-[40vw] md:ml-10 mt-4 md:mt-0 md:fixed items-center justify-center z-[1000] top-[15vh] left-[52vw] bg-primaryYellow">
            <GroupChats projectId={projId as ProjectId} />
          </div>
        )}

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showConfirm}
          onClose={() => setShowConfirm(false)}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={showConfirm}>
            <Box className="modalStyle rounded-md bg-primaryYellow p-4 w-[95vw] md:w-[50vw] h-[25vh] md:h-fit flex flex-col justify-center">
              <h1 className="textHeadings text-center mb-8">Confirm Start</h1>
              <Box className="flex gap-x-4 justify-center items-center w-full">
                <button
                  className="actionButton rounded-md"
                  onClick={handleStartProject}
                >
                  Start
                </button>
                <button
                  className="underline underline-offset-2 text-textHeading"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </PageWrapper>
    </>
  );
};

const Projects = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectsPage />
    </Suspense>
  );
};

export default Projects;
