import Link from "next/link";

const Header = () => {
  return (
    <header>
        <h1>
            RabbitHole
        </h1>
        <div>
            <div>
                <Link href="/createSource">Go to Source</Link>
            </div>
        </div>
        <div>
            <div>
                <Link href="/about">About</Link>
            </div>
        </div>
        <div>
            <div>
            <Link href="/about/team">Team</Link>
            </div>
        </div>
        {/* <div>
            <div>
                <Link href="/nodes">nodes</Link>
            </div>
        </div> */}
        <div>
            <div>
                <Link href="/code/repos">repos</Link>
            </div>
        </div>
    </header>
  )
}

export default Header