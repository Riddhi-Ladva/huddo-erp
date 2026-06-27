import React, { useState } from 'react';
import { Package, Grid, List, Plus, Eye, DollarSign, Edit, Save, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { initialProducts } from '../mockData';
import { DataTable, Modal } from '../components/Common';

export default function Products({ showToast }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    // Fetch categories first
    fetch('/api/product-categories')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          setCategories(resData.data);
        }
      })
      .catch(err => console.error("Error loading categories:", err));

    // Fetch products
    fetch('/api/products')
      .then(res => res.json())
      .then(resData => {
        if (resData.success && Array.isArray(resData.data)) {
          const mapped = resData.data.map(p => ({
            id: p.sku || p._id,
            _id: p._id,
            name: p.name,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
            category: p.category?.name || p.category || 'Sports Shoes',
            categoryId: p.category?._id || p.category,
            description: p.description || '',
            sizes: [6, 7, 8, 9, 10, 11],
            colors: ["#ff0000", "#000000"],
            mrp: 2999,
            costPrice: 1200,
            margin: 25,
            status: p.lifecycle_status === 'Active' ? 'Active' : 'Inactive',
            retailerMargin: 25,
            cityManagerIncentive: 2,
            stateManagerIncentive: 1,
            hsn_code: '6403.99.90',
            article_no: p.sku || 'ART-AC-01',
            colour: 'Red',
            franchise_points: 12.5
          }));
          setProducts(mapped);
        } else {
          setProducts(initialProducts);
        }
      })
      .catch(err => {
        console.error("Error loading products:", err);
        setProducts(initialProducts);
      });
  }, []);

  const [viewMode, setViewMode] = useState('grid'); // grid | list | edit
  const [viewingProd, setViewingProd] = useState(null);
  const [prodTab, setProdTab] = useState('overview'); // overview | matrix | commissions

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '', category: 'Sports Shoes', description: '',
    sizes: [6, 7, 8, 9, 10], colors: ["#000000"],
    mrp: '', costPrice: '', status: 'Active',
    hsn_code: '', article_no: '', colour: '', franchise_points: ''
  });
  const [bulkAdjustment, setBulkAdjustment] = useState({ type: 'percent', value: '' });

  // Edit states
  const [editingProd, setEditingProd] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '', category: '', description: '',
    sizes: [6, 7, 8, 9, 10], colors: ["#000000"],
    mrp: '', costPrice: '', status: 'Active',
    hsn_code: '', article_no: '', colour: '', franchise_points: ''
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.mrp || !formData.costPrice || !formData.article_no || !formData.hsn_code || !formData.colour || !formData.franchise_points) {
      showToast("Please fill all required footwear parameters.", "error");
      return;
    }
    if (Number(formData.mrp) <= 0 || Number(formData.costPrice) <= 0) {
      showToast("MRP and Cost Price must be greater than zero.", "error");
      return;
    }
    if (Number(formData.costPrice) > Number(formData.mrp)) {
      showToast("Cost Price cannot be greater than MRP.", "error");
      return;
    }
    if (Number(formData.franchise_points) < 0) {
      showToast("Franchise Points must be non-negative.", "error");
      return;
    }

    // Resolve category name/ID
    let resolvedCategory = formData.category;
    let categoryName = formData.category;
    const foundCat = categories.find(c => c._id === formData.category || c.name === formData.category);
    if (foundCat) {
      resolvedCategory = foundCat._id;
      categoryName = foundCat.name;
    } else if (categories.length > 0) {
      resolvedCategory = categories[0]._id;
      categoryName = categories[0].name;
    }

    const marginVal = Math.round(((Number(formData.mrp) - Number(formData.costPrice)) / Number(formData.mrp)) * 100);

    const newProd = {
      name: formData.name,
      sku: formData.article_no,
      description: formData.description,
      is_active: formData.status === 'Active',
      category: resolvedCategory
    };

    // Save to database
    fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newProd)
    })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        const addedDbProd = data.data;
        const newLocalProd = {
          id: addedDbProd.sku || addedDbProd._id,
          _id: addedDbProd._id,
          name: addedDbProd.name,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
          category: categoryName,
          categoryId: resolvedCategory,
          description: addedDbProd.description || '',
          sizes: formData.sizes,
          colors: formData.colors,
          mrp: Number(formData.mrp),
          costPrice: Number(formData.costPrice),
          margin: marginVal,
          status: formData.status,
          retailerMargin: 20,
          cityManagerIncentive: 2,
          stateManagerIncentive: 1,
          hsn_code: formData.hsn_code,
          article_no: formData.article_no,
          colour: formData.colour,
          franchise_points: Number(formData.franchise_points) || 0
        };
        setProducts([...products, newLocalProd]);
        setIsAddOpen(false);
        showToast(`Product "${newLocalProd.name}" added successfully with ${marginVal}% gross margin.`, "success");
      } else {
        showToast(data.message || "Failed to save product in database.", "error");
      }
    })
    .catch(err => {
      console.error("Failed to save product:", err);
      showToast("Network error: Failed to save product.", "error");
    });
  };

  const handleStartEdit = (prod) => {
    setEditingProd(prod);
    setEditFormData({
      name: prod.name || '',
      category: prod.categoryId || prod.category || '',
      description: prod.description || '',
      sizes: prod.sizes || [6, 7, 8, 9, 10, 11],
      colors: prod.colors || ["#ff0000", "#000000"],
      mrp: prod.mrp || '',
      costPrice: prod.costPrice || '',
      status: prod.status || 'Active',
      hsn_code: prod.hsn_code || '',
      article_no: prod.article_no || prod.sku || '',
      colour: prod.colour || '',
      franchise_points: prod.franchise_points || ''
    });
    setViewMode('edit');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.mrp || !editFormData.costPrice || !editFormData.article_no || !editFormData.hsn_code || !editFormData.colour || !editFormData.franchise_points) {
      showToast("Please fill all required footwear parameters.", "error");
      return;
    }
    if (Number(editFormData.mrp) <= 0 || Number(editFormData.costPrice) <= 0) {
      showToast("MRP and Cost Price must be greater than zero.", "error");
      return;
    }
    if (Number(editFormData.costPrice) > Number(editFormData.mrp)) {
      showToast("Cost Price cannot be greater than MRP.", "error");
      return;
    }
    if (Number(editFormData.franchise_points) < 0) {
      showToast("Franchise Points must be non-negative.", "error");
      return;
    }

    // Resolve category name/ID
    let resolvedCategory = editFormData.category;
    let categoryName = editFormData.category;
    const foundCat = categories.find(c => c._id === editFormData.category || c.name === editFormData.category);
    if (foundCat) {
      resolvedCategory = foundCat._id;
      categoryName = foundCat.name;
    } else if (categories.length > 0) {
      resolvedCategory = categories[0]._id;
      categoryName = categories[0].name;
    }

    const marginVal = Math.round(((Number(editFormData.mrp) - Number(editFormData.costPrice)) / Number(editFormData.mrp)) * 100);

    const updatedProdData = {
      name: editFormData.name,
      sku: editFormData.article_no,
      description: editFormData.description,
      is_active: editFormData.status === 'Active',
      lifecycle_status: editFormData.status === 'Active' ? 'Active' : 'Discontinued',
      category: resolvedCategory
    };

    const prodId = editingProd._id || editingProd.id;
    fetch(`/api/products/${prodId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProdData)
    })
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        // Update local React state
        setProducts(products.map(p => (p._id === prodId || p.id === prodId) ? {
          ...p,
          name: editFormData.name,
          category: categoryName,
          categoryId: resolvedCategory,
          description: editFormData.description,
          sizes: editFormData.sizes,
          colors: editFormData.colors,
          mrp: Number(editFormData.mrp),
          costPrice: Number(editFormData.costPrice),
          margin: marginVal,
          status: editFormData.status,
          hsn_code: editFormData.hsn_code,
          article_no: editFormData.article_no,
          colour: editFormData.colour,
          franchise_points: Number(editFormData.franchise_points)
        } : p));
        
        showToast(`Product "${editFormData.name}" updated successfully.`, "success");
        setViewMode('grid'); // Redirect back to Product Catalog
        setEditingProd(null);
      } else {
        showToast(data.message || "Failed to update product.", "error");
      }
    })
    .catch(err => {
      console.error("Failed to update product:", err);
      showToast("Network error: Failed to update product.", "error");
    });
  };

  const toggleSizeCheckboxEdit = (sz) => {
    if (editFormData.sizes.includes(sz)) {
      setEditFormData({ ...editFormData, sizes: editFormData.sizes.filter(s => s !== sz) });
    } else {
      setEditFormData({ ...editFormData, sizes: [...editFormData.sizes, sz] });
    }
  };

  const handleBulkPriceUpdate = () => {
    const factor = 1 + (Number(bulkAdjustment.value) / 100);
    setProducts(products.map(p => {
      const updatedMrp = Math.round(p.mrp * factor);
      const updatedCost = Math.round(p.costPrice * factor);
      const updatedMargin = Math.round(((updatedMrp - updatedCost) / updatedMrp) * 100);
      return {
        ...p,
        mrp: updatedMrp,
        costPrice: updatedCost,
        margin: updatedMargin
      };
    }));
    setIsBulkOpen(false);
    showToast(`Bulk updated all catalogue product prices by ${bulkAdjustment.value}%.`, "success");
  };

  const handleSaveCommissions = (id, retM, cityM, stateM) => {
    setProducts(products.map(p => 
      p.id === id ? { 
        ...p, 
        retailerMargin: Number(retM), 
        cityManagerIncentive: Number(cityM), 
        stateManagerIncentive: Number(stateM) 
      } : p
    ));
    showToast("Product commission structure updated.", "success");
  };

  const toggleSizeCheckbox = (sz) => {
    if (formData.sizes.includes(sz)) {
      setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== sz) });
    } else {
      setFormData({ ...formData, sizes: [...formData.sizes, sz] });
    }
  };

  // List View Columns
  const columns = [
    { header: "Catalog Image", accessor: "image", sortable: false, render: (val, row) => (
      <img src={val} alt={row.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
    )},
    { header: "Product Name", accessor: "name", render: (val) => <span className="font-bold text-slate-800 font-display">{val}</span> },
    { header: "Article No.", accessor: "article_no" },
    { header: "Category", accessor: "category" },
    { header: "MRP (₹)", accessor: "mrp", render: (val) => <span className="font-bold text-slate-900">₹{val.toLocaleString('en-IN')}</span> },
    { header: "Franchise Cost Price (₹)", accessor: "costPrice", render: (val) => <span className="font-medium text-slate-500">₹{val.toLocaleString('en-IN')}</span> },
    { header: "HSN Code", accessor: "hsn_code" },
    { header: "Colour", accessor: "colour" },
    { header: "Franchise Points", accessor: "franchise_points", render: (val) => <span className="font-bold text-indigo-600">{val} pts</span> },
    { header: "Gross Margin", accessor: "margin", render: (val) => <span className="font-bold text-emerald-600">{val}%</span> },
    { header: "Status", accessor: "status", render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${val === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
        {val}
      </span>
    )},
    { header: "Actions", accessor: "id", sortable: false, render: (val, row) => (
      <div className="flex gap-2">
        <button onClick={() => { setViewingProd(row); setProdTab('overview'); }} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs rounded hover:bg-slate-200 transition-colors">
          Inspect
        </button>
        <button onClick={() => handleStartEdit(row)} className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold text-xs rounded hover:bg-indigo-100 transition-colors">
          Edit
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display">Product Catalog</h1>
          <p className="text-sm text-slate-500">Maintain footwear stocks, set regional wholesale markup margins, configure multi-level commission incentive points.</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button 
            onClick={() => setIsBulkOpen(true)}
            className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white transition-colors"
          >
            Bulk Price Adjust
          </button>
          
          <button 
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Footwear</span>
          </button>
        </div>
      </div>

      {/* Grid vs List Toggles */}
      <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-xs">
        <span className="text-xs font-bold text-slate-500">{products.length} footwear items registered</span>
        <div className="flex items-center gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white text-brand-orange shadow-xs' : 'text-slate-400'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white text-brand-orange shadow-xs' : 'text-slate-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main content display */}
      {viewMode === 'edit' ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Edit Footwear Product</h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Modify parameters, sizes, and pricing indices for {editingProd?.name}.</p>
            </div>
            <button 
              onClick={() => { setViewMode('grid'); setEditingProd(null); }}
              className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Footwear Product Name *</label>
              <input type="text" placeholder="Huddo Flex Alpha" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Product Category</label>
                <select value={editFormData.category} onChange={(e) => setEditFormData({...editFormData, category: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white text-slate-800 cursor-pointer">
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Sports Shoes">Sports Shoes</option>
                      <option value="Formal Shoes">Formal Shoes</option>
                      <option value="Casual Shoes">Casual Shoes</option>
                      <option value="Sandals">Sandals</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Base MRP (₹) *</label>
                <input type="number" placeholder="2999" value={editFormData.mrp} onChange={(e) => setEditFormData({...editFormData, mrp: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Franchise Cost Price (₹) *</label>
                <input type="number" placeholder="1200" value={editFormData.costPrice} onChange={(e) => setEditFormData({...editFormData, costPrice: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Catalog Status</label>
                <select value={editFormData.status} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white text-slate-800 cursor-pointer">
                  <option value="Active">Active</option>
                  <option value="Discontinued">Discontinued</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Article No. *</label>
                <input type="text" placeholder="ART-XX-XX" value={editFormData.article_no} onChange={(e) => setEditFormData({...editFormData, article_no: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">HSN Code *</label>
                <input type="text" placeholder="6403.XX.XX" value={editFormData.hsn_code} onChange={(e) => setEditFormData({...editFormData, hsn_code: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Colour *</label>
                <input type="text" placeholder="Red / Black" value={editFormData.colour} onChange={(e) => setEditFormData({...editFormData, colour: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Franchise Points *</label>
                <input type="number" step="0.01" placeholder="10.0" value={editFormData.franchise_points} onChange={(e) => setEditFormData({...editFormData, franchise_points: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Available UK Sizes</label>
              <div className="flex gap-2 flex-wrap bg-slate-50 border border-slate-100 rounded-lg p-2">
                {[5, 6, 7, 8, 9, 10, 11, 12].map(sz => {
                  const isSelected = editFormData.sizes.includes(sz);
                  return (
                    <button 
                      key={sz}
                      type="button"
                      onClick={() => toggleSizeCheckboxEdit(sz)}
                      className={`w-8 h-8 rounded text-xs border font-bold transition-all cursor-pointer ${isSelected ? 'bg-brand-orange border-brand-orange text-white' : 'bg-white border-slate-200 text-slate-650'}`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Product Description</label>
              <textarea rows="2" placeholder="Describe product details, synthetic meshes, outsoles..." value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button 
                type="button"
                onClick={() => { setViewMode('grid'); setEditingProd(null); }}
                className="px-4 py-2 border border-slate-200 hover:border-slate-300 rounded-lg text-sm font-semibold text-slate-700 bg-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {products.map(prod => (
            <div 
              key={prod.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-brand-orange hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative"
            >
              <div className="relative overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-44 object-cover border-b border-slate-100" />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setViewingProd(prod); setProdTab('overview'); }}
                    className="p-2 bg-white text-slate-700 rounded-lg hover:bg-slate-100 transition-colors shadow-sm text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> Inspect
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleStartEdit(prod); }}
                    className="p-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-hover transition-colors shadow-sm text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
              </div>
              <div 
                onClick={() => { setViewingProd(prod); setProdTab('overview'); }}
                className="p-4 flex-1 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400">{prod.category}</span>
                  <h3 className="text-sm font-bold text-slate-800 font-display mt-0.5">{prod.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Sizes: {prod.sizes.join(", ")}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-slate-900 text-sm">₹{prod.mrp.toLocaleString('en-IN')}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>{prod.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable 
          columns={columns} 
          data={products} 
          searchKeys={["name", "category"]} 
          searchPlaceholder="Search footwear catalog..."
        />
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Footwear Product"
        onConfirm={handleAddSubmit}
      >
        <form className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Footwear Product Name *</label>
            <input type="text" placeholder="Huddo Flex Alpha" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Product Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white text-slate-800 cursor-pointer">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))
                ) : (
                  <>
                    <option value="Sports Shoes">Sports Shoes</option>
                    <option value="Formal Shoes">Formal Shoes</option>
                    <option value="Casual Shoes">Casual Shoes</option>
                    <option value="Sandals">Sandals</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Base MRP (₹) *</label>
              <input type="number" placeholder="2999" value={formData.mrp} onChange={(e) => setFormData({...formData, mrp: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Franchise Cost Price (₹) *</label>
              <input type="number" placeholder="1200" value={formData.costPrice} onChange={(e) => setFormData({...formData, costPrice: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Catalog Status</label>
              <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 bg-white">
                <option value="Active">Active</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Article No. *</label>
              <input type="text" placeholder="ART-XX-XX" value={formData.article_no} onChange={(e) => setFormData({...formData, article_no: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">HSN Code *</label>
              <input type="text" placeholder="6403.XX.XX" value={formData.hsn_code} onChange={(e) => setFormData({...formData, hsn_code: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Colour *</label>
              <input type="text" placeholder="Red / Black" value={formData.colour} onChange={(e) => setFormData({...formData, colour: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Franchise Points *</label>
              <input type="number" step="0.01" placeholder="10.0" value={formData.franchise_points} onChange={(e) => setFormData({...formData, franchise_points: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Available UK Sizes</label>
            <div className="flex gap-2 flex-wrap bg-slate-50 border border-slate-100 rounded-lg p-2">
              {[5, 6, 7, 8, 9, 10, 11, 12].map(sz => {
                const isSelected = formData.sizes.includes(sz);
                return (
                  <button 
                    key={sz}
                    type="button"
                    onClick={() => toggleSizeCheckbox(sz)}
                    className={`w-8 h-8 rounded text-xs border font-bold transition-all ${isSelected ? 'bg-brand-orange border-brand-orange text-white' : 'bg-white border-slate-200 text-slate-600'}`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-0.5">Product Description</label>
            <textarea rows="2" placeholder="Describe product details, synthetic meshes, outsoles..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none" />
          </div>
        </form>
      </Modal>

      {/* Bulk Price Update Modal */}
      <Modal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        title="Bulk Catalogue Price Adjustment"
        onConfirm={handleBulkPriceUpdate}
      >
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex gap-2">
            <span className="font-bold">⚠️ Warning:</span>
            <p>This alters the base MRP and Franchise Cost price indices for all footwear models in the current system. This process is irreversible.</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Percentage Mark Up / Mark Down (%)</label>
            <input 
              type="number" 
              placeholder="e.g., 5 or -2" 
              value={bulkAdjustment.value}
              onChange={(e) => setBulkAdjustment({ ...bulkAdjustment, value: e.target.value })}
              className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Positive numbers increase catalog base prices; negative numbers decrease pricing.</span>
          </div>
        </div>
      </Modal>

      {/* Detailed Product modal drawer */}
      {viewingProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-100 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img src={viewingProd.image} alt={viewingProd.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-display">{viewingProd.name}</h3>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">{viewingProd.category} • MRP: ₹{viewingProd.mrp}</span>
                </div>
              </div>
              <button onClick={() => setViewingProd(null)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/30 px-6">
              {['overview', 'matrix', 'commissions'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setProdTab(tab)}
                  className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors uppercase ${prodTab === tab ? 'border-brand-orange text-brand-orange' : 'border-transparent text-slate-500'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Profile Drawer contents */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {prodTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Product Description</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-semibold">{viewingProd.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Franchise Cost Price</span>
                      <p className="text-base font-bold text-slate-800 font-display mt-0.5">₹{viewingProd.costPrice}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Gross Margin</span>
                      <p className="text-base font-bold text-emerald-600 font-display mt-0.5">{viewingProd.margin}%</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Size Count</span>
                      <p className="text-base font-bold text-slate-800 font-display mt-0.5">{viewingProd.sizes.length} Sizes</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Article Number</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{viewingProd.article_no || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">HSN Code</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{viewingProd.hsn_code || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Colour</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{viewingProd.colour || 'N/A'}</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Franchise Points</span>
                      <p className="text-sm font-bold text-indigo-600 mt-0.5">{viewingProd.franchise_points || 0} pts</p>
                    </div>
                  </div>
                </div>
              )}

              {prodTab === 'matrix' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Size × Color × Stock Variant Matrix</h4>
                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-4 py-2.5">Size Mapping</th>
                          <th className="px-4 py-2.5">Color Tag</th>
                          <th className="px-4 py-2.5 text-right">Warehouse Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {viewingProd.sizes.slice(0, 4).map((sz, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2.5 text-slate-800 font-bold">UK {sz}</td>
                            <td className="px-4 py-2.5 flex items-center gap-1">
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ backgroundColor: viewingProd.colors[0] || '#000000' }}></span>
                              <span>Classic Shade</span>
                            </td>
                            <td className="px-4 py-2.5 text-right text-slate-600">120 pairs</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {prodTab === 'commissions' && (
                <CommissionForm 
                  product={viewingProd} 
                  onSave={(retM, cityM, stateM) => {
                    handleSaveCommissions(viewingProd.id, retM, cityM, stateM);
                    setViewingProd(null);
                  }} 
                />
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inner helper component to manage local state for commission points safely
function CommissionForm({ product, onSave }) {
  const [retMargin, setRetMargin] = useState(product.retailerMargin || 20);
  const [cityIncentive, setCityIncentive] = useState(product.cityManagerIncentive || 2);
  const [stateIncentive, setStateIncentive] = useState(product.stateManagerIncentive || 1);

  return (
    <div className="space-y-4 text-xs font-semibold text-slate-700">
      <h4 className="text-xs font-bold text-slate-500 uppercase">Commission & Incentive Points Distribution</h4>
      <div className="space-y-3 bg-slate-50 border border-slate-100 p-4 rounded-xl">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Retailer Base Margin (%)</label>
          <input 
            type="number" 
            value={retMargin} 
            onChange={(e) => setRetMargin(e.target.value)} 
            className="border border-slate-200 p-2 rounded w-full bg-white font-bold" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City Manager Incentive (%)</label>
          <input 
            type="number" 
            value={cityIncentive} 
            onChange={(e) => setCityIncentive(e.target.value)} 
            className="border border-slate-200 p-2 rounded w-full bg-white font-bold" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State Manager Incentive (%)</label>
          <input 
            type="number" 
            value={stateIncentive} 
            onChange={(e) => setStateIncentive(e.target.value)} 
            className="border border-slate-200 p-2 rounded w-full bg-white font-bold" 
          />
        </div>
      </div>
      <button 
        type="button" 
        onClick={() => onSave(retMargin, cityIncentive, stateIncentive)} 
        className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold rounded-lg shadow-sm transition-colors text-center"
      >
        Save Commission Settings
      </button>
    </div>
  );
}
