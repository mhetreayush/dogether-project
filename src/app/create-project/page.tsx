"use client";
import { Navbar } from "@/components/Navbar";
import { PageWrapper } from "@/components/PageWrapper";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useUser } from "@/store/useUser";
import { useGetUserData } from "@/hooks/useGetUserData";
const CreateProject = () => {
  const router = useRouter();
  const { user } = useUser();

  const { getUserData } = useGetUserData();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (!user) return;
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const {
      name,
      expectedPayment,
      duration,
      finalShipment,
      desc,
      instructions,
      materials,
      otherDetails,
      tags,
    } = Object.fromEntries(data.entries());

    const tagsArray = tags?.toString()?.split(",");

    const projectId = Math.floor(Math.random() * 1000000000).toString();
    try {
      const userData = await getUserData();
      await setDoc(doc(db, "projects", projectId), {
        name,
        projectId,
        expectedPayment,
        duration,
        finalShipment,
        desc,
        instructions,
        materials,
        otherDetails,
        createdBy: {
          name: userData?.name ?? "",
          uid: user.uid,
        },
        tags: tagsArray,
      });
      router.push("/home");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  return (
    <>
      <Navbar />
      <PageWrapper title="📃 Create project">
        <h1 className="textHeadings mb-4">Host Your Project</h1>

        <div className="p-4 bg-primaryYellow rounded-md flex flex-col gap-y-4">
          <Box component="form" onSubmit={handleSubmit}>
            <Box className="flex flex-col gap-y-8">
              <TextField
                required
                name="name"
                label="Project Name"
                id="name"
                fullWidth
              />

              <TextField
                required
                name="expectedPayment"
                label="Payment Expected"
                id="expectedPayment"
                fullWidth
              />

              <TextField
                required
                name="duration"
                label="Duration"
                id="duration"
                fullWidth
              />
              <TextField
                name="finalShipment"
                label="Final Shipment Location"
                id="finalShipment"
                fullWidth
                required
              />
              <TextField
                name="desc"
                label="Project Description"
                id="desc"
                fullWidth
                required
              />
              <TextField
                name="instructions"
                label="Instructions for the Project"
                id="instructions"
                fullWidth
                required
              />

              <TextField
                name="materials"
                label="Materials Required"
                id="materials"
                fullWidth
                required
              />
              <TextField
                name="tags"
                label="Tags (Separated by commas)"
                id="tags"
                fullWidth
                required
              />
              <TextField
                name="otherDetails"
                label="Any other details"
                id="otherDetails"
                fullWidth
              />
              <button type="submit" className="actionButton w-3/4 self-center">
                Submit
              </button>
            </Box>
          </Box>
        </div>
      </PageWrapper>
    </>
  );
};

export default CreateProject;
