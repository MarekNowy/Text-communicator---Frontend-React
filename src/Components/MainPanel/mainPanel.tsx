import styles from "./mainPanel.module.css"
import List from "../List/list";
import Chat from "../Chat/chat";
import Detail from "../Detail/detail";
import { useState } from "react";
const MainPanel = () => {

    const [userId, setUserId]= useState<string>("")

    const handleClick = (userId: string):void => {
    setUserId(userId)
    console.log(userId)
    }

    return(<>
    <div className={styles.box}>
        <List onUserClick={handleClick}/>
        <Chat userId = {userId}/>
        <Detail/>
    </div>
    </>)
}
export default MainPanel;