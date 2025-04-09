import styles from "./signUpPanel.module.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

export function SignUpPanel() {
  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const userRef = useRef<HTMLInputElement | null>(null);
  const errRef = useRef<HTMLParagraphElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNickName("");
    setEmail("");
    setPassword("");

    if (nickName.length < 4) {
      setErr("NickName must be longer than 4 marks");
      return;
    }
    if (nickName.length > 14) {
      setErr("NickName must be shorter than 15 marks");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErr("Email must be an email");
      return;
    }
    if (password.length < 4 || password.length > 20) {
      setErr("Password length must be between 4 - 20 marks");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/users/register",
        {
          nickName: nickName,
          email: email,
          password: password,
        }
      );
    } catch (err: any) {
      const status = err.response.status;
      if (!err.response) {
        setErr("No server response");
      } else if (status === 400) {
        setErr("Invalid login data");
      } else if (status === 409) {
        setErr("User already exists");
      }
    }
  };

  useEffect(() => {
    setErr("");
  }, [nickName, email, password]);

  return (
    <>
      <section>
        <p
          ref={errRef}
          className={err ? styles.errMsg : styles.offscreen}
          aria-live="assertive"
        >
          {err}
        </p>
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="userNickName">User NickName</label>
          <input
            ref={userRef}
            type="text"
            id="userNickName"
            autoComplete="off"
            onChange={(e) => setNickName(e.target.value)}
            value={nickName}
          />
          <label htmlFor="userEmail">User Email</label>
          <input
            type="email"
            id="userEmail"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <label htmlFor="userPassword">User Password</label>
          <input
            type="password"
            id="userPassword"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <button>Sign Up</button>
          <p>
            Already have an account?
            <br />
            <span className="line">
              <a href="/login">Sign In</a>
            </span>
          </p>
        </form>
      </section>
    </>
  );
}

export default SignUpPanel;
