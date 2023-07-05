'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Summaries from '@/app/components/Summaries';
import Score from '@/app/components/Score';

const SourcePage = ({ params: { id } }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/getNode', {
          params: { nodeID: id },
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setError('Error fetching source data');
      }
    }

    fetchData();
  }, [id]);

  let displayContent;
  if (error) {
    displayContent = error;
  } else if (!data) {
    displayContent = "Loading...";
  } else if (data.message) {
    displayContent = data.message;
  } else {
    displayContent = data.link;
  }

  return (
    <>
    <div className="border-blue-200 border-1 m-10 p-10 mb-10 bg-gradient-to-r from-blue-200 to-blue-300 text-Black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-4"> {displayContent} </h1>
      {data && <Score type={'node'} id={id} className="mt-5" score={data.score}/>}
</div>


    <Summaries nodeID={id}/>
    </>
  );
};

export default SourcePage;
