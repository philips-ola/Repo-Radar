import { useState} from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGithubUser } from "../api/Github";
import { UserCard } from "./USerCard";

function UserSearch(){
    const [username, setUsername] = useState('');
    const [submittedUsername, setSubmittedUsername] = useState('');
    
//  Using Tanstack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['users', submittedUsername],

//   Called fetchGithubUSer fron github.ts component and passed and arguement to it
  queryFn: () => fetchGithubUser(submittedUsername),
  enabled: !!submittedUsername, //this prevents fetch on empty string
})
  
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(!username.trim()) return;
        setSubmittedUsername(username.trim())
    };

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
        </>
    )

}

export default UserSearch;