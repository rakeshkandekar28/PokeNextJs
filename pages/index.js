import { useState, useEffect } from 'react';
import Image from "next/image"
import Link from "next/link"
import Structure from "../components/Structure"
import useDebounce from '../hooks/useDebounce';
import usePokemonTypes from "../hooks/usePokemonTypes";

export default function Home({ pokemonList }) {
  // const [pokemonList, setPokemonList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredPokemon, setFilteredPokemon] = useState(pokemonList);
  // const [pokemonTypes, setPokemonTypes] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce the search term with a 300ms delay
  const pokemonTypes = usePokemonTypes();
  console.log("pokemonList", pokemonList)


  useEffect(() => {
    filterPokemon(debouncedSearchTerm, selectedType);
  }, [debouncedSearchTerm, selectedType]); // Run filter when debounced search term or selected type changes

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    filterPokemon(searchTerm, e.target.value);
  };

  const filterPokemon = (search, type) => {
    const filtered = pokemonList?.filter(pokemon => {
      const matchesSearch = pokemon?.name?.toLowerCase().includes(search.toLowerCase());
      const matchesType = type ? pokemon?.types?.includes(type) : true;
      return matchesSearch && matchesType;
    });
    setFilteredPokemon(filtered);
  };

  return (
    <Structure title="NextJS Poke">
      
      
      {/* Form for filtering */}
      <form className="mb-4 flex justify-center">
        <select value={selectedType} onChange={handleTypeChange} className="border p-2 mr-2">
          <option value="">All Types</option>
          {pokemonTypes.map(type => (
            <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
          ))}
        </select>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Pokémon"
          className="border p-2"
        />
      </form>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {filteredPokemon.map((pokemon, index) => (
        <li key={index} className="flex flex-col items-center border  my-2 bg-gray-200 rounded-md hover:scale-105 hover:border-red hover:bg-gray-50 transition-all duration-300">
          <Link href={`/pokemon?id=${pokemon.id}`}>
            <a className="w-full">
              <div className="flex justify-center items-center bg-white w-full pb-full relative">

                <Image src={pokemon.image} alt={pokemon.name} unoptimized width="100%" height="150"/>
              </div>
              <div className="mt-2 p-4 text-left text-lg font-medium">{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</div>
              <div className="mt-2 p-4 text-left font-medium">Click to More Details...</div>
            </a>
          </Link>
        </li>
      ))}
    </ul>

      
    </Structure>
  );
}


function getIdFromUrl(url) {
  // Split the URL by '/' and filter out any empty strings
  const parts = url.split('/').filter(part => part !== '');
  // Get the last part, which should be the ID
  const id = parts[parts.length - 1];
  return id;
}

export async function getStaticProps(context) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50")
    
    const {results} = await response.json()

    const pokemonList = await Promise.all(results.map(async (result, index) => {
      console.log("result", result);
      const id = getIdFromUrl(result.url);
      const paddedIndex = ("00" + (index + 1)).slice(-3);

      const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIndex}.png`;

      // Fetch detailed Pokémon data to get types
      const pokemonDataResponse = await fetch(result.url);
      const pokemonData = await pokemonDataResponse.json();
      const types = pokemonData?.types?.map(typeInfo => typeInfo.type.name) || [];

      return {
        ...result,
        id,
        image,
        types, 
      };
    }));


    return {
      props: {pokemonList}
    }
  } catch(error) {
    console.log(error)
  }

  return {
    notFound: true
  }
}
