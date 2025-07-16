// components/HomeLayout.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Package, Star, Plus, DollarSign, UserCircle } from 'lucide-react';


export const Header = () => {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <header className="bg-white shadow sticky top-0 z-50 p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">RentKart</h1>

      <div className="flex items-center gap-4">
        <input
          type="text"
          id="searchInput"
          placeholder="Search for items..."
          className="border px-3 py-1 rounded-md"
        />
        <button id="searchBtn" className="bg-yellow-400 text-white px-4 py-1 rounded">
          Search
        </button>
      </div>

      <nav className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/items">Items</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>

        {isLoggedIn ? (
          <Link to="/dashboard" aria-label="User Dashboard">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
              fill="currentColor" viewBox="0 0 24 24"
              style={{ verticalAlign: 'middle', color: '#ccc' }}>
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
            </svg>
          </Link>
        ) : (
          <Link to="/signup" id="auth-link">Signup/Login</Link>
        )}
      </nav>
    </header>
  );
};

export const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Rent What You Need, When You Need It!",
      desc: "Explore a wide range of items at unbeatable prices. Fast delivery.",
      btnText: "Shop Now",
      image: "https://img.freepik.com/free-vector/shopping-online-banner_33099-1721.jpg",
      link: "/items",
    },
    {
      title: "Furnish Your Home for Less",
      desc: "Affordable furniture on rent – beds, sofas, tables, and more!",
      btnText: "Explore Furniture",
      image: "https://images.pexels.com/photos/18907003/pexels-photo-18907003.jpeg?auto=compress&cs=tinysrgb&w=800",
      link: "/items",
    },
    {
      title: "Smart Appliances on Rent",
      desc: "Get ACs, refrigerators, and more – delivered to your door.",
      btnText: "View Appliances",
      image: "https://img.freepik.com/free-photo/modern-home-appliances-white-wall_93675-132309.jpg?w=740",
      link: "/items",
    },
    {
      title: "Trendy Fashion for Every Occasion",
      desc: "Rent stylish outfits without breaking the bank.",
      btnText: "Rent Fashion",
      image: "https://img.freepik.com/free-photo/white-clothes-hanger-realistic_1284-17249.jpg?w=740",
      link: "/items",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full overflow-hidden bg-yellow-300">
      <div className="flex transition-all duration-500 ease-in-out">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center justify-between px-10 py-10 md:h-[400px] w-full ${
              currentSlide === index ? "block" : "hidden"
            }`}
          >
            <div className="w-full md:w-1/2 space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900">{slide.title}</h2>
              <p className="text-gray-700">{slide.desc}</p>
              <a
                href={slide.link}
                className="inline-block mt-4 px-6 py-2 text-white font-semibold rounded-md bg-orange-500 hover:bg-orange-600 text-sm"
              >
                {slide.btnText}
              </a>
            </div>
            <img
              src={slide.image}
              alt="Slide"
              className="w-full md:w-1/2 h-auto object-cover"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-4 pb-4">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export const FeaturedItems = ({ items }) => (
  <section className="py-10 px-6">
    <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Featured Items</h2>
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {items.map(item => (
        <div key={item._id} className="bg-white rounded-xl shadow p-4 text-center">
          <img src={item.images[0]} alt={item.title} className="h-40 w-full object-cover rounded" />
          <h4 className="text-lg font-semibold mt-2">{item.title}</h4>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="mt-2 font-bold text-gray-800">₹{item.pricing.per_day}/day</div>
          <button className="mt-3 bg-yellow-400 text-white px-4 py-1 rounded">Add to Cart</button>
        </div>
      ))}
    </div>
  </section>
);

export const CategorySection = ({ categories }) => (
  <section className="py-10 px-6 max-w-6xl mx-auto grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {categories.map(category => (
      <Link to={`/category/${category.slug}`} key={category._id} className="block rounded shadow hover:shadow-lg transition">
        <img src={category.image} alt={category.title} className="w-full h-40 object-cover rounded-t" />
        <h3 className="text-center font-semibold p-3 bg-gray-100">{category.title}</h3>
      </Link>
    ))}
  </section>
);

export const HowItWorks = () => {
  const renterSteps = [
    {
      icon: Search,
      title: 'Search & Browse',
      description: 'Find the perfect item for your needs from thousands of listings',
      color: 'bg-blue-500'
    },
    {
      icon: MessageCircle,
      title: 'Connect & Book',
      description: 'Message the owner and book your rental dates',
      color: 'bg-green-500'
    },
    {
      icon: Package,
      title: 'Pick Up & Enjoy',
      description: 'Collect your item and enjoy using it for your project',
      color: 'bg-purple-500'
    },
    {
      icon: Star,
      title: 'Return & Review',
      description: 'Return the item and leave a review for other renters',
      color: 'bg-yellow-500'
    }
  ];

  const ownerSteps = [
    {
      icon: Plus,
      title: 'List Your Item',
      description: 'Create a listing with photos and details of your item',
      color: 'bg-orange-500'
    },
    {
      icon: MessageCircle,
      title: 'Get Requests',
      description: 'Receive rental requests from interested renters',
      color: 'bg-pink-500'
    },
    {
      icon: DollarSign,
      title: 'Earn Money',
      description: 'Hand over your item and start earning passive income',
      color: 'bg-indigo-500'
    },
    {
      icon: Star,
      title: 'Build Reputation',
      description: 'Get positive reviews and grow your rental business',
      color: 'bg-red-500'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Whether you're looking to rent or earn money from your items, we make it simple
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* For Renters */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Renters</h3>
              <p className="text-gray-600">Get access to anything you need, when you need it</p>
            </div>
            <div className="space-y-6">
              {renterSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${step.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* For Item Owners */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">For Item Owners</h3>
              <p className="text-gray-600">Turn your unused items into a source of income</p>
            </div>
            <div className="space-y-6">
              {ownerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`${step.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <step.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Footer = () => (
  <footer className="bg-gray-800 text-white text-center py-6 mt-10">
    <p>© 2025 RentKart. All rights reserved.</p>
  </footer>
);

