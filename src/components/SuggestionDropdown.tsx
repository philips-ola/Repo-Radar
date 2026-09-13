import type { GitHubUser } from "../types"

type suggestionDropdownProps ={
suggestions:GitHubUser,
show: boolean,
onSelect: (username:string) => void
}
export const SuggestionDropdown = ({suggestions, show, onSelect}:suggestionDropdownProps)=>{
    
return(
    <ul className="suggestions">
        {suggestions.slice(0, 5).map((user:GitHubUser) => (
            <li key={user.login} onClick={ () => onSelect(user.login)
            
            }>
            <img src={user.avatar_url} alt={user.login} className="avatar-xs"/>
            {user.login}
            </li>
        ))}
        </ul>
)
}