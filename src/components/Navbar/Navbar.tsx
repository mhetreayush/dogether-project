import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { db } from "@/lib/firebase";
import { CreateProfileModal } from "@/components/CreateProfileModal";
import Image from "next/image";
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] =
    useState(false);
  const [currentPath, setCurrentPath] = useState("");
  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  const getData = async () => {
    const user = JSON.parse(localStorage?.getItem("user") ?? "{}");
    const userRef = doc(db, "userProfiles", user.uid);
    const docSnap = await getDoc(userRef);
    return docSnap.data();
  };

  const handleStartNow = async () => {
    const res = await getData();

    if (!res) {
      setIsCreateProfileModalOpen(true);
    } else {
      router.push(`/createProject`);
    }
  };
  return (
    <>
      <div className="py-2 px-2 md:px-6 bg-white/30 backdrop-blur shadow sticky top-0 z-50 flex justify-between items-center">
        <Link href="/home">
          <div className="block md:hidden">
            <Image src="/assets/logo.svg" alt="logo" width={150} height={150} />
          </div>
          <div className="hidden md:block">
            <Image src="/assets/logo.svg" alt="logo" width={200} height={200} />
          </div>
        </Link>
        <div className="flex gap-x-3">
          <button onClick={handleStartNow} className="actionButton rounded-md">
            Create Project
          </button>
          {currentPath !== "/profile" && (
            <Link
              href="/profile"
              className="bg-gray-200 rounded-full p-2 flex items-center justify-center"
            >
              <CgProfile className="text-2xl" />
            </Link>
          )}
        </div>
      </div>
      <CreateProfileModal
        isCreateProfileModalOpen={isCreateProfileModalOpen}
        setIsCreateProfileModalOpen={setIsCreateProfileModalOpen}
        createProject
      />
    </>
  );
};

export { Navbar };
