import { User } from "./user";

export type Project = {
  createdBy: {
    name: string;
    uid: string;
  };
  desc: string;
  duration: string;
  expectedPayment: string;
  finalShipment: string;
  instructions: string;
  materials: string;
  members: Pick<User, "uid" | "name">[];
  name: string;
  otherDetails: string;
  projectId: string;
  tags: string[];
};

export type ProjectId = Project["projectId"];
