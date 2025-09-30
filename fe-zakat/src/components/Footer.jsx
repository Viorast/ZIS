import React from 'react'
import { MdPhoneIphone, MdEmail } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";

function Footer() {
    return (
        <div className='grid grid-cols-3 justify-items-center gap-3 bg-purple-800'>
            <div className='text-white'>
                <h1 className='font-semibold text-3xl mb-5'>Tentang website</h1>
                <p>pembayaran</p>
                <p>Alamat Masjid</p>
                <p>Kalkulator</p>
            </div>
            <div className='text-white '>
                <h1 className='text-3xl font-semibold mb-5'>Tautan</h1>
                <p>Zakat</p>
                <p>Sedekah</p>
                <p>Wakaf</p>
            </div>
            <div className='text-white'>
                <h1 className='text-3xl font-semibold mb-5'>Hubungi Kami</h1>
                <div className='flex justify-between mt-5'>
                    <MdPhoneIphone className="text-5xl cursor-pointer hover:text-purple-200" />
                    <FaWhatsapp className="text-5xl cursor-pointer hover:text-purple-200" />
                    <MdEmail className="text-5xl cursor-pointer hover:text-purple-200" />
                </div>
            </div>
        </div>
    )
}

export default Footer
