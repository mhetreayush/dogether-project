import { useEffect, useState } from "react";
import { getDatabase, ref, push, onValue } from "firebase/database";
import { RiSendPlaneFill } from "react-icons/ri";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ChatMessage } from "@/types/chats";
import { useUser } from "@/store/useUser";
const realtimeDB = getDatabase();

const GroupChats = ({ projectId }: { projectId: string }) => {
  const [groupChats, setGroupChats] = useState<ChatMessage[] | null[]>([]);
  const [isChatLoaded, setIsChatLoaded] = useState(false);
  const [newMsg, setNewMsg] = useState("");
  const [projectName, setProjectName] = useState(null);
  const { user: localUser } = useUser();
  const uid = localUser?.uid;
  const addMsg = async () => {
    if (!uid) return;

    const user = await getDoc(doc(db, "userProfiles", uid));
    const userName: string = user?.data()?.name;

    const chatRef = ref(realtimeDB, `groupChats/${projectId}_Chats/chats`);

    const newMsgData = {
      from: {
        name: userName,
        uid,
      },
      type: "text",
      text: newMsg,
      time: new Date().getTime(),
    };

    push(chatRef, newMsgData);

    setNewMsg("");
  };

  useEffect(() => {
    const fetchProjectName = async () => {
      const project = await getDoc(doc(db, "projects", projectId));
      const projectData = project.data();
      if (projectData) {
        const projectName = projectData.name;
        setProjectName(projectName);
      }
    };
    fetchProjectName();
    const chatRef = ref(realtimeDB, `groupChats/${projectId}_Chats/chats`);

    const chatListener = onValue(chatRef, (snapshot) => {
      const chatData: ChatMessage[] = snapshot.val();
      if (chatData) {
        const chats = Object.values(chatData);
        setGroupChats(chats);
        setIsChatLoaded(true);
      }
    });

    return () => {
      // Clean up the listener when component unmounts
      chatListener();
    };
  }, [projectId]);

  return (
    <div className="h-[80vh] md:h-[600px]  overflow-y-auto w-full flex flex-col justify-between ">
      <div className="sticky top-0 pl-2 py-2 border-b border-black bg-primaryYellow ">
        <h1>Project Name: {projectName}</h1>
      </div>
      <div className="flex flex-col gap-y-2 w-full pr-10 px-4  py-3 flex-grow">
        {groupChats?.length > 0 &&
          groupChats?.map((chat, idx) => {
            return (
              <div
                key={idx}
                className={`w-full max-w-1/4 flex break-all p-2 flex-col ${
                  chat?.from?.uid === uid && "items-end"
                }`}
              >
                <p className="text-sm text-gray-600 font-extralight">
                  {chat?.from?.name}
                </p>
                <p
                  className={`w-fit  ${
                    chat?.from?.uid === uid
                      ? "actionButton rounded-md"
                      : "actionButton rounded-md bg-white text-black"
                  }`}
                >
                  {chat?.text}
                </p>
              </div>
            );
          })}
        {isChatLoaded && (groupChats?.length === 0 || !groupChats) && (
          <div className=" flex flex-col gap-y-3 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/noChat.svg" alt="no chat" />
            <h1 className="text-textHeading text-2xl font-bold">
              Nothing here
            </h1>
            <h1 className="text-primaryOrange font-semibold">
              There&apos;s no chat in your feed
            </h1>
          </div>
        )}
      </div>

      <div className="flex sticky bottom-0 pl-2 gap-x-3 mx-2 py-2 pr-10 border border-primaryOrange rounded-full bg-primaryYellow">
        <input
          type="text"
          placeholder="Type here..."
          value={newMsg}
          className="flex-grow outline-none bg-transparent"
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button disabled={!newMsg} onClick={addMsg} className="px-2">
          <RiSendPlaneFill className="text-primaryOrange " />
        </button>
      </div>
    </div>
  );
};

export { GroupChats };
