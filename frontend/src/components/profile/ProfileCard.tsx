import { User } from "../../types";

interface ProfileCardProps {
  user: User;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-slate-900">Mój profil</h1>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-medium text-slate-600">Nazwa użytkownika</dt>
          <dd className="text-slate-900">{user.username}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-600">Email</dt>
          <dd className="text-slate-900">{user.email}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-600">Miasto</dt>
          <dd className="text-slate-900">{user.city}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-600">Dołączono</dt>
          <dd className="text-slate-900">{user.joinedAt}</dd>
        </div>
      </dl>
    </section>
  );
}
