import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }],
    });
    setInput("");
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          <h1 style={{ margin: 0 }}>AI Chatbot</h1>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {messages.length === 0 && (
            <p style={{ color: "#666", textAlign: "center" }}>
              Start a conversation by typing a message below
            </p>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: message.role === "user" ? "#e3f2fd" : "#fff",
                border:
                  message.role === "user"
                    ? "1px solid #2196f3"
                    : "1px solid #ddd",
              }}
            >
              <div
                style={{
                  fontWeight: "bold",
                  marginBottom: "4px",
                  color: "#333",
                }}
              >
                {message.role === "user" ? "You" : "AI"}
              </div>
              <div style={{ whiteSpace: "pre-wrap", color: "#000" }}>
                {message.parts
                  .filter((part) => part.type === "text")
                  .map((part, index) => (
                    <span key={index}>{part.text}</span>
                  ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div style={{ color: "#666", fontStyle: "italic" }}>
              AI is thinking...
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "10px",
            padding: "20px",
            borderTop: "1px solid #ccc",
            backgroundColor: "#fff",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: "12px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: isLoading || !input.trim() ? "#ccc" : "#2196f3",
              color: "white",
              cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
            }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
