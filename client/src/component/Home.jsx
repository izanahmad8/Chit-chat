import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chat from "./Chat";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const onChange = (e) => {
    setName(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== "") {
      setChatVisible(true);
      navigate(`/chat?name=${name}`);
    } else {
      alert("Please Enter Your Name!");
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit} action="#" id="form-container">
        <input
          type="text"
          name="name"
          id="nameinp"
          placeholder="Enter your Name"
          autoComplete="off"
          minLength={3}
          value={name}
          onChange={onChange}
        />
        <button type="submit" className="button">
          Start chat!
        </button>
        <small>To start a chat, Please tell us your name</small>
      </form>
      {chatVisible && <Chat name={name} />}
    </div>
  );
}
