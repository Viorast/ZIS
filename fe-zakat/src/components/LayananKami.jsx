import React from 'react'
import { FaHandHoldingHeart, FaHandHoldingUsd } from "react-icons/fa";
import { GiReceiveMoney } from "react-icons/gi";

function LayananKami() {
    return (
        <div className='mx-10'>
            <h1 className='text-[5rem] font-semibold mt-10 text-pink-400'>Layanan <span className=' text-yellow-400'>Kami</span></h1>
            <p className='mb-6'>berikut ini layanan fitur yang  telah kami sediakan:</p>
            <div className='grid md:grid-cols-3 grid-cols-1 gap-4 mt-2 justify-items-end-safe'>
                <div className='w-full'>
                    <div className='flex justify-center'>
                        <FaHandHoldingHeart className="text-pink-400 text-4xl mb-2 mr-2" />
                        <h1 className='text-center text-yellow-400 text-4xl font-semibold mb-3'>Zakat</h1>
                    </div>
                    <p className='px-4 text-justify text-xl'>Ayo tunaikan zakat maal dan zakat fitrah anda melalui layanan yang telah kami sediakan.</p>
                </div>
                <div className='w-full'>
                    <div className='flex justify-center'>
                        <FaHandHoldingUsd className="text-pink-400 text-4xl mb-2 mr-2" />
                    <h1 className='text-center text-yellow-400 font-semibold text-4xl mb-3'>Sedekah</h1>
                    </div>
                    
                    <p className='px-4 text-justify text-xl'>Sedekahkan sebagian harta benda anda bagi mereka yang kurang mampu atau yang membutuhkan.</p>
                </div>
                <div className='w-full'>
                    <div className='flex justify-center'>
                        <GiReceiveMoney className="text-pink-400 text-4xl mb-2 mr-2" />
                    <h1 className='text-center text-yellow-400 font-semibold text-4xl mb-3'>Wakaf</h1>
                    </div>
                    
                    <p className='px-4 text-justify text-xl'>Sedekahkan sebagian harta benda anda bagi kepentingan umat banyak.</p>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10 text-white'>
                <button className='bg-purple-800 px-8 py-2 w-full rounded-sm cursor-pointer hover:bg-purple-900'>Mulai Zakat</button>
                <button className='bg-purple-800 px-8 py-2 w-full rounded-sm cursor-pointer hover:bg-purple-900'>Mulai Sedekah</button>
                <button className='bg-purple-800 px-8 py-2 w-full rounded-sm cursor-pointer hover:bg-purple-900'>Mulai Wakaf</button>
            </div>
        </div>
    )
}

export default LayananKami
