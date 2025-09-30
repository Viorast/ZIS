import React, { useState } from 'react'
import { assets } from '../assets/asset'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        nomorHp: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
        if (error) setError('');
        if (success) setSuccess('');
    };

    const validateForm = () => {
        const { email, fullName, nomorHp, password  } = formData;

        if (!email || !fullName || !nomorHp || !password) {
            setError('Semua field harus diisi');
            return false;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return false;
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Format email tidak valid');
            return false;
        }

        // Validasi nomor telepon (hanya angka)
        const phoneRegex = /^[0-9]+$/;
        if (!phoneRegex.test(nomorHp)) {
            setError('Nomor telepon hanya boleh berisi angka');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            // Sesuaikan dengan struktur DTO yang diharapkan backend
            const registerData = {
                email: formData.email,
                fullName: formData.fullName,
                nomorHp: formData.nomorHp,
                password: formData.password,
            };

            const response = await authService.userRegister(registerData);
            
            setSuccess('Registrasi berhasil! Silahkan login.');
            
            // Reset form
            setFormData({
                email: '',
                fullName: '',
                nomorHp: '',
                password: '',
            });

            // Redirect ke login setelah 2 detik
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (error) {
            console.error('Register error:', error);
            setError(error.message || 'Terjadi kesalahan saat registrasi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-purple-900 flex items-center justify-center'>
            <div className='bg-white rounded-2xl grid lg:grid-cols-2 md:grid-cols-1 mt-10 mb-4'>
                <div className='flex flex-col items-center justify-center text-center mx-3'>
                    <img src={assets.logo} alt="logo" className='h-45 mb-4' />
                    <h1 className='text-4xl font-bold text-purple-900'>Selamat Datang Pengguna Baru</h1>
                    <div className='text-md mb-2 text-justify w-9/12'>
                        <p className=''>Silahkan buat akun terlebih dahulu sebelum lanjut, pastikan mengisi form dengan tepat</p>
                    </div>
                </div>
                <div className='bg-purple-950 text-white p-10 lg:rounded-r-2xl md:rounded-none'>
                    <h1 className='text-xl font-bold text-white text-center'>Registrasi Akun</h1>
                    
                    {error && (
                        <div className='bg-red-500 text-white p-3 rounded-md mt-4 text-sm'>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className='bg-green-500 text-white p-3 rounded-md mt-4 text-sm'>
                            {success}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className='mt-4'>
                        <div className='mb-4'>
                            <label htmlFor="email" className='block mb-1 ml-4 text-md'>Email</label>
                            <input 
                                type="email" 
                                name="email"
                                placeholder='Email' 
                                value={formData.email}
                                onChange={handleInputChange}
                                className='bg-white text-black px-4 py-2 outline-none w-full rounded-full'
                                required
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="fullName" className='block mb-1 ml-4 text-md'>Nama Lengkap</label>
                            <input 
                                type="text" 
                                name="fullName"
                                placeholder='Nama Lengkap' 
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className='bg-white text-black px-4 py-2 outline-none w-full rounded-full'
                                required
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="nomorHp" className='block mb-1 ml-4 text-md'>Nomor Telepon</label>
                            <input 
                                type="tel" 
                                name="nomorHp"
                                placeholder='Nomor Telepon' 
                                value={formData.nomorHp}
                                onChange={handleInputChange}
                                className='bg-white text-black px-4 py-2 outline-none w-full rounded-full'
                                required
                            />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password" className='block mb-1 ml-4 text-md'>Password</label>
                            <input 
                                type="password" 
                                name="password"
                                placeholder='Password (min. 6 karakter)' 
                                value={formData.password}
                                onChange={handleInputChange}
                                className='bg-white text-black px-4 py-2 outline-none w-full rounded-full'
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-2 rounded-full font-semibold cursor-pointer mt-4 ${
                                loading 
                                    ? 'bg-gray-500 cursor-not-allowed' 
                                    : 'bg-blue-700 hover:bg-blue-800'
                            }`}
                        >
                            {loading ? 'Loading...' : 'Daftar'}
                        </button>
                    </form>
                    
                    <p className='text-sm text-center mt-4'>
                        Sudah punya akun? 
                        <Link to="/login" className='text-sm text-center text-blue-500'> Login</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register