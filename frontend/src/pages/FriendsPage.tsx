import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FriendsList } from "../components";
import { friendsService } from "../services";
import { Friend } from "../types";

export function FriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    friendsService.getFriends().then(setFriends);
  }, []);

  const handleRemove = async (friendId: string) => {
    const updatedFriends = await friendsService.removeFriend(friendId);
    setFriends(updatedFriends);
  };

  const handleOpenProfile = () => {
    navigate("/profile");
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm">
        <h1 className="text-xl font-semibold text-green-900">Znajomi</h1>
        <p className="text-sm text-green-800">Lista znajomych i podstawowe akcje.</p>
      </div>
      <FriendsList
        friends={friends}
        onRemove={handleRemove}
        onOpenProfile={handleOpenProfile}
      />
    </section>
  );
}
