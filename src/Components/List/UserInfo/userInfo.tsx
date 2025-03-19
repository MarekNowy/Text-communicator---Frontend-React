import axios from "axios"
import styles from "./userInfo.module.css"
import '/public/css/fontello.css'
import { useEffect } from "react"
import { useState } from "react"


const UserInfo = () => {

  const [user, setUser] = useState<any>(null);
  const JWT_TOKEN = localStorage.getItem("access_token");

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
    return(
        <div className={styles.userinfo}>
        <img src="/avatar2.jpg" alt="" className={styles.avatar}/>
        <h2>{user?.nickName}</h2>
        <div className={styles.icons}>
        <i className="icon-cog"/>
        <i className="icon-article-alt"/>
        <i className="icon-login"/>
        </div>
        </div>

        
    )
}

export default UserInfo;