import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user)); // ✅ Save user info here
  alert('Login successful!');
  navigate('/home');
}
 else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 font-['Raleway'] relative overflow-hidden group">
      <div className="absolute inset-0">
        <div className="absolute w-full h-1/2 top-0 left-0">
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-45 bg-yellow-400 opacity-60" />
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-[135deg] bg-yellow-500 opacity-60" />
        </div>
        <div className="absolute w-full h-1/2 bottom-0 left-0">
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-[-45deg] bg-yellow-300 opacity-60" />
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-[-135deg] bg-yellow-600 opacity-60" />
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -ml-[200px] -mt-[200px] max-w-[90vw] max-h-[90vh] flex flex-col justify-center items-center p-8 bg-yellow-50 z-20 rounded-[10px] shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
          Log In to RentKart
        </h2>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full p-4 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full p-4 pr-12 text-base border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-3 bg-yellow-400 text-gray-800 font-bold rounded hover:bg-yellow-500 transition"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-gray-600 hover:text-gray-800">Forgot password?</a>
          <p className="text-sm text-gray-600 mt-2">
            Don't have an account?{' '}
            <a href="/signup" className="text-yellow-700 hover:text-yellow-800 font-semibold">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

