import styles from "./chat.module.css";

const Chat = () => {
  return (
    <div className={styles.chat}>
      <div className={styles.user}>
        <img src="/avatar2.jpg" alt="" className={styles.avatar} />
        <div className={styles.usernickname}>
          User NickName
        </div>
      </div>
      <div className={styles.messages}>
        <div className={styles.content}>
          
          <div className={styles.send}>
            send
            <p>11.36</p>
          </div>

          <div className={styles.received}>
            receive
            <p>11.36</p>
          </div>

        </div>
        <div className={styles.tosend}>
          <textarea></textarea>
          <button>📨</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
