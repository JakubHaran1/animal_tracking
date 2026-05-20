import { useEffect, useState } from "react";
import { isAxiosError } from "axios";
import {
  ProfileCard,
  ProfileChangePasswordModal,
  ProfileEditModal,
} from "../components";
import { useAuth } from "../context/AuthContext";
import { profileService } from "../services";
import { User } from "../types";

export function ProfilePage() {
  const { logOut } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [observationSaved, setObservationSaved] = useState(0);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    profileService.getMyProfile().then(setUser);
  }, [observationSaved]);

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

  const resolvePasswordError = (err: unknown): string | null => {
    if (!isAxiosError(err)) {
      return null;
    }
    const data = err.response?.data as Record<string, unknown> | undefined;
    if (!data) {
      return null;
    }
    if (typeof data.detail === "string") {
      return data.detail;
    }
    const fieldOrder = [
      "current_password",
      "new_password",
      "confirm_new_password",
    ];
    for (const field of fieldOrder) {
      const value = data[field];
      if (typeof value === "string") {
        return value;
      }
      if (Array.isArray(value) && typeof value[0] === "string") {
        return value[0];
      }
    }
    return null;
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmNewPassword: string,
  ) => {
    setPasswordError(null);
    setIsChangingPassword(true);
    try {
      await profileService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
        confirm_new_password: confirmNewPassword,
      });
      setIsPasswordModalOpen(false);
      logOut();
    } catch (err) {
      setPasswordError(
        resolvePasswordError(err) || "Nie udało się zmienić hasła.",
      );
    } finally {
      setIsChangingPassword(false);
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
        observationSaved={observationSaved}
        setObservationSaved={setObservationSaved}
        onChangePassword={() => {
          setPasswordError(null);
          setIsPasswordModalOpen(true);
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
      <ProfileChangePasswordModal
        isOpen={isPasswordModalOpen}
        isSaving={isChangingPassword}
        error={passwordError}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleChangePassword}
      />
    </>
  );
}
