import { User } from "../../types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="rounded-xl border border-green-200 bg-lime-50 p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-green-900">Mój profil</h1>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-green-800">Nazwa użytkownika</dt>
          <dd className="text-green-950">{user.username}</dd>
        </div>
        <div>
          <dt className="font-medium text-green-800">Email</dt>
          <dd className="text-green-950">{user.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-green-800">Miasto</dt>
          <dd className="text-green-950">{user.city}</dd>
        </div>
        <div>
          <dt className="font-medium text-green-800">Dołączono</dt>
          <dd className="text-green-950">{user.joinedAt}</dd>
        </div>
      </dl>
    </section>
  );
}
