import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
import { getContactName } from "../util/getContactName";
import { io, Socket } from "socket.io-client";
import COCKATOO from "./.././assests/cockatoo.png";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
};

interface User {
    _id: string;
    userName: string;
    conversation: string;
    profileImage: {
      url: string
    };
    language: string;
  }

interface UsersList {
  contactedUsers: User[];
  uncontactedUsers: User[];
}

const Chat = () => {
  const {
    user,
    conversationId,
    setConversationId,
    selectId,
    setSelectId,
    isDarkMode,
    setRecipient,
    messages,
    language, setLanguage,
  } = useContext(UserContext);

  const socket = useRef<Socket<MyEventMap> | null>();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [view , setView] = useState<'friends' | 'people'>('friends');
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );

  

  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_SOCKET}`);
  }, []);

  useEffect(() => {
    if (socket.current && user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users: unknown[]) => {
        let usersMap = new Set();
        users.map((user: any) => {
          usersMap.add(user[0]);
          let usersArray: any[] = Array.from(usersMap);
          setOnlineUsers(usersArray);
        });
      });
    }
  }, [socket.current, user]);

  useEffect(() => {
    if (
      usersList?.contactedUsers &&
      usersList?.uncontactedUsers &&
      onlineUsers
    ) {
      const onlContact = usersList.contactedUsers.filter((u) =>
        onlineUsers.includes(u._id)
      );
      const onlUnContact = usersList.uncontactedUsers.filter((u) =>
        onlineUsers.includes(u._id)
      );
      setOnlineFriends([...onlContact, ...onlUnContact]);
    }
  }, [onlineUsers, usersList?.contactedUsers, usersList?.uncontactedUsers]);

  const fetchUsers = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_USERS_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data)
    setUsersList(data.users)
  };

  useEffect(() => {
    fetchUsers();
    if (socket.current) {
      socket.current.on('getMessage', () => {
        fetchUsers();
      });
    }
  }, [socket.current, messages]);

  const handleSelectContact = (u: User) => {
    setConversationId(u.conversation._id);
    setSelectId(u._id);
    setLanguage(u?.language)
  };

  const handleSelectUnContact = (unContact: User) => {
    setConversationId(null);
    setSelectId(unContact._id);
    setRecipient(unContact.userName);
  };

  const handleSelectPeople = () => {
    setConversationId(null)
    setSelectId(null);
    setView("people")
  }


  return (
    <>
      <div className={`flex h-[100vh] overflow-hidden lex-grow ${isDarkMode ? "bg-dark" : "bg-light"}`}>
        <div
          className={`md:w-72  max-h-screen p-2 ${isDarkMode ? "bg-gray-800" : "bg-slate-200"}`}
        >
          <div className="flex items-center gap-2">
            <button
              className={`p-2 rounded-lg ${
                view === "friends" ? "bg-slate-500" : "bg-slate-300"
              }`}
              onClick={() => setView("friends")}
            >
              Friends
            </button>
            <button
              className={`p-2 rounded-lg ${
                view === "people" ? "bg-slate-500" : "bg-slate-300"
              }`}
              onClick={handleSelectPeople}
            >
              People
            </button>
          </div>
          {
            view === 'friends' && (
          
          <div className="overflow-y-auto h-full ">
            {usersList
              ? usersList.contactedUsers.map((u) => {
                  return (
                    <div
                      key={u._id}
                      className={
                        "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer last:mb-[3rem] " +
                        (conversationId === u.conversation._id
                          ? "bg-slate-500"
                          : "")
                      }
                      onClick={() => handleSelectContact(u)}
                    >
                      <div className="flex flex-row gap-4">
                        <div className="h-full w-1/3 items-center justify-between">
                          <div className="relative">
                            <div
                              className="w-10 h-10 rounded-full shadow-xl flex items-center justify-center"
                              style={{
                                backgroundImage: `url(${
                                  u.profileImage?.url || COCKATOO
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {!u.profileImage && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6 text-gray-300"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              )}
                            </div>
                            {getContactName(u.userName, onlineFriends)}
                          </div>
                        </div>
                        <div className="flex w-2/3 items-center justify-center">
                          <div className="text-center">
                            {u.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
            )
          }
          {/* <div
            className={`text-xl p-3 text-center  underline underline-offset-4 ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            People
          </div> */}
          {
            view === 'people' && (
          
          <div className="overflow-y-auto h-full ">
            {usersList
              ? usersList.uncontactedUsers.map((unContact) => {
                  if (unContact._id === user?._id) {
                    return null;
                  }
                  return (
                    <div
                      key={unContact._id}
                      className={
                        "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer last:mb-[3rem] " +
                        (selectId === unContact._id ? "bg-slate-500" : "")
                      }
                      onClick={() => handleSelectUnContact(unContact)}
                    >
                      <div className="flex flex-row gap-4">
                        <div className="h-full w-1/3 items-center justify-between">
                          <div className="relative">
                            <div
                              className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center"
                              style={{
                                backgroundImage: `url(${
                                  unContact.profileImage?.url || COCKATOO
                                })`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {!unContact.profileImage && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-6 h-6 text-gray-300"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                  />
                                </svg>
                              )}
                            </div>
                            {getContactName(unContact.userName, onlineFriends)}
                          </div>
                        </div>
                        <div className="flex w-2/3 items-center justify-center">
                          <div className="text-center">
                            {unContact.userName}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : null}
          </div>
            )
          }
        </div>

        <ChatContainer socket={socket} />
      </div>
    </>
  );
};

export default Chat;
