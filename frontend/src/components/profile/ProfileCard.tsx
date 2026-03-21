import { User } from "../../types";

interface ProfileCardProps {
  user: User;
  title?: string;
}

export function ProfileCard({ user, title = "Mój profil" }: ProfileCardProps) {
  return (
    <section className="rounded-xl border border-green-200 bg-lime-50 p-6 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-green-900">{title}</h1>
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

      <div className="mt-6 border-t border-green-200 pt-4">
        <h2 className="mb-3 text-base font-semibold text-green-900">Dodane publikacje</h2>
        {user.publications.length === 0 ? (
          <p className="text-sm text-green-800">Brak publikacji.</p>
        ) : (
          <ul className="space-y-2">
            {user.publications.map((publication) => (
              <li
                key={publication.id}
                className="rounded-md border border-green-200 bg-white/70 px-3 py-2 text-sm"
              >
                <p className="font-medium text-green-950">{publication.title}</p>
                <p className="text-green-800">Data: {publication.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
