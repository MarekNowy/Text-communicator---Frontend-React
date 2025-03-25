import axios from "axios";
import styles from "./chat.module.css";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "../Context/socket";

const Chat = ({ userId }: { userId: any }) => {
  const socket = getSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  
  const JWT_TOKEN = localStorage.getItem("access_token");
  
  useEffect(() => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView(
        { behavior: "smooth", block: "end" }
      )
    }
  }, [messages]); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if(!userId){return};
        const response = await axios.get(`http://localhost:3000/messages/interlocutors/${userId}`, {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });
        console.log(response.data)
       setMessages(response.data);
      } catch (err) {
        console.log("Error: " + err);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    console.log('efekt startuje', socket);
    const handleMessage = (data: any) => {
      setMessages((prevMessages) => [data, ...prevMessages]);
    };
    socket.on('message', handleMessage);
    return () => {
    socket.off('message', handleMessage);
   };
  }, [socket]);

  const handleSendMessage = async () => {
  try {
    const response = await axios.post(`http://localhost:3000/messages`, {
      "receiverId": userId,
      "content": text
    }, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },  
    })
    console.log("befor emit");
    socket.emit('message', {toUserId: userId, message: text});
    console.log("after emit");
    
    setText('');
    
  } catch (error){
    console.log(error);
  }} 
 
  const handleSentTime = (time:string) => {
  const sendTime:any = new Date(time);
  const now:any = new Date();
  const timeDiffrence:any = now - sendTime;
  const days = Math.floor(timeDiffrence/(1000*60*60*24));
  if(days == 0 ){
    
  const hours = sendTime.getHours().toString().padStart(2,"0");
  const minutes = sendTime.getHours().toString().padStart(2,"0");
  const formatedData = `${hours}:${minutes}`;
  return formatedData;

  } else {
    const day = sendTime.getDate().toString().padStart(2,"0");
    const month = (sendTime.getMonth() + 1).toString().padStart(2,"0");
    const formattedData = `${day}.${month}`;
    return formattedData;
  }
  }
  return (
    <div className={styles.chat}>
      {
      typeof messages[messages.length-1] === "string" ?
      <div className={styles.user}>
        <img src="/avatar2.jpg" alt="" className={styles.avatar}/>
        <div className={styles.usernickname}>
        {messages[messages.length-1]}
        </div>
      </div> : 
      <div className={styles.user}>
        <div className={styles.usernickname}>
        Welcome!
        </div>
      </div>}
      <div className={styles.messages}>
        <div className={styles.content}>
          {messages.slice(0, messages.length - 1).reverse().map((message: any) => {
            const data = handleSentTime(message.sentAt)
            if (message.senderId === userId) {
              return (
                <div key={message.id} className={styles.received}>
                  {message.content}
                  <p>{data}</p>
                </div>
              );
            } else {
              return (
                <div key={message.id} className={styles.send}>
                  {message.content}  
                  <p>{data}</p> 
                </div>
              );
            }
          })}
          <div ref={messagesEndRef}></div>
        </div> 
        <div className={styles.tosend}>
          <textarea onChange={(e) => setText(e.target.value)} value={text}></textarea>
          <button onClick={handleSendMessage}><div className={styles.envelope}>📨</div></button>
        </div>
      </div>
    </div>
  );
};
export default Chat;
