import { useEffect, useState } from "react";
import { ProfileCard, ProfileEditModal } from "../components";
import { profileService } from "../services";
import { User } from "../types";

export function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profileService.getMyProfile().then(setUser);
  }, []);

  const handleSave = async (city: string) => {
    setError(null);
    setIsSaving(true);
    try {
      const updated = await profileService.updateMyProfile(city);
      setUser(updated);
      setIsEditing(false);
    } catch {
      setError("Nie udało się zapisać zmian.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
        Ładowanie profilu...
      </div>
    );
  }

  return (
    <>
      <ProfileCard
        user={user}
        enableObservationFilters
        onEdit={() => {
          setError(null);
          setIsEditing(true);
        }}
      />
      <ProfileEditModal
        isOpen={isEditing}
        initialCity={user.city}
        isSaving={isSaving}
        error={error}
        onClose={() => setIsEditing(false)}
        onSave={handleSave}
      />
    </>
  );
}
