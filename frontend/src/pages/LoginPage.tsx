// src/pages/Login.jsx
import React, { useState } from 'react';
import { FaUserAlt, FaLock, FaSignInAlt } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
 const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password,
      });

      localStorage.setItem('token', res.data.token);
      // Redirige según el rol si lo necesitas
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/Cree.jpg')" }}
    >
      <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-3xl shadow-lg p-10 max-w-md w-full">
        <h1 className="text-white text-3xl font-bold mb-2">¡BIENVENIDO!</h1>
        <p className="text-white text-sm mb-6">
          Promovamos la integración social a las personas discapacitadas...
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FaUserAlt className="absolute top-3 left-3 text-cyan-500" />
            <input
              type="text"
              placeholder="usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-indigo-500" />
            <input
              type="password"
              placeholder="contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <div className="flex justify-end items-center gap-2">
            <FaSignInAlt className="text-green-800 text-xl" />
            <button
              type="submit"
              className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full font-semibold transition"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
