'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiSave, 
  FiX, 
  FiPlus,
  FiTrash2,
  FiImage,
  FiAlertTriangle
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
    sizes: [{ size: 'M', stock: 0 }],
    colors: [{ name: '', hexCode: '#000000' }],
  });

  const categories = ['salwar', 'suit', 'maxi', 'gown', 'legging', 'kurti', 'dupatta', 'other'];
  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/admin/products/${params.slug}`);
      const data = await res.json();
      
      if (data.product) {
        setFormData({
          name: data.product.name || '',
          description: data.product.description || '',
          price: data.product.price?.toString() || '',
          discountPrice: data.product.discountPrice?.toString() || '',
          category: data.product.category || 'kurti',
          fabric: data.product.fabric || '',
          featured: data.product.featured || false,
          isActive: data.product.isActive !== false,
          images: data.product.images || [],
          sizes: data.product.sizes?.length > 0 ? data.product.sizes : [{ size: 'M', stock: 0 }],
          colors: data.product.colors?.length > 0 ? data.product.colors : [{ name: '', hexCode: '#000000' }],
        });
      } else {
        toast.error('Product not found');
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formDataUpload = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      
      if (data.urls) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...data.urls.map(url => ({ url, publicId: '' }))]
        }));
        toast.success('Images uploaded');
      }
    } catch (error) {
      toast.error('Failed to upload images');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addSize = () => {
    const usedSizes = formData.sizes.map(s => s.size);
    const availableSize = availableSizes.find(s => !usedSizes.includes(s));
    if (availableSize) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, { size: availableSize, stock: 0 }]
      }));
    }
  };

  const updateSize = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.map((s, i) => 
        i === index ? { ...s, [field]: field === 'stock' ? parseInt(value) || 0 : value } : s
      )
    }));
  };

  const removeSize = (index) => {
    if (formData.sizes.length > 1) {
      setFormData(prev => ({
        ...prev,
        sizes: prev.sizes.filter((_, i) => i !== index)
      }));
    }
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { name: '', hexCode: '#000000' }]
    }));
  };

  const updateColor = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) => 
        i === index ? { ...c, [field]: value } : c
      )
    }));
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      setFormData(prev => ({
        ...prev,
        colors: prev.colors.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (!formData.name || !formData.description || !formData.price) {
        toast.error('Please fill in all required fields');
        setSaving(false);
        return;
      }

      if (formData.images.length === 0) {
        toast.error('Please add at least one product image');
        setSaving(false);
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : 0,
        colors: formData.colors.filter(c => c.name.trim() !== ''),
      };

      const res = await fetch(`/api/admin/products/${params.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Product updated successfully!');
        // If slug changed, redirect to new slug
        if (data.product?.slug && data.product.slug !== params.slug) {
          router.push(`/admin/products/${data.product.slug}/edit`);
        }
      } else {
        toast.error(data.error || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${params.slug}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Product deleted successfully');
        router.push('/admin/products');
      } else {
        toast.error('Failed to delete product');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-10 bg-slate-800 rounded-lg w-48 animate-pulse"></div>
        <div className="bg-slate-800/50 rounded-2xl p-6 h-96 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/products"
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <FiArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            <p className="text-slate-400 mt-1">{formData.name}</p>
          </div>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-lg transition-all"
        >
          <FiTrash2 size={18} />
          <span>Delete</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500"
                placeholder="Enter product name"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500 resize-none"
                placeholder="Enter product description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-slate-800">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-2">Fabric</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500"
                  placeholder="e.g., Cotton, Silk"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Pricing</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-2">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-2">Discount Price (₹)</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-slate-500"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Product Images *</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {formData.images.map((img, index) => (
              <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-700 group">
                <img src={img.url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX size={16} />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-md">
                    Main
                  </span>
                )}
              </div>
            ))}
            
            <label className="aspect-[3/4] rounded-xl border-2 border-dashed border-slate-600 hover:border-cyan-500 transition-colors cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-cyan-400">
              <FiImage size={32} />
              <span className="text-sm mt-2">Add Image</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Sizes & Stock */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Sizes & Stock</h2>
            <button
              type="button"
              onClick={addSize}
              className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              <FiPlus size={16} />
              <span>Add Size</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-3">
                <select
                  value={size.size}
                  onChange={(e) => updateSize(index, 'size', e.target.value)}
                  className="w-32 bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                >
                  {availableSizes.map(s => (
                    <option key={s} value={s} className="bg-slate-800">{s}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={size.stock}
                  onChange={(e) => updateSize(index, 'stock', e.target.value)}
                  min="0"
                  className="flex-1 bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-all"
                  placeholder="Stock quantity"
                />
                {formData.sizes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Colors</h2>
            <button
              type="button"
              onClick={addColor}
              className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              <FiPlus size={16} />
              <span>Add Color</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {formData.colors.map((color, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="color"
                  value={color.hexCode}
                  onChange={(e) => updateColor(index, 'hexCode', e.target.value)}
                  className="w-12 h-10 rounded-lg cursor-pointer border border-slate-600"
                />
                <input
                  type="text"
                  value={color.name}
                  onChange={(e) => updateColor(index, 'name', e.target.value)}
                  className="flex-1 bg-slate-700/50 border border-slate-600 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-500"
                  placeholder="Color name (e.g., Navy Blue)"
                />
                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Settings</h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700"
              />
              <div>
                <span className="text-white font-medium">Featured Product</span>
                <p className="text-sm text-slate-400">Show this product in featured section</p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-5 h-5 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500/20 bg-slate-700"
              />
              <div>
                <span className="text-white font-medium">Active</span>
                <p className="text-sm text-slate-400">Product is visible to customers</p>
              </div>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 text-slate-300 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-700 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <FiAlertTriangle className="text-red-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Product</h3>
                <p className="text-slate-400 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete &ldquo;{formData.name}&rdquo;? This will permanently remove the product from your store.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
