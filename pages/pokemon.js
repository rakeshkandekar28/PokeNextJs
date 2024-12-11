import React from 'react'
import Link from 'next/link'
import Structure from '../components/Structure'


export default function Pokemon({pokemon}) {

    return (
        <Structure title={pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}>
        <p className="flex items-center p-2 text-center">
            <div className="group mx-auto flex items-center bottom-0">
                <Link href="/">
                    <a className="text-1xl font-medium border-b-2 border-transparent group-hover:border-b-red group-hover:text-red transition-all duration-300">Home</a>
                </Link> /
                <p className="text-1xl font-medium border-b-2 border-transparent transition-all duration-300"> {pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</p>
            </div>
        </p>
        <div className="max-w-md mx-auto bg-white shadow-md overflow-hidden md:max-w-2xl">
    <div>
        <div className="flex justify-center align-center bg-emerald-300 md:flex-shrink-0 md:p-8">
            <img src={pokemon.image} alt={pokemon.name} 
            
            width="auto%" height="300px" 
            />
        </div>
        <div className="md:p-8 bg-orange-300">
            <p className="px-4">
                <span className="font-medium mr-2">Name: </span>
                <span>{pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</span>
            </p>
            <p className="px-4">
                <span className="font-medium mr-2">Types:</span>
                <span className="">
                    {pokemon.types.map((type, index) => (
                        <span key={index}>{type.type.name[0].toUpperCase() + type.type.name.slice(1)}{pokemon.types.length === index+1 ? '' : ', '}</span>
                    ))}
                </span>
            </p>
            <p className="px-4">
                <span className="font-medium mr-2">Stats:</span>
                <span className="">
                    {pokemon.stats.map((data, index) => (
                        <span key={index}>{data.stat.name[0].toUpperCase() + data.stat.name.slice(1)}{pokemon.stats.length === index+1 ? '' : ', '}</span>
                    ))}
                </span>
            </p>
            <p className="px-4">
                <span className="font-medium mr-2">Abilities:</span>
                <span className="">
                {pokemon.abilities.map(({ ability }, index) => (
                    <span key={ability.slot} className="text-center">{ability.name[0].toUpperCase() + ability.name.slice(1)}{pokemon.abilities.length === index+1 ? '' : ', '}</span>
                ))}
                </span>
            </p>
            <p className="px-4">
                <span className="font-medium mr-2">Some Moves:</span>
                <span className="">
                    {pokemon.moves.map((data, index) => (
                        <span key={index}>{data.move.name[0].toUpperCase() + data.move.name.slice(1)}{pokemon.moves.length === index+1 ? '' : ', '}</span>
                    ))}
                </span>
            </p>
        </div>
    </div>
</div>
       
    </Structure>
    )
}

export async function getServerSideProps({query}) {
    const id = query.id

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const pokemon = await response.json()
        const paddedIndex = ("00" + id).slice(-3)
        const image = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedIndex}.png`

        pokemon.image = image

        return {
            props: {pokemon}
        }
    } catch(error) {
        console.log(error)
    }

    return {
        notFound: true
    }
}
