'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiUpload, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const categories = ['salwar', 'suit', 'maxi', 'gown', 'legging', 'kurti', 'dupatta', 'other'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: 'kurti',
    fabric: '',
    featured: false,
    isActive: true,
    images: [],
    sizes: [{ size: 'Free Size', stock: 10 }],
    colors: [{ name: '', hexCode: '#000000' }],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);

    try {
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!res.ok) throw new Error('Upload failed');

        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, { url: data.url, publicId: data.publicId }],
        }));
      }
      toast.success('Images uploaded');
    } catch (error) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index][field] = field === 'stock' ? parseInt(value) || 0 : value;
    setFormData({ ...formData, sizes: newSizes });
  };

  const addSize = () => {
    setFormData({
      ...formData,
      sizes: [...formData.sizes, { size: 'M', stock: 0 }],
    });
  };

  const removeSize = (index) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((_, i) => i !== index),
    });
  };

  const handleColorChange = (index, field, value) => {
    const newColors = [...formData.colors];
    newColors[index][field] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({
      ...formData,
      colors: [...formData.colors, { name: '', hexCode: '#000000' }],
    });
  };

  const removeColor = (index) => {
    setFormData({
      ...formData,
      colors: formData.colors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
          colors: formData.colors.filter((c) => c.name),
        }),
      });

      if (!res.ok) throw new Error('Failed to create product');

      toast.success('Product created successfully');
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., Cotton Floral Kurti"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    placeholder="Product description..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="999"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Discount Price (₹)</label>
                    <input
                      type="number"
                      name="discountPrice"
                      value={formData.discountPrice}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="799"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="capitalize">
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Fabric</label>
                    <input
                      type="text"
                      name="fabric"
                      value={formData.fabric}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., Cotton, Silk, Rayon"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Sizes & Stock</h2>
                <button type="button" onClick={addSize} className="text-yellow-400 hover:underline font-bold">
                  <FiPlus className="inline mr-1" /> Add Size
                </button>
              </div>

              <div className="space-y-3">
                {formData.sizes.map((s, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <select
                      value={s.size}
                      onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                      className="input-field w-32"
                    >
                      {sizes.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={s.stock}
                      onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                      className="input-field w-24"
                      placeholder="Stock"
                    />
                    {formData.sizes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSize(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Colors</h2>
                <button type="button" onClick={addColor} className="text-yellow-400 hover:underline font-bold">
                  <FiPlus className="inline mr-1" /> Add Color
                </button>
              </div>

              <div className="space-y-3">
                {formData.colors.map((c, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => handleColorChange(index, 'name', e.target.value)}
                      className="input-field flex-1"
                      placeholder="Color name (e.g., Red, Blue)"
                    />
                    <input
                      type="color"
                      value={c.hexCode}
                      onChange={(e) => handleColorChange(index, 'hexCode', e.target.value)}
                      className="w-12 h-10 rounded cursor-pointer"
                    />
                    {formData.colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Product Images *</h2>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <Image src={img.url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <label className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-yellow-400 transition">
                <FiUpload className="mx-auto text-gray-400 mb-2" size={24} />
                <span className="text-gray-500">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Status */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Status</h2>

              <label className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="rounded text-yellow-400"
                />
                <span className="ml-2">Active (visible on store)</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded text-yellow-400"
                />
                <span className="ml-2">Featured product</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
