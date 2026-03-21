import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ProfileCard } from "../components";
import { profileService } from "../services";
import { User } from "../types";

export function FriendProfilePage() {
  const { friendId } = useParams<{ friendId: string }>();
  const [friend, setFriend] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!friendId) {
      setIsLoading(false);
      return;
    }

    profileService.getFriendProfile(friendId).then((data) => {
      setFriend(data);
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

  if (!friend) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        Nie znaleziono profilu znajomego. To placeholder pod przyszłe dane z backendu.
      </div>
    );
  }

  return <ProfileCard user={friend} title="Profil znajomego" />;
}
