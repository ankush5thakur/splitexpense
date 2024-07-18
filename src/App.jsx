import React, { useState } from "react";
import "./index.css";
import {
  FriendsList,
  Button,
  FormAddFriend,
  FormSplitBill,
} from "./components/FriendsList";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectFriend, setSelectedFriend] = useState(null);

  const handleAddFriendToList = (friend) => {
    setFriends((prevFriends) => [...prevFriends, friend]);
    setShowAddFriend(false);
  };

  const handleAddFriend = () => {
    setShowAddFriend(!showAddFriend);
    setSelectedFriend(null);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((prevSelectedFriend) =>
      prevSelectedFriend?.id === friend.id ? null : friend
    );
    setShowAddFriend(false);
  };

  function handleSplitBill(value) {
    // console.log(value);
    setFriends((friends) =>
      friends.map((friends) => {
        friends.id === setSelectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend;
      })
    );

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectFriend={selectFriend}
          onselection={handleSelection}
        />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriendToList} />}
        <Button onClick={handleAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill
          selectFriend={selectFriend}
          onSplitBIll={handleSplitBill}
        />
      )}
    </div>
  );
}
