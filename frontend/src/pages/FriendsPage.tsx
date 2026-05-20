import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FriendsList } from "../components";
import { friendsService } from "../services";
import { FriendListItem } from "../types";

export function FriendsPage() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<FriendListItem[]>([]);

  useEffect(() => {
    friendsService.getFriends().then(setFriends);
  }, []);

  const handleRemove = async (friendId: string) => {
    const updatedFriends = await friendsService.removeFriend(friendId);
    setFriends(updatedFriends);
  };

  const handleOpenProfile = (friendId: string) => {
    navigate(`/friends/${friendId}/profile`);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Znajomi</h1>
          <p className="text-sm text-green-800">
            Lista znajomych i podstawowe akcje.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/friends/add")}
          className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-lime-50 transition hover:bg-green-600"
        >
          Dodaj znajomego
        </button>
      </div>
      <FriendsList
        friends={friends}
        onRemove={handleRemove}
        onOpenProfile={handleOpenProfile}
      />
    </section>
  );
}
