import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { friendsService } from "../services";
import { FriendRequest, FriendSummary } from "../types";

export function AddFriendsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FriendSummary[]>([]);
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([friendsService.getFriends(), friendsService.getFriendRequests()])
      .then(([friends, friendRequests]) => {
        if (!isMounted) return;
        setFriendIds(friends.map((friend) => friend.id));
        setRequests(friendRequests);
      })
      .catch(() => {
        if (!isMounted) return;
        setError("Nie udało się pobrać listy znajomych.");
      })
      .finally(() => {
        if (!isMounted) return;
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const pendingIncoming = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "pending" && request.toUser.id === user?.id,
      ),
    [requests, user?.id],
  );

  const pendingOutgoing = useMemo(
    () =>
      requests.filter(
        (request) => request.status === "pending" && request.fromUser.id === user?.id,
      ),
    [requests, user?.id],
  );

  const excludedUserIds = useMemo(() => {
    const ids = new Set(friendIds);
    pendingIncoming.forEach((request) => ids.add(request.fromUser.id));
    pendingOutgoing.forEach((request) => ids.add(request.toUser.id));
    if (user?.id) ids.add(user.id);
    return ids;
  }, [friendIds, pendingIncoming, pendingOutgoing, user?.id]);

  const filteredResults = useMemo(
    () => searchResults.filter((result) => !excludedUserIds.has(result.id)),
    [searchResults, excludedUserIds],
  );

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await friendsService.searchUsers(searchQuery.trim());
      setSearchResults(results);
    } catch {
      setError("Wyszukiwanie nie powiodło się. Spróbuj ponownie za chwilę.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    setError(null);
    try {
      const newRequest = await friendsService.sendFriendRequest(userId);
      setRequests((current) => [newRequest, ...current]);
    } catch {
      setError("Nie udało się wysłać zaproszenia.");
    }
  };

  const handleRequestUpdate = async (requestId: number, status: "accepted" | "declined") => {
    setError(null);
    try {
      const updated = await friendsService.respondToFriendRequest(requestId, status);
      setRequests((current) =>
        current.map((request) => (request.id === updated.id ? updated : request)),
      );
      if (status === "accepted") {
        const friends = await friendsService.getFriends();
        setFriendIds(friends.map((friend) => friend.id));
      }
    } catch {
      setError("Nie udało się zaktualizować zaproszenia.");
    }
  };

  const handleCancelRequest = async (requestId: number) => {
    setError(null);
    try {
      const updated = await friendsService.respondToFriendRequest(requestId, "canceled");
      setRequests((current) =>
        current.map((request) => (request.id === updated.id ? updated : request)),
      );
    } catch {
      setError("Nie udało się anulować zaproszenia.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Dodaj znajomego</h1>
          <p className="text-sm text-green-800">
            Wyszukaj użytkowników i zaproś ich do grona znajomych.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/friends")}
          className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300"
        >
          Wróć do listy
        </button>
      </div>

      <form onSubmit={handleSearch} className="rounded-xl border border-green-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Szukaj po nazwie użytkownika lub emailu"
            className="w-full rounded-md border border-green-200 px-3 py-2 text-sm text-green-900 outline-none focus:border-green-600"
          />
          <button
            type="submit"
            className="rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-lime-50 transition hover:bg-green-600"
          >
            {isSearching ? "Szukam..." : "Szukaj"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-amber-700">{error}</p> : null}
      </form>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-green-900">Wyniki wyszukiwania</h2>
        {isLoading ? (
          <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
            Ładowanie danych...
          </div>
        ) : !hasSearched ? (
          <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
            Wpisz nazwę użytkownika lub email, aby rozpocząć wyszukiwanie.
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
            Brak wyników lub wszyscy znalezieni użytkownicy są już w Twojej sieci.
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredResults.map((result) => (
              <li
                key={result.id}
                className="flex flex-col gap-3 rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-green-900">{result.username}</p>
                  <p className="text-xs text-green-700">{result.id}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleSendRequest(result.id)}
                  className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-lime-50 transition hover:bg-green-600"
                >
                  Wyślij zaproszenie
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-green-900">Przychodzące zaproszenia</h2>
          {pendingIncoming.length === 0 ? (
            <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
              Brak nowych zaproszeń.
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingIncoming.map((request) => (
                <li
                  key={request.id}
                  className="flex flex-col gap-3 rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-green-900">
                      {request.fromUser.username}
                    </p>
                    <p className="text-xs text-green-700">{request.fromUser.id}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRequestUpdate(request.id, "accepted")}
                      className="rounded-md bg-green-700 px-3 py-2 text-sm font-medium text-lime-50 transition hover:bg-green-600"
                    >
                      Akceptuj
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestUpdate(request.id, "declined")}
                      className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300"
                    >
                      Odrzuć
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-green-900">Wysłane zaproszenia</h2>
          {pendingOutgoing.length === 0 ? (
            <div className="rounded-xl border border-green-200 bg-lime-50 p-6 text-sm text-green-800 shadow-sm">
              Brak wysłanych zaproszeń.
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingOutgoing.map((request) => (
                <li
                  key={request.id}
                  className="flex flex-col gap-3 rounded-xl border border-green-200 bg-lime-50 p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-green-900">{request.toUser.username}</p>
                    <p className="text-xs text-green-700">{request.toUser.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCancelRequest(request.id)}
                    className="rounded-md bg-amber-400 px-3 py-2 text-sm font-semibold text-green-950 transition hover:bg-amber-300"
                  >
                    Anuluj zaproszenie
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
