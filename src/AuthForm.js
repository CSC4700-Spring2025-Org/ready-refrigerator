import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signed up!");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
        {isLogin ? "Need to sign up?" : "Already have an account?"}
      </p>
    </div>
  );
};

export default AuthForm;
