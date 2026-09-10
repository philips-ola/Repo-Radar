import { useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGithubUser } from "../api/Github";
import { UserCard } from "./USerCard";
import { RecentSearches } from "./RecentSearches";
import { useEffect } from "react";

function UserSearch(){
    const [username, setUsername] = useState('');
    const [submittedUsername, setSubmittedUsername] = useState('');

    const [recentUsers, setRecentUsers] = useState<string[]>(()=>{
        const stored = localStorage.getItem('recentUsers');
        return stored ? JSON.parse(stored) : [];
    });
    
//  Using Tanstack Query


const { data, isLoading, error } = useQuery({
  queryKey: ['users', submittedUsername],
  queryFn: () => fetchGithubUser(submittedUsername),
  enabled:!!submittedUsername,
})

// Add to recent ONLY when fetch is successful
useEffect(() => {
  if (data &&!error && submittedUsername) {
    setRecentUsers((prev) => {
      const updated = [submittedUsername,...prev.filter((u) => u!== submittedUsername)];
      return updated.slice(0, 5);
    });
  }
}, [data, error, submittedUsername]);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const trimmed = username.trim();
  if (!trimmed) return;
  setSubmittedUsername(trimmed);
  // DON'T add to recent here
};

useEffect(()=>{
    localStorage.setItem('recentUsers', JSON.stringify(recentUsers)), [recentUsers];
})

    return(
        <>
        <form onSubmit={handleSubmit} className="form" style={{ marginTop: '2rem' }}>
            <input type="text" 
            placeholder="Enter Github Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />

            <button type="submit">Search</button>
        </form>
        {isLoading && <p className="status">Loading...</p>}
        {error && <p className="status error">{error.message}</p>}
        {data && <UserCard user={data} />}
        
        {/* Recent Searches */}
        {recentUsers.length > 0 && (
            <RecentSearches recentUsers={recentUsers} setUsername={setUsername} setSubmittedUsername={setSubmittedUsername} />
        )}
        </>
    )

}

export default UserSearch;