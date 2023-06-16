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
    displayContent = <h1>{error}</h1>;
  } else if (!data) {
    displayContent = <h1>Loading...</h1>;
  } else if (data.message) {
    displayContent = <h1>{data.message}</h1>;
  } else {
    displayContent = <h1>{data.link}</h1>;
  }

  return (
    <>
    <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
      {displayContent}
      {data && <Score type={'node'} id={id} score={data.score}/>}
    </div>
    <Summaries nodeID={id}/>
    </>
  );
};

export default SourcePage;
