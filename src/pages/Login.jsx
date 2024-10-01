import { useEffect, useState } from "react";
import styles from "./Login.module.css";
import PageNav from "../component/PageNav";
import Button from "../component/Button";
import { useFakeAuth } from "./../Context/FakeAuthContext";
import { replace, useNavigate } from "react-router-dom";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [email, setEmail] = useState("besu@gmail.com");
  const [password, setPassword] = useState("abc123");

  const { login, isAuthenticated } = useFakeAuth();
  const navigate = useNavigate();
  
  function handleSummit(e) {
    e.preventDefault();
    if (email && password) {
      login(email, password);
      navigate("/app");
    }
  }

  useEffect(
    function () {
      if (isAuthenticated) navigate("/app", { replace: true });
    },
    [isAuthenticated, navigate]
  );

  return (
    <main className={styles.login}>
      <PageNav />

      <form className={styles.form} onSubmit={handleSummit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
