"use client";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/chat`;
    ws.current = new WebSocket(wsUrl);
    
    ws.current.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket Connected');
    };

    ws.current.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket Disconnected');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket Error:', error);
      setIsConnected(false);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((msgs) => [...msgs, data]);
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() && ws.current.readyState === 1) {
      const messageData = {
        text: input.trim(),
        timestamp: new Date().toISOString(),
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      ws.current.send(JSON.stringify(messageData));
      setInput("");
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "40px auto",
      padding: "0 20px",
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}>
        <header style={{
          background: "#2563eb",
          color: "white",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
            Anonymous Chat Room
          </h1>
          <div style={{
            background: isConnected ? "#22c55e" : "#ef4444",
            padding: "4px 12px",
            borderRadius: "full",
            fontSize: "0.875rem",
          }}>
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </header>

        <div style={{
          height: "500px",
          overflowY: "auto",
          padding: "20px",
          background: "white",
        }}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                background: "#f3f4f6",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "12px",
              }}
            >
              <div style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "4px",
              }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              <div style={{ wordBreak: "break-word" }}>{msg.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div style={{
          padding: "16px 20px",
          background: "white",
          borderTop: "1px solid #e5e7eb",
          display: "flex",
          gap: "12px",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              outline: "none",
              fontSize: "1rem",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = "#1d4ed8"}
            onMouseOut={e => e.currentTarget.style.backgroundColor = "#2563eb"}
          >
            Send
          </button>
        </div>
      </div>
        </div>
  );
}

