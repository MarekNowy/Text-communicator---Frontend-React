import axios from "axios";
import styles from "./settings.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const JWT: string | null = localStorage.getItem("access_token");
  const [wantToChange, setWantToChange] = useState<boolean>(false);
  const [wantToRemove, setWantToRemove] = useState<boolean>(false);
  const [nickName, setNickName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  const handleNickChange = async () => {
    const response = await axios.patch(
      "http://localhost:3000/users",
      {
        newNickName: nickName,
      },
      {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
      }
    );
  };

  const handleAccountRemove = async () => {
    try {
      const response = await axios.delete("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        data: {
          email: email,
          password: password,
        },
      });
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      navigate("/login");
    } catch (error) {
      console.error("Error removing account", error);
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => setWantToChange(true)}>Change NickName</button>
        <button
          className={styles.danger}
          onClick={() => {
            setWantToRemove(true);
            setWantToChange(false);
          }}
        >
          Remove Account
        </button>
      </div>
      {wantToChange ? (
        <div className={styles.nickChange}>
          <input
            type="text"
            className={styles.nickInput}
            onChange={(e) => setNickName(e.target.value)}
          />
          <button
            className={styles.saveNick}
            onClick={() => {
              handleNickChange();
              window.location.reload();
            }}
          >
            Save
          </button>
        </div>
      ) : wantToRemove ? (
        <div>
          Are you sure?
          <form className={styles.removeForm}>
            <label>Email</label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </form>
          <button
            type="submit"
            className={styles.danger}
            onClick={handleAccountRemove}
          >
            Yes
          </button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Settings;
