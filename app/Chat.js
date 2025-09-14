"use client";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("wss://" + window.location.host + "/api/chat");
    ws.current.onmessage = (event) => {
      setMessages((msgs) => [...msgs, event.data]);
    };
    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws.current.readyState === 1) {
      ws.current.send(input);
      setInput("");
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Anonymous Chat Room</h2>
      <div style={{ border: "1px solid #ccc", height: 300, overflowY: "auto", padding: 10, marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: "5px 0" }}>{msg}</div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        style={{ width: "80%", padding: 8 }}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage} style={{ width: "18%", padding: 8, marginLeft: "2%" }}>Send</button>
    </div>
  );
}
