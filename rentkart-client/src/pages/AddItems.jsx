import React, { useState } from 'react';
import {
  Upload,
  MapPin,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Camera,
  Check,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddItem = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    location: '',
    availabilityStart: '',
    availabilityEnd: '',
    pricingPerDay: '',
    pricingPerWeek: '',
    pricingPerMonth: '',
    deposit: '',
    phone: '',
    email: ''
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Electronics', 'Tools & Equipment', 'Furniture', 'Vehicles',
    'Sports & Recreation', 'Photography', 'Party & Events',
    'Home & Garden', 'Fashion & Accessories', 'Books & Education'
  ];

  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'YOUR_CLOUDINARY_UPLOAD_PRESET');
    data.append('cloud_name', 'YOUR_CLOUD_NAME');

    const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
      method: 'POST',
      body: data
    });
    const json = await res.json();
    return json.secure_url;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) return alert('Maximum 5 images allowed');
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const uploadedImageUrls = await Promise.all(
        images.map((img) => uploadToCloudinary(img))
      );

      const payload = {
        ...formData,
        images: uploadedImageUrls,
        pricing: {
          per_day: Number(formData.pricingPerDay),
          per_week: Number(formData.pricingPerWeek),
          per_month: Number(formData.pricingPerMonth)
        },
        availability: {
          startDate: formData.availabilityStart,
          endDate: formData.availabilityEnd
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email
        }
      };

      const token = localStorage.getItem('token');
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to add item');
      setSuccess(true);
      setImages([]);
      setFormData({
        title: '', description: '', category: '', condition: '', location: '',
        availabilityStart: '', availabilityEnd: '',
        pricingPerDay: '', pricingPerWeek: '', pricingPerMonth: '',
        deposit: '', phone: '', email: ''
      });

      setTimeout(() => navigate('/my-listings'), 2000);
    } catch (err) {
      console.error(err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Rental Item</h1>

      {error && <div className="text-red-600 mb-4 flex items-center"><AlertCircle className="w-4 h-4 mr-2" /> {error}</div>}
      {success && <div className="text-green-600 mb-4 flex items-center"><Check className="w-4 h-4 mr-2" /> Item added successfully</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full border px-4 py-2 rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="w-full border px-4 py-2 rounded" />
        <select name="category" value={formData.category} onChange={handleChange} className="w-full border px-4 py-2 rounded">
          <option value="">Select Category</option>
          {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select name="condition" value={formData.condition} onChange={handleChange} className="w-full border px-4 py-2 rounded">
          <option value="">Select Condition</option>
          {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" className="w-full border px-4 py-2 rounded" />

        <div className="grid grid-cols-3 gap-4">
          <input name="pricingPerDay" value={formData.pricingPerDay} onChange={handleChange} placeholder="₹/Day" className="border px-4 py-2 rounded" />
          <input name="pricingPerWeek" value={formData.pricingPerWeek} onChange={handleChange} placeholder="₹/Week" className="border px-4 py-2 rounded" />
          <input name="pricingPerMonth" value={formData.pricingPerMonth} onChange={handleChange} placeholder="₹/Month" className="border px-4 py-2 rounded" />
        </div>

        <input name="deposit" value={formData.deposit} onChange={handleChange} placeholder="Deposit Amount" className="w-full border px-4 py-2 rounded" />

        <div className="grid grid-cols-2 gap-4">
          <input name="availabilityStart" value={formData.availabilityStart} onChange={handleChange} type="date" className="border px-4 py-2 rounded" />
          <input name="availabilityEnd" value={formData.availabilityEnd} onChange={handleChange} type="date" className="border px-4 py-2 rounded" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border px-4 py-2 rounded" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border px-4 py-2 rounded" />
        </div>

        <div>
          <label className="block font-medium mb-2">Upload Images (Max 5)</label>
          <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
                <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 bg-white text-red-600 px-1 text-xs"
                >×</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          {loading ? 'Uploading...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
};

export default AddItem;
