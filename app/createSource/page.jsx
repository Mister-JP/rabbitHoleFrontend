'use client';
import { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'


const CreateSourcePage = () => {
    const [link, setLink] = useState("");
    const router = useRouter();
  
    async function onSubmitCreateSource() {
        try {
          
          const token = localStorage.getItem("token");
          const response = await axios.post(
            "http://localhost:8000/createNode",
            {
              link,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          router.push("/source/" + response.data.nodeID);
        } catch (error) {
          console.error("Error during create source:", error);
        }
    }
  
    return (
        <div>
        <h1>Create Source</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitCreateSource();
          }}
        >
          <label htmlFor="link">Link:</label>
          <input
            type="text"
            id="link"
            name="link"
            value={link}
            required
            onChange={(e) => setLink(e.target.value)}
          />
          <br />
          <button type="submit">Create Source</button>
        </form>
      </div>
    );
}

export default CreateSourcePage