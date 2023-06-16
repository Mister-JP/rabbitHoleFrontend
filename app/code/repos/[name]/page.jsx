import Repo from "@/app/components/Repo";
import Link from "next/link";
import RepoDirs from "@/app/components/RepoDirs";
import { Suspense } from "react";

//params is ti fetch the input in the form of the route which in our case is the repo name
const RepoPage = ({params: {name}}) => {
  return (
    <div>
        {/* if we are just keeping {params} in the const RepoPage = ({params}) then the following works!*/}
        {/* <h2>{params.name}</h2> */}
        <Link href="/code/repos">Back to Repo</Link>
        <Suspense fallback={<div>Loading repo...</div>}>
            <Repo name={name}/>
        </Suspense>
        <Suspense fallback={<div>Loading repoDir...</div>}>
        <RepoDirs name={name}/>
        </Suspense>
    </div>
  )
}

export default RepoPage