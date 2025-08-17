import { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: "system", content: "You are a helpful assistant." }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("http://localhost:8787/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const reply = data.reply || "⚠️ No response";

      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "❌ Error contacting backend" }]);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md bg-gray-800 p-4 rounded-lg shadow-lg">
        <div className="h-80 overflow-y-auto mb-4 p-2 border border-gray-700 rounded">
          {messages.filter(m => m.role !== "system").map((msg, i) => (
            <p key={i} className={msg.role === "user" ? "text-blue-400" : "text-green-400"}>
              <b>{msg.role === "user" ? "You" : "Bot"}:</b> {msg.content}
            </p>
          ))}
        </div>
        <div className="flex">
          <input
            className="flex-1 p-2 rounded-l bg-gray-700 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 px-4 rounded-r"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
