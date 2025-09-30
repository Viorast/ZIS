import React from 'react'
import { assets } from '../assets/asset'
import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className='border-transparent flex items-center justify-between px-6 py-3 bg-white shadow-md '>
            <div className='hidden sm:flex items-center space-x-9'>
                <img src={assets.logo} alt="Logo" className='h-10' />

                <div className='flex space-x-6 text-sm md:text-base'>
                    <select name="" id="" className='text-purple-800 hover:text-purple-500 font-medium'>
                        <option value="">Zakat fitrah</option>
                        <option value="">Zakat mal</option>
                    </select>
                    <Link href="#" className="text-purple-800 hover:text-purple-500 font-medium">Sedekah</Link>
                    <Link href="#" className="text-purple-800 hover:text-purple-500 font-medium">Wakaf</Link>
                    <Link href="#" className="text-purple-800 hover:text-purple-500 font-medium">Kalkulator</Link>
                </div>
                {/* <ul className='flex space-x-8 text-pink-800 font-bold text-xl'>
                    <li>zakat</li>
                    <li>Sedekah</li>
                    <li>wakaf</li>
                    <li>Kalkulator</li>
                </ul> */}
            </div>
            <Link to="/Login">
                <button type="submit" className='bg-blue-500 rounded p-2 text-center cursor-pointer hover:bg-blue-800 text-white font-bold shadow-sm'>masuk</button>
            </Link>
        </nav>
    )
}

export default Navbar
