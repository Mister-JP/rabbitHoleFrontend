import React from 'react'
import Link from 'next/link';


const SourceCard = ({id, link, score, timestamp}) => {
  return (
    <>
    <Link href={`/source/${id}`} passHref>
    <div style={{ border: "1px solid black", padding: "30px", margin: "10px" }}>
        <h1>{link}</h1>
        <p>{score}</p>
        <p>{timestamp}</p>
    </div>
    </Link>
    </>
  )
}

export default SourceCard