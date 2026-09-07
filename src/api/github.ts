
export const fetchGithubUser = async (username:string) => {
    const res = await fetch(
      `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`
    );

    if (!res.ok) {
      if (res.status === 404) throw new Error('User not found');
      if (res.status === 403) throw new Error('API rate limit exceeded');
      throw new Error(`GitHub error: ${res.status}`);
    }

    const data = await res.json();
    // console.log(data);
    return data;
}