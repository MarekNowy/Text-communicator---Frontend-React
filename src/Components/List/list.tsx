import styles from "./list.module.css"
import ChatList from "./ChatList/chatList"
import UserInfo from "./UserInfo/userInfo"
// <UserInfo/> in gap 10
interface ListProps {
    onUserClick: (userId:string) => void;
}
const List = ({onUserClick}: ListProps) => {
    return(<div className={styles.list}>
    
    <ChatList onUserClick = {onUserClick}/>

    </div>)
}
export default List
