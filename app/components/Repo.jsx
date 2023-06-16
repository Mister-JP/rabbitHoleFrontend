async function fetchRepo(name) {
    const response =await fetch(`https://api.github.com/repos/Mister-JP/${name}`, {
      next: {
          revalidate: 60,//every 60 it fetches a new data and not every time some request is made
      }
  })
    const repo = await response.json();
    return repo;
}
const Repo = async ({name}) => {
  const repo = await fetchRepo(name);
//   console.log(repo);
  return (
    <div>
        <h2>{repo.name}</h2>
        <p>{repo.description}</p>
    </div>
  )
}

export default Repo