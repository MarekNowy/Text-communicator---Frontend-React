import axios from "axios";
import styles from "./chatList.module.css";
import { useState, useEffect, createContext } from "react";
import { getSocket } from "../../Context/socket";
import UserInfo from "../UserInfo/userInfo";
import Settings from "../../Settings/settings";
import Stats from "../../Stats/stats";
import { jwtDecode } from "jwt-decode";
import { data } from "react-router-dom";

interface ChatListProps {
  onUserClick: (userId: string) => void;
}

export const ValueContext = createContext<any>("");

const ChatList = ({ onUserClick }: ChatListProps) => {
  const [settings, setSettings] = useState<boolean>(false);
  const [stats, setStats] = useState<boolean>(false);
  const [users, setUsers] = useState<any>([]);
  const [searchUser, setSearchUser] = useState<any>([]);
  //const [partnerNickName, setPartnerNickName] = useState<string>("");
  const JWT_TOKEN = localStorage.getItem("access_token");
  const socket = getSocket();

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/messages", {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });
        const usersWithUnread = response.data.map((user: any) => ({
          ...user,
          unread: false,
        }));
        setUsers(usersWithUnread);
        console.log("users", usersWithUnread);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (JWT_TOKEN) {
      fetchPartnerData();
    }
  }, [JWT_TOKEN]);

  useEffect(() => {
    const decode: any = jwtDecode(JWT_TOKEN as string);
    const myId = decode["sub"];
    const myNickName = decode["username"];
    const handleNewMessage = (data: any) => {
      console.log(data);
      setUsers((prevUsers: any[]) => {
        const updatedUsers = [...prevUsers];
        let userIndex = null;
        if (data.senderId == myId && data.receiverId != myId) {
          userIndex = updatedUsers.findIndex(
            (user) => user.partnerId == data.receiverId
          );
        } else if (data.senderId != myId && data.receiverId == myId) {
          userIndex = updatedUsers.findIndex(
            (user) => user.partnerId == data.senderId
          );
        } else {
          userIndex = updatedUsers.findIndex((user) => user.partnerId == myId);
        }

        if (
          userIndex !== -1 &&
          updatedUsers[userIndex].partnerId == data.receiverId &&
          updatedUsers[userIndex].partnerId != myId
        ) {
          console.log("case 1");
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            content: data.content,
            unread: false,
          };
        } else if (
          userIndex !== -1 &&
          updatedUsers[userIndex].partnerId == data.senderId &&
          updatedUsers[userIndex].partnerId != myId
        ) {
          console.log("case 2");
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            content: data.content,
            unread: true,
          };
        } else if (
          userIndex !== -1 &&
          updatedUsers[userIndex].partnerId == myId &&
          data.senderId == myId &&
          data.receiverId == myId
        ) {
          console.log("case 3");
          updatedUsers[userIndex] = {
            ...updatedUsers[userIndex],
            content: data.content,
            unread: false,
          };
        } else if (
          userIndex === -1 &&
          data.senderId == myId &&
          data.receiverId == myId
        ) {
          console.log("case 4");
          updatedUsers.push({
            partnerId: data.senderId,
            partnerNickName: data.fromUser,
            content: data.content,
            unread: false,
          });
        } else if (
          userIndex === -1 &&
          data.senderId != myId &&
          data.receiverId == myId
        ) {
          console.log("case 5");
          updatedUsers.push({
            partnerId: data.senderId,
            partnerNickName: data.fromUser,
            content: data.content,
            unread: true,
          });
        } else if (
          userIndex === -1 &&
          data.senderId == myId &&
          data.receiverId != myId
        ) {
          console.log("case 6");
          updatedUsers.push({
            partnerId: data.receiverId,
            partnerNickName: data.toUser,
            content: data.content,
            unread: false,
          });
        }

        return updatedUsers;
      });
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket]);

  const handleUserSearch = async (value: string) => {
    if (!value) {
      setSearchUser([]);
      return;
    }
    const response = await axios.post(
      "http://localhost:3000/users/showusers",
      {
        nickName: value,
      },
      {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      }
    );
    setSearchUser(response.data);
  };

  const handleUserClick = (userId: string) => {
    setUsers((prevUsers: any) =>
      prevUsers.map((user: any) =>
        user.partnerId === userId ? { ...user, unread: false } : user
      )
    );
    onUserClick(userId);
  };

  return (
    <>
      <ValueContext.Provider
        value={{
          settings: [settings, setSettings],
          stats: [stats, setStats],
        }}
      >
        <UserInfo />
      </ValueContext.Provider>

      <div className={styles.chatlist}>
        <div className={styles.search}>
          <div className={styles.searchBar}>
            <label htmlFor="searchUser">
              <i className="icon-search" />
            </label>
            <input
              type="text"
              id="searchUser"
              autoComplete="off"
              onChange={(e) => {
                handleUserSearch(e.target.value);
              }}
            />
            <i className="icon-user-add" />
          </div>
        </div>

        {settings ? (
          <Settings />
        ) : stats ? (
          <Stats />
        ) : searchUser.length > 0 ? (
          searchUser.map((user: any) => (
            <div
              key={user.id}
              className={styles.item}
              onClick={() => {
                //  setPartnerNickName(user.nickName);
                handleUserClick(user.id);
              }}
            >
              <img src="/avatar2.jpg" className={styles.avatar} alt="avatar" />
              <div className={styles.column}>
                <div className={styles.userNick}>{user.nickName}</div>
              </div>
            </div>
          ))
        ) : users.length > 0 ? (
          users.map((user: any) => (
            <div
              key={user.id}
              className={`${styles.item} ${user.unread ? styles.unread : ""}`}
              onClick={() => {
                //  setPartnerNickName(user.partnerNickName);
                handleUserClick(user.partnerId);
              }}
            >
              <img src="/avatar2.jpg" className={styles.avatar} alt="avatar" />
              <div className={styles.column}>
                <div className={styles.userNick}>{user.partnerNickName}</div>
                <p className={styles.latest}>{user.content}</p>
              </div>
            </div>
          ))
        ) : (
          <p>You don't have any conversations yet</p>
        )}
      </div>
    </>
  );
};

export default ChatList;
