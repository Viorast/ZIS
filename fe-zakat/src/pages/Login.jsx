import React, { useState } from 'react'
import { assets } from '../assets/asset';
import { FaUser, FaLock } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService';

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validasi input
            if (!formData.email || !formData.password) {
                setError('Email dan password harus diisi');
                return;
            }

            // Call API login
            const response = await authService.userLogin({
                email: formData.email,
                password: formData.password
            });

            // Simpan token dan data user ke localStorage
            localStorage.setItem('userToken', response.access_token);
            localStorage.setItem('userData', JSON.stringify(response.user));

            // Redirect ke homepage
            navigate('/');
            
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || 'Terjadi kesalahan saat login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-purple-900 flex items-center justify-center'>
            <div className='bg-white rounded-2xl grid lg:grid-cols-2 md:grid-cols-1 mt-10'>
                <div className='flex flex-col items-center justify-center text-center mx-3'>
                    <img src={assets.logo} alt="logo" className='h-45 mb-4' />
                    <h1 className='text-4xl font-bold text-purple-900'>Selamat Datang</h1>
                    <p className='text-sm text-center mb-2'>silahkan masukkan email dan password anda</p>
                </div>
                <div className='bg-purple-950 text-white p-10 lg:rounded-r-2xl md:rounded-none'>
                    <h1 className='text-xl font-bold text-white text-center'>SIGN IN</h1>
                    
                    {error && (
                        <div className='bg-red-500 text-white p-3 rounded-md mt-4 text-sm'>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className='mt-4'>
                        <div className='mb-4'>
                            <label htmlFor="email" className='block mb-1 text-sm'>Email</label>
                            <div className='flex items-center bg-white text-black rounded-full px-4 py-2'>
                                <FaUser className="mr-2 text-purple-500" />
                                <input 
                                    type="email" 
                                    name="email"
                                    placeholder='Masukkan Email...' 
                                    value={formData.email}
                                    onChange={handleInputChange} 
                                    className='bg-transparent outline-none w-full'
                                    required
                                />
                            </div>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor="password" className='block mb-1 text-sm'>Password</label>
                            <div className='flex items-center bg-white text-black rounded-full px-4 py-2'>
                                <FaLock className="mr-2 text-purple-500" />
                                <input 
                                    type="password" 
                                    name="password"
                                    placeholder='Masukkan Password...' 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    className='bg-transparent outline-none w-full'
                                    required
                                />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full py-2 rounded-full font-semibold cursor-pointer ${
                                loading 
                                    ? 'bg-gray-500 cursor-not-allowed' 
                                    : 'bg-blue-700 hover:bg-blue-800'
                            }`}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>
                    <Link to="/forgot-password" className='text-sm block pl-2 pt-2 text-blue-500'>
                        <p>lupa password?</p>
                    </Link>
                    <p className='text-sm text-center mt-2'>
                        Belum punya akun? 
                        <Link to="/register" className='text-sm text-center text-blue-500'> Daftar</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
