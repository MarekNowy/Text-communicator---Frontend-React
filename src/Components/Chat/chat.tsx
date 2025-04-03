import axios from "axios";
import styles from "./chat.module.css";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "../Context/socket";
import { jwtDecode } from "jwt-decode";

const Chat = ({ userId }: { userId: any }) => {
  const socket = getSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [page, setPage] = useState<number>(0);
  const [messagesScrollPercentage, setMessagesScrollPercentage] =
    useState<number>();

  const JWT_TOKEN = localStorage.getItem("access_token");
  const myId = jwtDecode(JWT_TOKEN as string)["sub"];

  const filterNewMessages = (
    responseMessages: any[],
    currentMessages: any[]
  ) => {
    const currentMessageIds = new Set(currentMessages.map((msg) => msg.id));
    return responseMessages.filter((msg) => !currentMessageIds.has(msg.id));
  };

  useEffect(() => {
    if ((messagesScrollPercentage as number) > 70) {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: "instant",
          block: "end",
        });
      }
    }
  }, [messages]);

  useEffect(() => {
    if (typeof userId !== "string" || !userId) {
      return;
    }

    const fetchUserData = async () => {
      try {
        setMessages([]);
        setPage(0);
        const response = await axios.get(
          `http://localhost:3000/messages/interlocutors/${userId}/0`,
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
            },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    const nextPage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/interlocutors/${userId}/${page}`,
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
            },
          }
        );
        if (filterNewMessages(response.data, messages)) {
          setMessages((prevMessages) => [...prevMessages, ...response.data]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (page > 0) {
      nextPage();
    }
  }, [page]);

  useEffect(() => {
    const handleMessage = (data: any) => {
      setMessages((prevMessages) => [data, ...prevMessages]);
    };
    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, [socket]);

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/messages`,
        {
          receiverId: userId,
          content: text,
        },
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        }
      );
      socket.emit("message", {
        toUserId: userId,
        message: text,
        fromToken: JWT_TOKEN,
        toUser: messages[messages.length - 1],
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSentTime = (time: string) => {
    const sendTime: any = new Date(time);
    const now: any = new Date();
    const timeDiffrence: any = now - sendTime;
    const days = Math.floor(timeDiffrence / (1000 * 60 * 60 * 24));
    if (days == 0) {
      const hours = sendTime.getHours().toString().padStart(2, "0");
      const minutes = sendTime.getMinutes().toString().padStart(2, "0");
      const formatedData = `${hours}:${minutes}`;
      return formatedData;
    } else {
      const day = sendTime.getDate().toString().padStart(2, "0");
      const month = (sendTime.getMonth() + 1).toString().padStart(2, "0");
      const formattedData = `${day}.${month}`;
      return formattedData;
    }
  };
  useEffect(() => {
    const content: any = document.getElementById("content");
    content.addEventListener("scroll", function () {
      const scrollPosition = content.scrollTop;
      const scrollTop = content.scrollTop;
      const scrollHeight = content.scrollHeight;
      const clientHeight = content.clientHeight;

      const percentage = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setMessagesScrollPercentage(percentage);

      if (scrollPosition == 0) {
        setPage((page as number) + 1);
      }
    });
  });

  return (
    <div className={styles.chat}>
      {typeof messages[messages.length - 1] === "string" ? (
        <div className={styles.user}>
          <img src="/avatar2.jpg" alt="" className={styles.avatar} />
          <div className={styles.usernickname}>
            {messages[messages.length - 1]}
          </div>
        </div>
      ) : (
        <div className={styles.user}>
          <div className={styles.usernickname}>Welcome!</div>
        </div>
      )}
      <div className={styles.messages}>
        <div className={styles.content} id="content">
          {messages
            .slice(0, messages.length - 1)
            .reverse()
            .map((message: any) => {
              const data = handleSentTime(message.sentAt);
              if (message.senderId === userId) {
                return (
                  <div key={message.id} className={styles.received}>
                    {message.content}
                    <p>{data}</p>
                  </div>
                );
              } else if (message.receiverId === userId) {
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
          <textarea
            onChange={(e) => setText(e.target.value)}
            value={text}
          ></textarea>
          <button onClick={handleSendMessage}>
            <div className={styles.envelope}>📨</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
