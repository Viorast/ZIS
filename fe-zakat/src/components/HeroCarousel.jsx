import React, { useState } from 'react'
import image1 from '../assets/carousel2.jpg'
import image2 from '../assets/zakat.jpg'
function HeroCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = [image1, image2];

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };
    return (
        <div className='relative w-full  mx-auto overflow-hidden'>
            <div className='flex transition-transform duration-500 ease-in-out' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {images.map((image, index) => (
                    <img key={index} src={images[currentIndex]} alt="carousel" className='w-full flex-shrink-0 h-screen object-cover' />
                ))}

            </div>
            <div className='absolute inset-0 flex flex-col justify-center z-10 px-6 ml-16  '>
                <h1 className='text-[5rem] font-semibold'>
                    <span className='text-pink-400 mr-4'>DKM</span>
                    <span className='text-yellow-400'>Al-Ikhlas</span>
                </h1>
                <p className='text-[2rem] mt-10 font-thin text-white'>Komplek De Green Villa Mutiara Residence Desa Cipagalo</p>
                <p className='text-[2rem] font-thin text-white'>Kecamatan Bojongsoang Kabupaten Bandung 40287 Jawa Barat</p>
                <p className='text-[2rem] font-thin text-white'>081-5617-0920</p>
                <p className='text-[2rem] font-thin text-white'>alikhlas.degreen@gmail.com</p>
            </div>

            <div className='hidden absolute inset-0 md:flex items-center justify-between z-20 px-6 '>
                <button onClick={prevSlide} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-transparent text-white px-3 py-2 rounded-full cursor-pointer'>prev</button>
                <button onClick={nextSlide} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-transparent text-white px-3 py-2 rounded-full cursor-pointer'>next</button>
            </div>

        </div>
    )
}

export default HeroCarousel
