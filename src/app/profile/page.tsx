"use client";
import { Navbar } from "@/components/Navbar";
import { PageWrapper } from "@/components/PageWrapper";
import { ProjectDiv } from "@/components/ProjectDiv";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { User } from "@/types/user";
import { Project } from "@/types/project";
const Profile = () => {
  const [enrolledProjects, setEnrolledProjects] = useState<Project[] | null>(
    null
  );
  const [createdProjects, setCreatedProjects] = useState<Project[] | null>(
    null
  );

  useEffect(() => {
    const getEnrolledProjects = async () => {
      const user = JSON.parse(localStorage?.getItem("user") ?? "{}");
      const projectsRef = collection(db, "projects");

      const querySnapshot = await getDocs(projectsRef);

      querySnapshot.forEach((doc) => {
        if (doc.id) {
          const members = doc.data().members;
          members?.forEach((member: User) => {
            if (member.uid === user.uid) {
              if (!!enrolledProjects) {
                setEnrolledProjects([
                  ...enrolledProjects,
                  doc.data() as Project,
                ]);
              } else {
                setEnrolledProjects([doc.data()] as Project[]);
              }
            }
          });
        }
      });
    };
    const getCreatedProjects = async () => {
      const user = JSON.parse(localStorage?.getItem("user") ?? "{}");
      const projectsRef = collection(db, "projects");

      const querySnapshot = await getDocs(projectsRef);
      querySnapshot.docs.forEach((doc) => {
        if (doc.id) {
          if (doc.data().createdBy.uid === user.uid) {
            {
              if (!!createdProjects) {
                setCreatedProjects([...createdProjects, doc.data() as Project]);
              } else {
                setCreatedProjects([doc.data()] as Project[]);
              }
            }
          }
        }
      });
    };
    getEnrolledProjects();
    getCreatedProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Navbar />
      <PageWrapper title="💼 Profile">
        <div>
          <h1 className="textHeadings">Projects Contributing In:</h1>
          <div className="flex flex-col w-full gap-y-4 my-4">
            {enrolledProjects?.map((project, idx) => {
              return <ProjectDiv key={idx} {...project} />;
            })}
          </div>
          <h1 className="textHeadings">Created Projects:</h1>

          <div className="flex flex-col w-full gap-y-4 my-4">
            {createdProjects?.map((project, idx) => {
              return <ProjectDiv key={idx} {...project} />;
            })}
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Profile;
