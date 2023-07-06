'use client';
import Link from "next/link";
import SearchBar from "./SearchBar";
import api from "../api/LocalApi";


const Header = () => {
  const handleSearchClick = async (movie, router) => {
    try {
        const response = await api.get(`/getSourceByLink?offset=1&limit=1&link=${movie.original_title}&imdbid=${movie.id}`);
        if (response.data && response.data.Source) {
            router.push(`/${response.data.Source}`);
        }
      } catch (error) {
         console.error("API request failed: ", error);
      }
    };
  return (
    <div className="m-5 ml-5 mr-5 mx-auto flex space-between items-center">
        <h1 className="font-plusJakarta text-3xl font-semibold">
          <Link href="/" className="hover:text-gray-300 transition duration-200">RabbitHole</Link>
        </h1>
        <SearchBar handleSearchClick={handleSearchClick}/>

        <nav className="flex space-x-6">
          <Link href="/createSource" className="py-2 px-4 rounded hover:bg-white hover:text-indigo-600 transition duration-200">Go to Source</Link>
          <Link href="/about" className="py-2 px-4 rounded hover:bg-white hover:text-indigo-600 transition duration-200">About</Link>
          <Link href="/login" className="py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200">Login</Link>
          <Link href="/register" className="py-2 px-4 rounded border border-black rounded-full hover:bg-black hover:text-white font-normal transition duration-200">Register</Link>

        </nav>
      </div>
  );
}

export default Header;
