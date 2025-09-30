import React from 'react'
import kegiatan1 from '../assets/carousel2.jpg'

function KegiatanKami() {
  return (
    <div className='m-16'>
        <h1 className='text-[5rem] font-semibold text-pink-400'>Kegiatan <span className='text-yellow-400'>Kami</span></h1>
        <p className='mt-3'>berikut ini layanan fitur yang telah kami sediakan:</p>

        <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-35 items-center mt-10'>
          <div className='bg-gray-200  mx-auto pt-10 rounded-lg shadow-2xl w-[25rem]'>
            <img src={kegiatan1} alt="" className='w-[12rem] h-48 mx-auto rounded-lg'/>
            <p className='w-48 text-xl py-4 mx-auto'>Pembagian makanan kepada masyarakat sekitar</p>
          </div>
          <div className='bg-gray-200 gap-3 mx-auto pt-10 rounded-lg shadow-2xl w-[25rem]'>
            <img src={kegiatan1} alt="" className='w-[12rem] h-48 rounded-lg mx-auto'/>
            <p className='w-48 text-xl py-4 mx-auto'>Pembagian makanan kepada masyarakat sekitar</p>
          </div>
          <div className='bg-gray-200 gap-3 mx-auto pt-10 rounded-lg shadow-2xl w-[25rem]'>
            <img src={kegiatan1} alt="" className='w-[12rem] h-48 rounded-lg mx-auto'/>
            <p className='w-48 text-xl py-4 text-justify mx-auto'>Pembagian makanan kepada masyarakat sekitar</p>
          </div>
        </div>
    </div>
  )
}

export default KegiatanKami
