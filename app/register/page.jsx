'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";



const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const router = useRouter();

  async function onSubmitRegister(){
    try {
        const response = await axios.post(
          "http://localhost:8000/register",
          {
            email,
            date_of_birth: dateOfBirth,
            password,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        console.log(response.data.message);
        router.push("/login");
      } catch (error) {
        console.error("Error during registration:", error);
      }
  }

  return (
    <div>
      <h1>Registration</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitRegister();
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
          type="password"
          id="password"
          name="password"
          value={password}
          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$"
          title="Password should have one capital letter, one numeric value, one special character, and be at least 8 characters long"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <label htmlFor="dateOfBirth">Date of Birth:</label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={dateOfBirth}
          required
          onChange={(e) => setDateOfBirth(e.target.value)}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegistrationPage