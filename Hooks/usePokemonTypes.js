import { useState, useEffect } from 'react';

export default function usePokemonTypes() {
  const [pokemonTypes, setPokemonTypes] = useState([]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        setPokemonTypes(data.results.map(type => type.name));
      } catch (error) {
        console.error('Error fetching Pokémon types:', error);
      }
    };
    fetchTypes();
  }, []);

  return pokemonTypes;
}