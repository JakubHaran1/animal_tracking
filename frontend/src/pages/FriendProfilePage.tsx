import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileCard } from "../components";
import { profileService } from "../services";
import { User } from "../types";

export function FriendProfilePage() {
  const { friendId } = useParams<{ friendId: string }>();
  const [friend, setFriend] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!friendId) {
      setIsLoading(false);
      return;
    }

    profileService
      .getFriendProfile(friendId)
      .then((data) => {
        setFriend(data);
        setError(null);
      })
      .catch(() => {
        setError("Nie udało się pobrać profilu znajomego.");
        setFriend(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [friendId]);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        Ładowanie profilu znajomego...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        {error}
      </div>
    );
  }

  if (!friend) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        Nie znaleziono profilu znajomego.
      </div>
    );
  }

  return <ProfileCard user={friend} title="Profil znajomego" />;
}
