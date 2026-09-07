import UserSearch from "./components/UserSearch";
import { FaGithubAlt } from "react-icons/fa";

function App() {
return <>
<div className="container">
        <FaGithubAlt size={50} />
        <h2> Repo Radar</h2>
        <UserSearch />
    </div>
</>
}
export default App;