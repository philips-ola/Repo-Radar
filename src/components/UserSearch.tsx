import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGithubUser, searchGithubUser } from "../api/github";
import { UserCard } from "./UserCard";
import { RecentSearches } from "./RecentSearches";
import { useDebounce } from "use-debounce";
import { SuggestionDropdown } from "./SuggestionDropdown";

function UserSearch() {
  const [username, setUsername] = useState('');
  const [submittedUsername, setSubmittedUsername] = useState('');
  const [showSuggestion, setShowSuggestion] = useState(false);

  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('recentUsers');
      return stored? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [debouncedUsername] = useDebounce(username, 300);

  // Fetch specific user
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', submittedUsername],
    queryFn: () => fetchGithubUser(submittedUsername),
    enabled:!!submittedUsername,
  });

  // Fetch suggestions
  const { data: suggestions } = useQuery({
    queryKey: ['github-user-suggestion', debouncedUsername],
    queryFn: () => searchGithubUser(debouncedUsername),
    enabled: debouncedUsername.trim().length > 1,
  });

  // Add to recent ONLY when fetch is successful
  useEffect(() => {
    if (data &&!error && submittedUsername) {
      setRecentUsers((prev) => {
        const updated = [submittedUsername,...prev.filter((u) => u!== submittedUsername)];
        return updated.slice(0, 5);
      });
    }
  }, [data, error, submittedUsername]);

  // Persist recent users - FIXED
  useEffect(() => {
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers));
  }, [recentUsers]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;
    setSubmittedUsername(trimmed);
    setUsername("");
    setShowSuggestion(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form" style={{ marginTop: '2rem' }}>
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter Github Username"
            value={username}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestion(val.trim().length > 1);
            }}
            onBlur={() => setTimeout(() => setShowSuggestion(false), 200)}
            onFocus={() => username.trim().length > 1 && setShowSuggestion(true)}
          />
        </div>
        <div style={{ marginTop: '-10px' }}>
          {showSuggestion && suggestions?.length > 0 && (
            <SuggestionDropdown
              suggestions={suggestions}
              show={showSuggestion}
              onSelect={(selected: string) => {
                setShowSuggestion(false);
                setUsername(selected);
                if (submittedUsername!== selected) {
                  setSubmittedUsername(selected);
                } else {
                  refetch();
                }
              setRecentUsers((prev) => {
              const updated = [selected,...prev.filter((u) => u!== selected)];
              return updated.slice(0, 5);
            });
              }}
            />
          )}
        </div>

        <button type="submit">Search</button>
      </form>

      {isLoading && <p className="status">Loading...</p>}
      {error && <p className="status error">{(error as Error).message}</p>}
      {data && <UserCard user={data} />}

      {recentUsers.length > 0 && (
        <RecentSearches
          recentUsers={recentUsers}
          setUsername={setUsername}
          setSubmittedUsername={setSubmittedUsername}
        />
      )}
    </>
  );
}

export default UserSearch;