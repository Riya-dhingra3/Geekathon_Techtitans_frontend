import { techToFileTypes } from '@/constants/FileTypes';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Define the structure of the repo parameter object
interface RepoParam {
  name: string;
  languages_url: string;
  html_url: string;
}

const Analysis = () => {
  // Define the types for techToFileTypes and the state
  const techs = techToFileTypes;
  const location = useLocation();
  const repoParam = location?.state?.repo as RepoParam; // Assert the type of repoParam

  const [filesUsed, setFilesUsed] = useState<string[]>([]); // State to store file types as an array of strings

  useEffect(() => {
    async function fetchLanguages() {
      try {
        const res = await fetch(repoParam.languages_url);
        const data = await res.json();
        console.log(data);
        
        let filesBeingAdded: string[] = []; // Initialize the filesBeingAdded array

        // Loop through the language data and map to file types
        for (const key in data) {
          const techKey = key.toLowerCase();
          const fileTypes = techs[techKey] || [];
          console.log(fileTypes);
          filesBeingAdded = [...filesBeingAdded, ...fileTypes];
        }

        // Remove duplicates
        const uniqueArray = filesBeingAdded.reduce((acc: string[], item: string) => {
          if (!acc.includes(item)) {
            acc.push(item);
          }
          return acc;
        }, []);
        
        console.log('unique is', uniqueArray);
        setFilesUsed(uniqueArray);
      } catch (error) {
        console.error('Error fetching languages data:', error);
      }
    }

    fetchLanguages();
  }, [repoParam.languages_url, techs]); // Add repoParam.languages_url and techs to dependency array

  return (
    <div>
      <h1>{repoParam.name}</h1>
      
    </div>
  );
}

export default Analysis;
