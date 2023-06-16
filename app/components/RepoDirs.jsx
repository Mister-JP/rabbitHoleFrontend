import Link from "next/link";
async function fetchRepoContents(name){
    await new Promise((resolve)=>setTimeout(resolve, 3000));//delay to see the different components being loaded
    const response = await fetch(`https://api.github.com/repos/Mister-JP/${name}/contents`, {
        next: {
            revalidate: 60,//every 60 it fetches a new data and not every time some request is made
        }
    })
    const contents = await response.json();
    return contents;
}

const RepoDirs = async ({name}) => {
  const contents = await fetchRepoContents(name);
  const dirs = await contents.filter((content)=>content.type==='dir');
//   console.log(dirs)
  
  return (
    <div>
      <h3>Directories</h3>
      <ul>
        {dirs.map((dir) => {
          return (
            <li key={dir.path}>
              <Link href={`/code/repos/${name}/${dir.path}`}>{dir.path}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default RepoDirs