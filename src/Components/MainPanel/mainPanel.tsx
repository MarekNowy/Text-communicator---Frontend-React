import styles from "./mainPanel.module.css"
import List from "../List/list";
import Chat from "../Chat/chat";
import Detail from "../Detail/detail";
const MainPanel = () => {


    return(<>
    <div className={styles.box}>
        <List/>
        <Chat/>
        <Detail/>
    </div>
    </>)
}
export default MainPanel;