
//https://api.github.com/users/Mister-JP/repos
import Link from "next/link";

async function fetchRepos(){
    const response = await fetch('https://api.github.com/users/Mister-JP/repos', {
        next: {
            revalidate: 60,//every 60 it fetches a new data and not every time some request is made
        }
    });
    await new Promise((resolve)=>setTimeout(resolve, 1000));
    const repos = await response.json();
    return repos;
}

const ReposPage = async () => {
  const repos = await fetchRepos();
//   console.log(repos[0]);
// console.log("hello")

  return (
    <>
    <h2>Repositories</h2>
    <ul>
        {repos.map((repo)=>(
            <li key={repo.id}>
                <Link href={`/code/repos/${repo.name}`}>
                    <h3>{repo.name}</h3>
                    <p>{repo.url}</p>
                </Link>
            </li>
        ))}
    </ul>
    </>
  )
}

export default ReposPage