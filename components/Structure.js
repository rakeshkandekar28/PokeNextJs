import React from 'react'
import Head from 'next/head'

export default function Structure({title, children}) {
  return (
    <div className="text-dark-gray">
        <Head>
            <title>{title}</title>
            <link rel="icon" href="/pokeball.ico" />
            <meta name="description" content="Made with NextJS with Tailwind and PokeAPI."/>
            <meta property="og:image" content=""/>
        </Head>
        <main className="container mx-auto p-8 pb-2 min-h-screen bg-gray-300 bg-opacity-80">
            {children}
        </main>
    </div>
  )
}
