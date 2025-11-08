import React, { useEffect, useState } from 'react';
import {
  Header,
  HeroCarousel,
  FeaturedItems,
  CategorySection,
  HowItWorks,
  Footer
} from '../components/HomeLayout.jsx';
// import Header from '../components/Header';


const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState('');

 useEffect(() => {
  let url = '';

  if (search.trim() !== '') {
    // 🔍 Search API
    url = `/api/items/search?q=${encodeURIComponent(search)}`;
  } else if (location) {
    // 📍 Location-based featured items
    url = `/api/items/featured?location=${encodeURIComponent(location)}`;
  } else {
    // ⭐ Default featured items
    url = '/api/items/featured';
  }

  fetch(url)
    .then(res => res.json())
    .then(data => setFeaturedItems(Array.isArray(data) ? data : []))
    .catch(err => console.error("Failed to fetch items", err));

  // Fetch categories (once, not dependent on search)
  fetch('/api/categories')
    .then(res => res.json())
    .then(data => setCategories(Array.isArray(data) ? data : []))
    .catch(err => console.error("Failed to fetch categories", err));

}, [location, search]); //  now reacts to both


  return (
    <>
      <Header location={location} setLocation={setLocation} search={search}
                setSearch={setSearch} />
      <HeroCarousel />
      <FeaturedItems items={featuredItems} location={location} />
      <CategorySection categories={categories} />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;




