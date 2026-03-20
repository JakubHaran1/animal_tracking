import { Friend } from "../../types";

interface FriendsListProps {
  friends: Friend[];
  onRemove: (friendId: string) => void;
  onOpenProfile: () => void;
}

export function FriendsList({ friends, onRemove, onOpenProfile }: FriendsListProps) {
  if (friends.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Brak znajomych na liście.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {friends.map((friend) => (
        <li
          key={friend.id}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-medium text-slate-900">{friend.name}</p>
            <p className="text-sm text-slate-600">
              Wspólne obserwacje: {friend.mutualObservations}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onOpenProfile()}
              className="rounded-md bg-slate-200 px-3 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-300"
            >
              Przejdź do profilu
            </button>
            <button
              type="button"
              onClick={() => onRemove(friend.id)}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              Usuń znajomego
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
