import { useEffect, useState } from "react";
import { ProfileCard } from "../components";
import { profileService } from "../services";
import { User } from "../types";

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    profileService.getMyProfile().then(setUser);
  }, []);

  if (!user) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Ładowanie profilu...
      </div>
    );
  }

  return <ProfileCard user={user} />;
}
