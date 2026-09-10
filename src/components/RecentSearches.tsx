
import { FaClock } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { fetchGithubUser } from "../api/Github";

export const RecentSearches = ({recentUsers, setUsername, setSubmittedUsername}) => {

    const queryClient = useQueryClient();

    return <>
                <div className="recent-searches">
            <div className="recent-header">
            <FaClock />
            <h3>Recent Searches</h3>
            </div>
            <ul>
            {recentUsers.map((user) => (
                <li key={user}>
                <button
                    onClick={() => {
                    setUsername(user);
                    setSubmittedUsername(user);
                    }}
                    onMouseEnter={() => 
                        {queryClient.prefetchQuery({
                            queryKey: ['users', user],
                            queryFn: () => fetchGithubUser(user)
                        })
                    }
                    }
                >
                    {user}
                </button>
                </li>
            ))}
            </ul>
        </div>
    </>
}