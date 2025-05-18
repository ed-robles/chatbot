import { useState } from "react";
import { CircleArrowUp } from "lucide-react";

const App = () => {
  const [value, setValue] = useState("");
  const [previousChats, setPreviousChats] = useState([]);

  const getMessages = async () => {
    if (!value) return;
    const options = {
      method: "POST",
      body: JSON.stringify({ message: value }),
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetch("/api/completions", options);
      const data = await response.json();
      const assistantMessage = data.choices[0].message;

      // overwrite history with only the latest Q&A
      setPreviousChats([
        { role: "user", content: value },
        { role: assistantMessage.role, content: assistantMessage.content },
      ]);

      setValue(""); // clear the input
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app">
      <section className="main">
        <div id="logo">
          <img
            src="logo192.png"
            width={128}
            height={128}
            alt="RCC Circle Logo"
          />
        </div>
        <ul className="feed">
          {previousChats.map((msg, i) => (
            <li key={i}>
              {/* <p className="role">{msg.role}</p> */}
              <p>{msg.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <form
            className="input-container"
            onSubmit={(e) => {
              e.preventDefault();
              getMessages();
            }}
          >
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              // you can leave or remove this
              onKeyDown={(e) => {
                if (e.key === "Enter") getMessages();
              }}
            />
          </form>
        </div>
      </section>
      <p className="info">Created by Edgar Robles 🧑‍💻</p>
    </div>
  );
};

export default App;
