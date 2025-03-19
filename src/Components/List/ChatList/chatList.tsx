import axios from "axios";
import styles from "./chatList.module.css";
import { useState, useEffect} from "react";
import { getSocket } from "../../Context/socket";

interface ChatListProps {
    onUserClick: (userId: string) => void; 
  }

const ChatList = ( {onUserClick}: ChatListProps) => {
  const [users, setUsers] = useState<any>([]);
  const JWT_TOKEN = localStorage.getItem("access_token");
  const [searchUser, setSearchUser] = useState<any>([])
  const socket = getSocket()

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
  }, [JWT_TOKEN,searchUser]);

  const handleUserSearch = async (value: string) => {
    if(!value){
      setSearchUser([])
      return;
    }
   const response = await axios.post('http://localhost:3000/users/showusers', 
   {
    "nickName": value,
   },
    { headers: {
      Authorization: `Bearer ${JWT_TOKEN}`,
      }
    })
   setSearchUser(response.data)
   console.log(response.data)
  }

  const handleNewConversation = async (id: string) => {
    try {
      const response = await axios.post(`http://localhost:3000/messages`, {
        "receiverId": id,
        "content": "Hi :)"
      }, {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },  
      })
      socket.emit('message', {toUserId: id, message: "Hi :)"})
      
    } catch (error){
      console.log(error)
    }
  }


  return (
    <div className={styles.chatlist}>
      <div className={styles.search}>
        <div className={styles.searchBar}>
          <label htmlFor="searchUser">
            <i className="icon-search" />
          </label>
          <input type="text" id="searchUser" autoComplete="off" onChange={(e) => {
           handleUserSearch(e.target.value)
          }}/>
          <i className="icon-user-add" />
        </div>
      </div>
      
      {
      searchUser.length > 0 ? ( searchUser.map((user: any) => (
        <div
          key={user.id}
          className={styles.item}
          onClick={() => {
            handleNewConversation(user.id)
            onUserClick(user.id)}}
        >
          <img src="/avatar2.jpg" className={styles.avatar} alt="avatar" />
          <div className={styles.column}>
            <div className={styles.userNick}>{user.nickName}</div>
          </div>
        </div>
      ))) :
      users.length > 0 ? (
        users.map((user: any) => (
          <div
            key={user.id}
            className={styles.item}
            onClick={() => {
              onUserClick(user.partnerId);
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
