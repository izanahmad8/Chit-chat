import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import messenger from "../assets/messenger.mp3";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const audio = new Audio(messenger);

  const getName = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    return url.searchParams.get("name");
  };

  useEffect(() => {
    const webRTC = io("https://chat-e-fy-io.onrender.com");
    setSocket(webRTC);

    return () => {
      webRTC.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      initializeChat();
    }
  }, [socket]);

  const initializeChat = async () => {
    const name = getName();
    socket.emit("new-user-joined", name);

    socket.on("user-joined", (name) => {
      append(`${name} joined the chat`, "left");
    });

    socket.on("receive", (data) => {
      append(`${data.name}: ${data.message}`, "left");
    });

    socket.on("leave", (name) => {
      append(`${name} left the chat`, "left");
    });
  };

  const append = (message, position) => {
    setMessages((prevMessages) => [...prevMessages, { message, position }]);
    if (position === "left") {
      audio.play();
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageInput.trim() !== "") {
      append(`Me: ${messageInput}`, "right");
      socket.emit("send", messageInput);
    }
    clearMessageInput();
  };
  const clearMessageInput = () => {
    setMessageInput("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="container" ref={containerRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.position}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="send">
        <form onSubmit={handleSubmit} action="#" id="send-container">
          <input
            type="text"
            name="msginp"
            id="msginp"
            placeholder="Enter your message"
            autoComplete="off"
            onChange={(e) => setMessageInput(e.target.value)}
            ref={inputRef}
          />
          <button type="submit" className="btn" title="send message">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
            >
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
}
