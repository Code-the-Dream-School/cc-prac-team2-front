import { useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import ChatContainer from "../components/ChatContainer";
import { UserContext } from "../context/user-context";
import { getContactName } from "../util/getContactName";
import { io, Socket } from "socket.io-client";

type MyEventMap = {
  connect: () => void;
  disconnect: () => void;
  addUser: (userID: string) => void;
  getUsers: (users: string[]) => void;
};

//`User` interface is already defined in user-context
// however, it is composed differently.
// This should be reconciled so you are not rebuilding
// objects around the codebase, especially since
// UserContext is present in this file
interface User {
    _id: string;
    userName: string;
    // how does conversation compare to `message` in `Messages` interface? If they are the same, this should be reconciled.
    conversation: string;
    profileImage?: ProfileImage
  }

interface UsersList {
    contactedUsers: User[];
    uncontactedUsers: User[];
  }

// should end up co-located with `User`
interface ProfileImage {
  public_id: string,
  url: string
}

const Chat = (): JSX.Element => {
  const {
    user,
    conversationId,
    setConversationId,
    selectId,
    setSelectId,
    isDarkMode,
  } = useContext(UserContext);

  const socket = useRef<Socket<MyEventMap> | null>();
  const [usersList, setUsersList] = useState<UsersList | null>(null);
  const [onlineFriends, setOnlineFriends] = useState<User[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const token: { token: string } | null = JSON.parse(
    localStorage.getItem("token") || "null"
  );


  useEffect(() => {
    socket.current = io("http://localhost:8000");
  }, []);

  

  useEffect(() => {
    if (socket.current && user) {
      socket.current.emit("addUser", user._id);
      socket.current.on("getUsers", (users: unknown[]) => {
        let usersMap = new Set();
        //map should return something.
        //if you need an iterator, use forEach instead
        users.forEach((user:any) => {
          usersMap.add(user[0]);
          let usersArray:any[] = Array.from(usersMap);
          setOnlineUsers(usersArray);
        });
      });
    }
    //socket.current is not a valid dep. Were you trying to accomplish something specific?
  }, [user]);


  useEffect(() => {
    if (usersList?.contactedUsers && usersList?.uncontactedUsers  && onlineUsers) {
      const onlContact = usersList.contactedUsers.filter((u) => onlineUsers.includes(u._id));
      const onlUnContact = usersList.uncontactedUsers.filter((u) => onlineUsers.includes(u._id));
      setOnlineFriends([...onlContact, ...onlUnContact]);
    }
  }, [onlineUsers, usersList?.contactedUsers, usersList?.uncontactedUsers]);



  const fetchUsers = async () => {
    const { data } = await axios.get(`http://localhost:8000/api/v1/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(data.users.contactedUsers[2]);
    setUsersList(data.users)
  };



  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectContact = (u: User) => {
    setConversationId(u.conversation);
    setSelectId(u._id);
  };

  const handleSelectUnContact = (unContact:User) => {
    setConversationId(null); // why null?
    setSelectId(unContact._id);
  };

  return (
    <>
      <div className={`flex flex-grow ${isDarkMode ? "bg-dark" : "bg-light"}`}>
        <div
          className={`w-56 p-2 ${isDarkMode ? "bg-slate-600" : "bg-slate-200"}`}
        >
          <div
            className={`text-xl p-3 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            Contact
          </div>
          {/* Consider decomposing this into sub-component since we are returning 
            some JSX per user in the contactedUsers. It'll simplify this component 
            and we will also be able to re-use it for the uncontactedUsers below. */}
          {usersList ? usersList.contactedUsers.map((u) => {
            return (
                <div key={u._id}
                className={
                    "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer " +
                    (conversationId === u.conversation
                    ? "bg-slate-500"
                    : "")
                }
                onClick={() => handleSelectContact(u)}
                >
                <div className="flex flex-row gap-4">
                <div className="h-full w-1/3 items-center justify-between">
                  <div className="relative">
                    <img
                    className="w-12 h-10 rounded-full shadow-xl"
                    src={u.profileImage?.url}
                    alt=""
                    />
                    {getContactName(u.userName, onlineFriends )}
                  </div>
                  </div>
                  <div className="h-full w-2/3 items-center justify-center">
                    <div className="m-auto text-center items-center justify-center">{u.userName}</div>
                  </div>
                </div>
                </div>
            );
            }) : null }
          <div
            className={`text-xl p-3 text-center ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            People
          </div>
          <div>
            {/* Consider breaking this up into a sub-component. See comment above*/}
            {usersList
              ? usersList.uncontactedUsers.map((unContact) => {
                  if (unContact._id === user?._id) {
                    return null;
                  }
                  return (
                      <div key={unContact._id}
                        className={
                          "flex bg-slate-300 rounded-lg m-3 p-2 cursor-pointer " +
                          (selectId === unContact._id ? "bg-slate-500" : "")
                        }
                        onClick={() => handleSelectUnContact(unContact)}
                      >
                        <div className="flex flex-row gap-4">
                        <div className="h-full w-1/3 items-center justify-between">
                          <div className="relative">
                            <img
                            className="w-12 h-12 rounded-full border-2 shadow-sm"
                            src={unContact.profileImage?.url}
                            alt=""
                            />
                            {getContactName(unContact.userName, onlineFriends )}
                          </div>
                          </div>
                          <div className="h-full w-2/3 items-center justify-center">
                            <div className="m-auto text-center items-center justify-center">{unContact.userName}</div>
                          </div>
                        </div>
                      </div>
                  );
                })
              : null}
          </div>
        </div>

        <ChatContainer socket={socket} />
      </div>
    </>
  );
};

export default Chat;
