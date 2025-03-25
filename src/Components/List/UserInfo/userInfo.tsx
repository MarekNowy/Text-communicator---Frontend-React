import axios from "axios"
import styles from "./userInfo.module.css"
import '/public/css/fontello.css'
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { ValueContext } from "../ChatList/chatList"

const UserInfo = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null);
  const JWT_TOKEN = localStorage.getItem("access_token");
 
  const [settings, setSettings] = useContext(ValueContext)

  const goToSettings = () => {
    setSettings(true)
  }
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users/getinfo", {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    if (JWT_TOKEN) {
      fetchUserInfo();
    }
  }, [JWT_TOKEN]);

 const handleLogOut = async () => {
    try {
      console.log("log out")
    const response = await axios.get("http://localhost:3000/auth/logout", {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/login')
        
      } catch (error) {
        console.log(error)
      }
  }
    return(
        <div className={styles.userinfo}>
        <img onClick={() => {setSettings(false)}} src="/avatar2.jpg" alt="" className={styles.avatar}/>
        <h2>{user?.nickName}</h2>
        <div className={styles.icons}>
        <i className="icon-cog" onClick={goToSettings}/>
        <i className="icon-article-alt"/>
        <i className="icon-login" onClick={handleLogOut}/>
        </div>
        </div>        
    )
}

export default UserInfo;