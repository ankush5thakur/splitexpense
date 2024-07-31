import React, { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import {
  FriendsList,
  Button,
  FormAddFriend,
  FormSplitBill,
} from "./components/FriendsList";
import Header from "./components/Header";

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchFriends = async () => {
      setLoading(true); // Set loading to true before fetching
      try {
        const response = await fetch(
          "https://backend-splitter.onrender.com/friends"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const initialFriends = await response.json();
        setFriends(initialFriends);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchFriends();
  }, []);

  const handleAddFriendToList = async (friend) => {
    try {
      const response = await fetch(
        "https://backend-splitter.onrender.com/friends",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(friend),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newFriend = await response.json();
      setFriends((prevFriends) => [...prevFriends, newFriend]);
      setShowAddFriend(false);
    } catch (error) {
      console.error("Error adding friend:", error);
    }
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

  const updateFriendBalance = async (friendId, newBalance) => {
    try {
      const response = await fetch(
        `https://backend-splitter.onrender.com/friends/${friendId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ balance: newBalance }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error("Error updating friend balance:", error);
    }
  };

  const handleSplitBill = async (value) => {
    const newFriends = friends.map((friend) =>
      friend.id === selectedFriend.id
        ? { ...friend, balance: friend.balance + value }
        : friend
    );

    setFriends(newFriends);

    const updatedFriend = newFriends.find(
      (friend) => friend.id === selectedFriend.id
    );

    await updateFriendBalance(updatedFriend.id, updatedFriend.balance);

    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <Header />
      <div className="content">
        {loading ? ( // Show loading message or spinner while loading
          <div className="loading">Loading...</div>
        ) : (
          <>
            <div className="sidebar">
              <FriendsList
                friends={friends}
                selectFriend={selectedFriend}
                onSelection={handleSelection}
              />
              {showAddFriend && (
                <FormAddFriend onAddFriend={handleAddFriendToList} />
              )}
              <Button onClick={handleAddFriend}>
                {showAddFriend ? "Close" : "Add friend"}
              </Button>
            </div>
            {selectedFriend && (
              <FormSplitBill
                selectFriend={selectedFriend}
                onSplitBill={handleSplitBill}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
