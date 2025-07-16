import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('/api/users/form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    alert('Signup successful!');
    window.location.href = '/home';
  } catch (error) {
    alert('Signup failed: ' + error.message);
  }
};


  return (
    <div className="min-h-screen bg-yellow-50 font-['Raleway'] relative overflow-hidden group">
      {/* Background shapes */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-1/2 top-0 left-0">
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-45 bg-yellow-400 opacity-60 transition-all group-hover:ml-[200px] group-hover:origin-[-200px_50%] delay-200 group-hover:delay-0"></div>
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-[135deg] bg-yellow-500 opacity-60 transition-all group-hover:ml-[200px] group-hover:origin-[-200px_50%] delay-200 group-hover:delay-0"></div>
        </div>
        <div className="absolute w-full h-1/2 bottom-0 left-0">
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-[-45deg] bg-yellow-300 opacity-60 transition-all group-hover:ml-[200px] group-hover:origin-[-200px_50%] delay-200 group-hover:delay-0"></div>
          <div className="absolute top-1/2 left-1/2 w-[200vmax] h-[200vmax] -mt-[100vmax] origin-[0_50%] rotate-[-135deg] bg-yellow-600 opacity-60 transition-all group-hover:ml-[200px] group-hover:origin-[-200px_50%] delay-200 group-hover:delay-0"></div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="absolute top-1/2 left-1/2 w-[400px] min-h-[500px] -ml-[200px] -mt-[250px] p-8 opacity-100 transition-all duration-500 bg-yellow-50 z-20 rounded-[10px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
        <h2 className="text-2xl font-bold text-center mb-5 text-gray-800">Sign Up to RentKart</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" required className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-500" />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-500" />

          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" required className="w-full p-3 pr-12 border rounded focus:ring-2 focus:ring-yellow-500" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" required className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-500" />
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Address" required className="w-full p-3 border rounded focus:ring-2 focus:ring-yellow-500" />

          <button type="submit" disabled={isLoading} className="w-full p-3 bg-yellow-400 font-bold rounded hover:bg-yellow-500 transition disabled:opacity-50">
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-6 text-center">
  <p className="text-sm text-gray-600">
    Already have an account?{' '}
    <a
      href="/"
      className="text-orange-600 hover:text-orange-700 font-bold transition-colors underline"
    >
      Login
    </a>
  </p>
</div>

      </div>
      
    </div>
  );
};

export default Signup;
