'use client';
import { useState } from "react";
import axios from "axios";



const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmitLogin() {
    try {
      const response = await axios.post(
        "http://localhost:8000/login",
        {
          email,
          password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response.data.message);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userID", response.data.userID);
    } catch (error) {
      console.error("Error during login:", error);
      // Show the "Wrong credentials" message
      alert("Incorrect email or password");
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitLogin();
        }}
      >
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};


export default LoginPage