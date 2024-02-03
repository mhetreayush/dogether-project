"use client";
import { Navbar } from "@/components/Navbar";
import { ProjectDiv } from "@/components/ProjectDiv";
import { PageWrapper } from "@/components/PageWrapper";
import { Divider } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { db } from "@/lib/firebase";
import FuzzySearch from "fuzzy-search";
import { CreateProfileModal } from "@/components/CreateProfileModal";
import { Project } from "@/types/project";
const Projects = () => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedProjectID, setSelectedProjectID] = useState<string>("");
  const [projects, setProjects] = useState<Project[] | []>([]);
  const [isCreateProfileModalOpen, setCreateProfileModalOpen] = useState(false);
  useEffect(() => {
    const fetchProjects = async () => {
      const projectRef = collection(db, "projects");
      const querySnapshot = await getDocs(projectRef);
      const projects = querySnapshot.docs.map((doc) => doc.data()) as Project[];
      setProjects(projects);
    };
    fetchProjects();
  }, []);

  const searcher = new FuzzySearch(projects, ["name", "tags"], {
    caseSensitive: false,
    sort: true,
  });
  useEffect(() => {
    console.log(JSON.parse(localStorage?.getItem("user") ?? "{}"));
  });
  var result = searcher.search(searchValue);
  return (
    <>
      <Navbar />
      <PageWrapper title="🏠 Home">
        <div className="flex min-h-screen gap-y-4 flex-col">
          <div>
            <h1 className="textHeadings mb-10">Search Projects</h1>
            <div className="relative  rounded-md p-2 pl-10 border border-primaryOrange flex items-center">
              <BsSearch className="absolute left-2 " />
              <input
                className="w-full"
                style={{ outline: "none", backgroundColor: "transparent" }}
                placeholder="Search Tag / Project Name"
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>
          <Divider />
          <div className="flex flex-col gap-y-4">
            {result.length > 0 ? (
              result.map((project, idx) => {
                return (
                  <ProjectDiv
                    key={project?.projectId ?? idx}
                    setSelectedProjectID={setSelectedProjectID}
                    setCreateProfileModalOpen={setCreateProfileModalOpen}
                    {...project}
                  />
                );
              })
            ) : (
              <h1>
                No Projects Found with query query &ldquo;{searchValue}&rdquo;
              </h1>
            )}
          </div>
          {isCreateProfileModalOpen && (
            <CreateProfileModal
              setIsCreateProfileModalOpen={setCreateProfileModalOpen}
              isCreateProfileModalOpen={isCreateProfileModalOpen}
              projectId={selectedProjectID}
            />
          )}
        </div>
      </PageWrapper>
    </>
  );
};

export default Projects;
