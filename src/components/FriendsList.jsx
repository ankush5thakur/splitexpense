import React, { useState } from "react";
// import { Button } from "./Button";

export function FriendsList({ friends, onselection, selectFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          selectFriend={selectFriend}
          onselection={onselection}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onselection, selectFriend }) {
  const isSelected = selectFriend && selectFriend.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ₹{Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>{friend.name} and you are even</p>}
      <Button onClick={() => onselection(friend)}>
        {isSelected ? "Close " : "Select"}
      </Button>
    </li>
  );
}

export function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(
    "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);
    setName("");
    setImage(
      "https://ps.w.org/user-avatar-reloaded/assets/icon-256x256.png?rev=2540745"
    );
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

export function FormSplitBill({ selectFriend, onSplitBIll }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPlaying, setWhoIsPlaying] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBIll(whoIsPlaying === "user" ? paidByFriend : -paidByUser);
  }

  return (
    <form className="form-split-bill">
      <h2>Split a bill with {selectFriend.name}</h2>
      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>Your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑{selectFriend.name}'s expense</label>
      <input type="text" disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPlaying}
        onChange={(e) => setWhoIsPlaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
