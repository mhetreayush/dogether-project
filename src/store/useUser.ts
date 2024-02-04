import { User } from "@/types/user";
import { create } from "zustand";

type UserStoreState = {
  user: User | null;
  setUser: (user: User) => void;
};

const useUser = create<UserStoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

export { useUser };
