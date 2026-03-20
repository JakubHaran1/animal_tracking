import { Friend } from "../../types";

interface FriendsListProps {
  friends: Friend[];
  onRemove: (friendId: string) => void;
  onOpenProfile: () => void;
}

export function FriendsList({ friends, onRemove, onOpenProfile }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        Brak znajomych na liście.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {friends.map((friend) => (
        <li
          key={friend.id}
          className="flex flex-col gap-3 rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-green-900">{friend.name}</p>
            <p className="text-sm text-green-800">
              Wspólne obserwacje: {friend.mutualObservations}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onOpenProfile()}
              className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-lime-50 transition hover:bg-green-600"
            >
              Przejdź do profilu
            </button>
            <button
              type="button"
              onClick={() => onRemove(friend.id)}
              className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300"
            >
              Usuń znajomego
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
