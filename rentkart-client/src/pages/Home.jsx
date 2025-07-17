import React, { useEffect, useState } from 'react';
import {
  Header,
  HeroCarousel,
  FeaturedItems,
  CategorySection,
  HowItWorks,
  Footer
} from '../components/HomeLayout';

const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/items/featured')
      .then(res => res.json())
      .then(data => setFeaturedItems(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch featured items", err));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  return (
    <>
      <Header />
      <HeroCarousel />
      <FeaturedItems items={featuredItems} />
      <CategorySection categories={categories} />
      <HowItWorks />
      <Footer />
    </>
  );
};

export default Home;
