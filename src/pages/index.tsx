import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className="bg-slate-900 min-h-screen">
      <h1 className="gray-200 font-bold">Olá mundo</h1>
    </div>
  )
}

export default Home
