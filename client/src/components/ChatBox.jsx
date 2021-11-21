import React, { useEffect, useRef, useState } from "react";
import { Twemoji } from "react-emoji-render";
import socketIOClient from "socket.io-client";

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "http://127.0.0.1:5000"
    : window.location.host;

function ChatBox(props) {
  const { userInfo } = props;
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([
    { name: "Admin", body: "Hello there, Please ask your question." },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.clientHeight,
        left: 0,
        behavior: "smooth",
      });
    }
    if (socket) {
      socket.emit("onLogin", {
        _id: userInfo._id,
        name: userInfo.name,
        isAdmin: userInfo.isAdmin,
      });
      socket.on("message", (data) => {
        setMessages([...messages, { body: data.body, name: data.name }]);
      });
    }
  }, [messages, isOpen, socket, userInfo]);

  const supportHandler = () => {
    setIsOpen(true);
    console.log(ENDPOINT);
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (messageBody.trim()) {
      setMessages([...messages, { body: messageBody, name: userInfo.name }]);
      setMessageBody("");
      setTimeout(() => {
        socket.emit("onMessage", {
          body: messageBody,
          name: userInfo.name,
          isAdmin: userInfo.isAdmin,
          _id: userInfo._id,
        });
      }, 1000);
    }
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <button type="button" className="support" onClick={supportHandler}>
          <i className="fa fa-support" />
        </button>
      ) : (
        <div className="card">
          <div className="row">
            <span className="support-title">Support </span>
            <button
              type="button"
              className="support-close"
              onClick={closeHandler}
            >
              <i className="fa fa-close" />
            </button>
          </div>
          <hr className="hr" />
          <ul ref={uiMessagesRef} className="chatbox-messages">
            {messages.map((msg, index) => (
              <li key={index}>
                <strong>{`${msg.name}: `}</strong>
                <Twemoji text={msg.body} onlyEmojiClassName="makeEmojisLarge" />
              </li>
            ))}
          </ul>
          <div>
            <form onSubmit={submitHandler} className="row chatbox-hr">
              <input
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                type="text"
                className="chatbox-input"
                placeholder="type message..."
              />
              <button type="submit" className="chatbox-send">
                <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;
