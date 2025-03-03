import axios from "axios";
import styles from "./chatList.module.css";
import { useState, useEffect } from "react";


const ChatList = () => {
  const [users, setUsers] = useState<any>([]);
  const JWT_TOKEN = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/messages", {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (JWT_TOKEN) {
      fetchPartnerData();
    }
  }, [JWT_TOKEN]);

  const handleClick = (user: any) => {
    console.log(user);
  };

  return (
    <div className={styles.chatlist}>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <label htmlFor="searchUser">
            <i className="icon-search" />
          </label>
          <input type="text" id="searchUser" autoComplete="off" />
          <i className="icon-user-add" />
        </div>
      </div>

      {users.length > 0 ? (
        users.map((user: any) => (
          <div
            key={user.id}
            className={styles.item}
            onClick={() => {
              handleClick(user.id);
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
  );
};

export default ChatList;
