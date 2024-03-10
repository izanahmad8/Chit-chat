import React from "react";
import chatlogo from "../assets/chatlogo.png";

export default function Navbar() {
  return (
    <nav>
      <img className="logo" src={chatlogo} alt="Chatlogo" />
      <p>Chit - Chat</p>
    </nav>
  );
}
