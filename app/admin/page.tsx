'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

interface PreferenceOption {
  id: string;
  label: string;
  icon: string;
  isCustom?: boolean;
}

const DEFAULT_PREFERENCES: PreferenceOption[] = [
  { id: 'attractions', label: 'Attractions', icon: '🏛️' },
  { id: 'families', label: 'Families With Kids', icon: '👨‍👩‍👧‍👦' },
  { id: 'couple', label: 'Couple', icon: '💑' },
  { id: 'food', label: 'Food Drinks', icon: '🍹' },
  { id: 'culture', label: 'Culture & Heritage', icon: '🕌' },
  { id: 'nature', label: 'Nature & Wildlife', icon: '🌲' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'allPackages' | 'packages' | 'allDestinations' | 'destinations' | 'bestDeals' | 'orders'>('overview');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

  // Search and Edit state for packages & destinations
  const [packageSearch, setPackageSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [editingDest, setEditingDest] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Preferable / Suitable For state
  const [preferences, setPreferences] = useState<PreferenceOption[]>(DEFAULT_PREFERENCES);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showAddPreference, setShowAddPreference] = useState(false);
  const [newPrefTitle, setNewPrefTitle] = useState('');
  const [newPrefIcon, setNewPrefIcon] = useState('');
  const [isSavingPref, setIsSavingPref] = useState(false);

  const [packageImageType, setPackageImageType] = useState<'url' | 'file'>('url');
  const [packageImageFile, setPackageImageFile] = useState<File | null>(null);
  const [destImageType, setDestImageType] = useState<'url' | 'file'>('url');
  const [destImageFile, setDestImageFile] = useState<File | null>(null);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('File upload failed');
    const data = await res.json();
    return data.url;
  };

  useEffect(() => {
    fetch('/api/packages')
      .then(r => r.json())
      .then(data => setPackages(data))
      .catch(console.error);

    fetch('/api/destinations')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDestinations(data);
          setPackageData(prev => ({
            ...prev,
            destination: prev.destination || data[0]?.title || 'Dubai'
          }));
        }
      })
      .catch(console.error);

    fetch('/api/orders')
      .then(r => r.json())
      .then(data => setOrders(data))
      .catch(console.error);

    fetch('/api/preferences')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPreferences(data);
        }
      })
      .catch(console.error);
  }, [success]);

  const [packageData, setPackageData] = useState({
    title: '',
    destination: 'Dubai',
    price: '',
    rating: '5.0',
    reviewsCount: '0',
    image: '',
    images: '',
    description: '',
    highlights: '',
    quickFacts: '',
    inclusions: '',
    tags: '',
    isPopular: false
  });

  const [dealData, setDealData] = useState({
    packageId: '',
    originalPrice: ''
  });

  const [destData, setDestData] = useState({
    title: '',
    image: ''
  });

  const handlePackageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setPackageData({ ...packageData, [name]: checked });
    } else {
      setPackageData({ ...packageData, [name]: value });
    }
  };

  const togglePreference = (label: string) => {
    setSelectedPreferences(prev =>
      prev.includes(label)
        ? prev.filter(p => p !== label)
        : [...prev, label]
    );
  };

  const handleAddCustomPreference = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedTitle = newPrefTitle.trim();
    if (!trimmedTitle) return;

    const iconToUse = newPrefIcon.trim() || '🏷️';
    const id = trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newOption: PreferenceOption = { id, label: trimmedTitle, icon: iconToUse, isCustom: true };
    setPreferences(prev => [...prev.filter(p => p.id !== id), newOption]);
    setSelectedPreferences(prev => prev.includes(trimmedTitle) ? prev : [...prev, trimmedTitle]);
    setNewPrefTitle('');
    setNewPrefIcon('');
    setShowAddPreference(false);

    try {
      setIsSavingPref(true);
      await fetch('/api/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label: trimmedTitle, icon: iconToUse })
      });
    } catch (err) {
      console.error('Failed to save preference:', err);
    } finally {
      setIsSavingPref(false);
    }
  };

  const handleDestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestData({
      ...destData,
      [e.target.name]: e.target.value
    });
  };

  const handleDealChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setDealData({
      ...dealData,
      [e.target.name]: e.target.value
    });
  };

  const submitPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      let finalImageUrl = packageData.image;
      if (packageImageType === 'file' && packageImageFile) {
        finalImageUrl = await uploadImage(packageImageFile);
      }

      const payload = {
        ...packageData,
        image: finalImageUrl,
        suitableFor: selectedPreferences,
        reviewsCount: parseInt(packageData.reviewsCount) || 0,
        images: packageData.images.split('\n').map(s => s.trim()).filter(Boolean),
        highlights: packageData.highlights.split('\n').map(s => s.trim()).filter(Boolean),
        quickFacts: packageData.quickFacts.split('\n').map(s => s.trim()).filter(Boolean),
        inclusions: packageData.inclusions.split('\n').map(s => s.trim()).filter(Boolean),
        tags: packageData.tags.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (payload.image && payload.images.length === 0) {
        payload.images.push(payload.image);
      }

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to add package');

      setSuccess(true);
      setSelectedPreferences([]);
      setPackageData({
        title: '', destination: 'Dubai', price: '', rating: '5.0', reviewsCount: '0',
        image: '', images: '', description: '', highlights: '', quickFacts: '',
        inclusions: '', tags: '', isPopular: false
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const submitDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch(`/api/packages/${dealData.packageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBestDeal: true,
          originalPrice: dealData.originalPrice
        })
      });

      if (!res.ok) throw new Error('Failed to update package');

      setSuccess(true);
      setDealData({ packageId: '', originalPrice: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const submitDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      let finalImageUrl = destData.image;
      if (destImageType === 'file' && destImageFile) {
        finalImageUrl = await uploadImage(destImageFile);
      }

      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...destData, image: finalImageUrl })
      });

      if (!res.ok) throw new Error('Failed to add destination');
      const newDest = await res.json();

      // Immediately fetch updated destinations list
      const updatedDestinations = await fetch('/api/destinations').then(r => r.json());
      if (Array.isArray(updatedDestinations)) {
        setDestinations(updatedDestinations);
      }

      // Automatically sync newly added destination with packageData destination dropdown
      setPackageData(prev => ({
        ...prev,
        destination: newDest.title || destData.title || prev.destination
      }));

      setSuccess(true);
      setDestData({ title: '', image: '' });
      setDestImageFile(null);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh orders
        const updatedOrders = await fetch('/api/orders').then(r => r.json());
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete package');
      setPackages(prev => prev.filter(p => p.id !== id));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error deleting package');
    }
  };

  const handleSaveEditPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/packages/${editingPackage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingPackage,
          reviewsCount: parseInt(editingPackage.reviewsCount) || 0,
        })
      });
      if (!res.ok) throw new Error('Failed to update package');
      const updated = await res.json();
      setPackages(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingPackage(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error updating package');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination?')) return;
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete destination');
      setDestinations(prev => prev.filter(d => d.id !== id));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error deleting destination');
    }
  };

  const handleSaveEditDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    setEditLoading(true);
    try {
      const res = await fetch(`/api/destinations/${editingDest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingDest)
      });
      if (!res.ok) throw new Error('Failed to update destination');
      const updated = await res.json();
      setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d));
      setEditingDest(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error updating destination');
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Navigation</div>
        <nav className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'allPackages' ? styles.active : ''}`}
            onClick={() => setActiveTab('allPackages')}
          >
            <span>📦</span> All Packages
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'packages' ? styles.active : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <span>🎒</span> Add Package
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'allDestinations' ? styles.active : ''}`}
            onClick={() => setActiveTab('allDestinations')}
          >
            <span>🗺️</span> All Destinations
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'destinations' ? styles.active : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <span>📍</span> Add Destination
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'bestDeals' ? styles.active : ''}`}
            onClick={() => setActiveTab('bestDeals')}
          >
            <span>🔥</span> Best Deals
          </button>
          <button
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span>🛒</span> Orders
          </button>
        </nav>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Admin Portal</h1>
          <p>Welcome back! Here's what's happening today.</p>
        </div>

        {success && <div className={styles.successAlert}>Operation completed successfully!</div>}
        {error && <div className={styles.errorAlert}>{error}</div>}

        {activeTab === 'overview' && (
          <div>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📦</div>
                <div className={styles.statInfo}>
                  <h3>Total Packages</h3>
                  <p>{packages.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📍</div>
                <div className={styles.statInfo}>
                  <h3>Destinations</h3>
                  <p>{destinations.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🛍️</div>
                <div className={styles.statInfo}>
                  <h3>Total Orders</h3>
                  <p>{orders.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔥</div>
                <div className={styles.statInfo}>
                  <h3>Best Deals</h3>
                  <p>{packages.filter(p => p.isBestDeal).length}</p>
                </div>
              </div>
            </div>

            <div className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h2>Recent Orders</h2>
                <button 
                  type="button"
                  onClick={() => setActiveTab('orders')} 
                  style={{ 
                    background: 'transparent', 
                    border: 'none', 
                    color: '#e00b3e', 
                    fontWeight: '600', 
                    fontSize: '0.9rem', 
                    cursor: 'pointer' 
                  }}
                >
                  View All Orders →
                </button>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Customer Name</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id.slice(0, 8)}</td>
                        <td>{order.firstName} {order.lastName}</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>AED {order.totalAmount}</td>
                        <td>
                          <span className={`${styles.badge} ${order.status === 'confirmed' ? styles.badgeConfirmed : order.status === 'cancelled' ? styles.badgeCancelled : styles.badgePending}`}>
                            {order.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {orders.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>No orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'allPackages' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>All Packages ({packages.length})</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                  Complete list of packages with edit and delete capabilities
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveTab('packages')} 
                className={styles.primaryAddBtn}
              >
                + Add New Package
              </button>
            </div>

            <input
              type="text"
              placeholder="Search packages by title or destination..."
              value={packageSearch}
              onChange={(e) => setPackageSearch(e.target.value)}
              className={styles.searchBar}
            />

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Package Title</th>
                    <th>Destination</th>
                    <th>Price</th>
                    <th>Rating</th>
                    <th>Most Preferable For</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages
                    .filter(p => 
                      p.title?.toLowerCase().includes(packageSearch.toLowerCase()) || 
                      p.destination?.toLowerCase().includes(packageSearch.toLowerCase())
                    )
                    .map((pkg) => (
                      <tr key={pkg.id}>
                        <td style={{ width: '70px' }}>
                          {pkg.image ? (
                            <img 
                              src={pkg.image} 
                              alt={pkg.title} 
                              style={{ width: '54px', height: '40px', objectFit: 'cover', borderRadius: '6px' }} 
                            />
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '600', color: '#0f172a' }}>
                          {pkg.title}
                          {pkg.isBestDeal && (
                            <span className={`${styles.badge} ${styles.badgeConfirmed}`} style={{ marginLeft: '6px', fontSize: '0.7rem' }}>Best Deal</span>
                          )}
                          {pkg.isPopular && (
                            <span className={`${styles.badge} ${styles.badgePending}`} style={{ marginLeft: '6px', fontSize: '0.7rem' }}>Popular</span>
                          )}
                        </td>
                        <td>
                          <span>📍 {pkg.destination}</span>
                        </td>
                        <td style={{ fontWeight: '600' }}>AED {pkg.price}</td>
                        <td>★ {pkg.rating} <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>({pkg.reviewsCount})</span></td>
                        <td>
                          {pkg.suitableFor && pkg.suitableFor.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {pkg.suitableFor.map((pref: string, idx: number) => {
                                const found = preferences.find(p => p.label.toLowerCase() === pref.toLowerCase() || p.id === pref.toLowerCase());
                                return (
                                  <span key={idx} className={styles.prefBadge}>
                                    {found?.icon || '🏷️'} {pref}
                                  </span>
                                );
                              })}
                            </div>
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>None</span>
                          )}
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => setEditingPackage({ ...pkg })}
                            className={styles.editActionBtn}
                            title="Edit this package"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePackage(pkg.id)}
                            className={styles.deleteActionBtn}
                            title="Delete this package"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {packages.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                        No packages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'packages' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2>Add New Package</h2>
            </div>
            <form onSubmit={submitPackage}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="title">Package Title *</label>
                  <input required type="text" id="title" name="title" value={packageData.title} onChange={handlePackageChange} placeholder="e.g. Desert Safari" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="destination">Destination *</label>
                  <select 
                    required 
                    id="destination" 
                    name="destination" 
                    value={packageData.destination} 
                    onChange={handlePackageChange}
                  >
                    {destinations.map((d: any) => (
                      <option key={d.id || d.title} value={d.title}>
                        {d.title}
                      </option>
                    ))}
                    {destinations.length === 0 && (
                      <>
                        <option value="Dubai">Dubai</option>
                        <option value="Abu Dhabi">Abu Dhabi</option>
                        <option value="Sharjah">Sharjah</option>
                      </>
                    )}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="price">Price (AED) *</label>
                  <input required type="text" id="price" name="price" value={packageData.price} onChange={handlePackageChange} placeholder="e.g. 150" />
                </div>

                <div className={styles.formGroup}>
                  <label>Main Image *</label>
                  <div className={styles.imageInputToggle}>
                    <button type="button" className={packageImageType === 'url' ? styles.activeToggle : ''} onClick={() => setPackageImageType('url')}>URL</button>
                    <button type="button" className={packageImageType === 'file' ? styles.activeToggle : ''} onClick={() => setPackageImageType('file')}>File Upload</button>
                  </div>
                  {packageImageType === 'url' ? (
                    <input key="pkg-url" required type="text" id="image" name="image" value={packageData.image || ''} onChange={handlePackageChange} placeholder="https://..." />
                  ) : (
                    <input key="pkg-file" required type="file" accept="image/*" onChange={(e) => setPackageImageFile(e.target.files?.[0] || null)} />
                  )}
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="images">Gallery Images (One URL per line)</label>
                  <textarea id="images" name="images" value={packageData.images} onChange={handlePackageChange} rows={3}></textarea>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" value={packageData.description} onChange={handlePackageChange} rows={4}></textarea>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="highlights">Highlights (One per line)</label>
                  <textarea id="highlights" name="highlights" value={packageData.highlights} onChange={handlePackageChange} rows={3}></textarea>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="quickFacts">Quick Facts (One per line, e.g. "Duration: 4 hours")</label>
                  <textarea id="quickFacts" name="quickFacts" value={packageData.quickFacts} onChange={handlePackageChange} rows={3}></textarea>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="inclusions">Inclusions (One per line)</label>
                  <textarea id="inclusions" name="inclusions" value={packageData.inclusions} onChange={handlePackageChange} rows={3}></textarea>
                </div>

                <div className={styles.formGroupFull}>
                  <div className={styles.prefSectionWrapper}>
                    <div className={styles.prefSectionHeader}>
                      <label className={styles.prefSectionLabel}>
                        Most Preferable For
                        {selectedPreferences.length > 0 && (
                          <span className={styles.badgeCount}>
                            {selectedPreferences.length} selected
                          </span>
                        )}
                      </label>
                      <span className={styles.prefHelpText}>
                        Select one or more traveller & activity types this package is most suitable for:
                      </span>
                    </div>

                    <div className={styles.prefButtonsContainer}>
                      {preferences.map((pref) => {
                        const isSelected = selectedPreferences.includes(pref.label);
                        return (
                          <button
                            key={pref.id}
                            type="button"
                            onClick={() => togglePreference(pref.label)}
                            className={`${styles.prefItem} ${isSelected ? styles.prefItemSelected : ''}`}
                            title={`Toggle ${pref.label}`}
                          >
                            <div className={styles.prefIconWrapper}>
                              <span className={styles.prefIcon}>{pref.icon}</span>
                              {isSelected && <span className={styles.prefCheckMark}>✓</span>}
                            </div>
                            <span className={styles.prefLabel}>{pref.label}</span>
                            <span className={styles.prefIndicatorLine}></span>
                          </button>
                        );
                      })}

                      {/* "+ Other" Button */}
                      <button
                        type="button"
                        onClick={() => setShowAddPreference(prev => !prev)}
                        className={`${styles.prefItem} ${styles.prefItemAdd} ${showAddPreference ? styles.prefItemAddActive : ''}`}
                        title="Add new category with title and icon"
                      >
                        <div className={styles.prefIconWrapperAdd}>
                          <span className={styles.prefIconAdd}>+</span>
                        </div>
                        <span className={styles.prefLabel}>Other</span>
                        <span className={styles.prefIndicatorLine}></span>
                      </button>
                    </div>

                    {/* Inline form when "+ Other" is clicked */}
                    {showAddPreference && (
                      <div className={styles.newPrefCard}>
                        <div className={styles.newPrefHeader}>
                          <h4>Add Custom Category / Preference</h4>
                          <button
                            type="button"
                            onClick={() => setShowAddPreference(false)}
                            className={styles.closeBtn}
                            title="Close"
                          >
                            ✕
                          </button>
                        </div>
                        <div className={styles.newPrefForm}>
                          {/* 1st Line: Title / Category Name */}
                          <div className={styles.newPrefInputCol}>
                            <label>Title / Category Name *</label>
                            <input
                              type="text"
                              value={newPrefTitle}
                              onChange={(e) => setNewPrefTitle(e.target.value)}
                              placeholder="e.g. Solo Travellers, Luxury, Nightlife, Water Sports..."
                              className={styles.titleInput}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomPreference();
                                }
                              }}
                            />
                          </div>

                          {/* 2nd Line: Icon / Emoji */}
                          <div className={styles.newPrefInputCol}>
                            <label>Icon / Emoji</label>
                            <div className={styles.iconInputRow}>
                              <input
                                type="text"
                                value={newPrefIcon}
                                onChange={(e) => setNewPrefIcon(e.target.value)}
                                placeholder="Enter"
                                className={styles.iconInput}
                                maxLength={4}
                                title="Custom Emoji / Icon"
                              />
                              <div className={styles.quickEmojis}>
                                {['🎒', '🏄', '🏖️', '🏎️', '🚢', '🚁', '👑', '🧗', '🏕️', '🎭', '🍕', '🛥️', '🎟️', '🧘'].map(emoji => (
                                  <button
                                    key={emoji}
                                    type="button"
                                    className={`${styles.quickEmojiBtn} ${newPrefIcon === emoji ? styles.quickEmojiBtnActive : ''}`}
                                    onClick={() => setNewPrefIcon(prev => prev === emoji ? '' : emoji)}
                                    title={`Select ${emoji}`}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className={styles.newPrefActions}>
                            <button
                              type="button"
                              onClick={() => handleAddCustomPreference()}
                              disabled={!newPrefTitle.trim() || isSavingPref}
                              className={styles.addPrefConfirmBtn}
                            >
                              {isSavingPref ? 'Adding...' : 'Add & Select'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowAddPreference(false)}
                              className={styles.addPrefCancelBtn}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="tags">Tags (Comma separated)</label>
                  <input type="text" id="tags" name="tags" value={packageData.tags} onChange={handlePackageChange} placeholder="adventure, family, desert" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="rating">Rating</label>
                  <input type="text" id="rating" name="rating" value={packageData.rating} onChange={handlePackageChange} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="reviewsCount">Reviews Count</label>
                  <input type="number" id="reviewsCount" name="reviewsCount" value={packageData.reviewsCount} onChange={handlePackageChange} />
                </div>

                <div className={styles.formGroupFull}>
                  <div className={styles.checkboxGroup}>
                    <input type="checkbox" id="isPopular" name="isPopular" checked={packageData.isPopular} onChange={handlePackageChange} />
                    <label htmlFor="isPopular" style={{ marginBottom: 0 }}>Mark as Popular Package</label>
                  </div>
                </div>

                <div className={styles.formGroupFull}>
                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Adding...' : 'Add Package'}
                  </button>
                </div>
              </div>
            </form>


          </div>
        )}

        {activeTab === 'allDestinations' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>All Destinations ({destinations.length})</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
                  Complete list of destinations with edit and delete capabilities
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => setActiveTab('destinations')} 
                className={styles.primaryAddBtn}
              >
                + Add New Destination
              </button>
            </div>

            <input
              type="text"
              placeholder="Search destinations by name..."
              value={destSearch}
              onChange={(e) => setDestSearch(e.target.value)}
              className={styles.searchBar}
            />

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Destination Name</th>
                    <th>Tours Count</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {destinations
                    .filter(d => d.title?.toLowerCase().includes(destSearch.toLowerCase()))
                    .map((dest: any) => (
                      <tr key={dest.id || dest.title}>
                        <td style={{ width: '80px' }}>
                          {dest.image ? (
                            <img 
                              src={dest.image} 
                              alt={dest.title} 
                              style={{ width: '60px', height: '44px', objectFit: 'cover', borderRadius: '6px' }} 
                            />
                          ) : (
                            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>No image</span>
                          )}
                        </td>
                        <td style={{ fontWeight: '600', color: '#0f172a', fontSize: '1rem' }}>
                          📍 {dest.title}
                        </td>
                        <td>{dest.toursCount ?? 0} tours</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => setEditingDest({ ...dest })}
                            className={styles.editActionBtn}
                            title="Edit destination"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDestination(dest.id)}
                            className={styles.deleteActionBtn}
                            title="Delete destination"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {destinations.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
                        No destinations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'destinations' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2>Add New Destination</h2>
            </div>
            <form onSubmit={submitDestination}>
              <div className={styles.formGrid}>
                <div className={styles.formGroupFull}>
                  <label htmlFor="destTitle">Destination Name *</label>
                  <input required type="text" id="destTitle" name="title" value={destData.title} onChange={handleDestChange} placeholder="e.g. Ras Al Khaimah" />
                </div>

                <div className={styles.formGroupFull}>
                  <label>Image *</label>
                  <div className={styles.imageInputToggle} style={{ maxWidth: '300px' }}>
                    <button type="button" className={destImageType === 'url' ? styles.activeToggle : ''} onClick={() => setDestImageType('url')}>URL</button>
                    <button type="button" className={destImageType === 'file' ? styles.activeToggle : ''} onClick={() => setDestImageType('file')}>File Upload</button>
                  </div>
                  {destImageType === 'url' ? (
                    <input key="dest-url" required type="text" id="destImage" name="image" value={destData.image || ''} onChange={handleDestChange} placeholder="https://..." />
                  ) : (
                    <input key="dest-file" required type="file" accept="image/*" onChange={(e) => setDestImageFile(e.target.files?.[0] || null)} />
                  )}
                </div>

                <div className={styles.formGroupFull}>
                  <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Adding...' : 'Add Destination'}
                  </button>
                </div>
              </div>
            </form>


          </div>
        )}

        {activeTab === 'bestDeals' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2>Mark Package as Best Deal</h2>
            </div>
            <form onSubmit={submitDeal}>
              <div className={styles.formGrid}>
                <div className={styles.formGroupFull}>
                  <label htmlFor="packageId">Select Package *</label>
                  <select required id="packageId" name="packageId" value={dealData.packageId} onChange={handleDealChange}>
                    <option value="">-- Choose a package --</option>
                    {packages.map(p => (
                      <option key={p.id} value={p.id}>{p.title} ({p.destination})</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroupFull}>
                  <label htmlFor="originalPrice">Original Price (AED) *</label>
                  <input required type="text" id="originalPrice" name="originalPrice" value={dealData.originalPrice} onChange={handleDealChange} placeholder="e.g. 250" />
                  <small style={{ color: '#666', marginTop: '4px' }}>This will show crossed out next to the current price.</small>
                </div>

                <div className={styles.formGroupFull}>
                  <button type="submit" disabled={loading || !dealData.packageId} className={styles.submitBtn}>
                    {loading ? 'Updating...' : 'Set as Best Deal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2>Manage Orders</h2>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>#{order.id.slice(0, 8)}</td>
                      <td>{order.firstName} {order.lastName}</td>
                      <td>
                        <div style={{ fontSize: '0.85rem' }}>{order.email}</div>
                        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{order.phone}</div>
                      </td>
                      <td style={{ fontWeight: '600' }}>AED {order.totalAmount}</td>
                      <td>
                        <span className={`${styles.badge} ${order.status === 'confirmed' ? styles.badgeConfirmed : order.status === 'cancelled' ? styles.badgeCancelled : styles.badgePending}`}>
                          {order.status || 'pending'}
                        </span>
                      </td>
                      <td>
                        {order.status !== 'confirmed' && (
                          <button onClick={() => updateOrderStatus(order.id, 'confirmed')} className={styles.actionBtn}>
                            Confirm
                          </button>
                        )}
                        {order.status !== 'cancelled' && (
                          <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className={styles.actionBtn}>
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center' }}>No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Edit Package Modal */}
        {editingPackage && (
          <div className={styles.modalOverlay} onClick={() => setEditingPackage(null)}>
            <div className={styles.modalDialog} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Edit Package: {editingPackage.title}</h3>
                <button 
                  type="button" 
                  onClick={() => setEditingPackage(null)}
                  className={styles.closeBtn}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveEditPackage}>
                <div className={styles.modalBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label>Package Title *</label>
                      <input 
                        required 
                        type="text" 
                        value={editingPackage.title || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Destination *</label>
                      <select 
                        required 
                        value={editingPackage.destination || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value })}
                      >
                        {destinations.map(d => (
                          <option key={d.id || d.title} value={d.title}>{d.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Price (AED) *</label>
                      <input 
                        required 
                        type="text" 
                        value={editingPackage.price || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Main Image URL *</label>
                      <input 
                        required 
                        type="text" 
                        value={editingPackage.image || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, image: e.target.value })} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Rating</label>
                      <input 
                        type="text" 
                        value={editingPackage.rating || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, rating: e.target.value })} 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Reviews Count</label>
                      <input 
                        type="number" 
                        value={editingPackage.reviewsCount ?? ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, reviewsCount: e.target.value })} 
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label>Description</label>
                      <textarea 
                        rows={3} 
                        value={editingPackage.description || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })} 
                      />
                    </div>
                    <div className={styles.formGroupFull}>
                      <label>Most Preferable For</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                        {preferences.map(pref => {
                          const isSel = (editingPackage.suitableFor || []).includes(pref.label);
                          return (
                            <button
                              key={pref.id}
                              type="button"
                              onClick={() => {
                                const current = editingPackage.suitableFor || [];
                                const next = isSel ? current.filter((p: string) => p !== pref.label) : [...current, pref.label];
                                setEditingPackage({ ...editingPackage, suitableFor: next });
                              }}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 12px',
                                borderRadius: '20px',
                                border: isSel ? '2px solid #007bff' : '1px solid #cbd5e1',
                                background: isSel ? '#eff6ff' : 'white',
                                color: isSel ? '#007bff' : '#475569',
                                fontWeight: isSel ? '600' : '500',
                                cursor: 'pointer',
                                fontSize: '0.85rem'
                              }}
                            >
                              <span>{pref.icon}</span> {pref.label} {isSel && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div className={styles.formGroupFull}>
                      <div className={styles.checkboxGroup}>
                        <input 
                          type="checkbox" 
                          id="editPopular" 
                          checked={!!editingPackage.isPopular} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, isPopular: e.target.checked })} 
                        />
                        <label htmlFor="editPopular" style={{ marginBottom: 0 }}>Mark as Popular</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button 
                    type="button" 
                    onClick={() => setEditingPackage(null)} 
                    className={styles.addPrefCancelBtn}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={editLoading} 
                    className={styles.submitBtn} 
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Destination Modal */}
        {editingDest && (
          <div className={styles.modalOverlay} onClick={() => setEditingDest(null)}>
            <div className={styles.modalDialog} style={{ maxWidth: '540px' }} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Edit Destination: {editingDest.title}</h3>
                <button 
                  type="button" 
                  onClick={() => setEditingDest(null)} 
                  className={styles.closeBtn}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveEditDestination}>
                <div className={styles.modalBody}>
                  <div className={styles.formGroupFull}>
                    <label>Destination Name *</label>
                    <input 
                      required 
                      type="text" 
                      value={editingDest.title || ''} 
                      onChange={(e) => setEditingDest({ ...editingDest, title: e.target.value })} 
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Image URL *</label>
                    <input 
                      required 
                      type="text" 
                      value={editingDest.image || ''} 
                      onChange={(e) => setEditingDest({ ...editingDest, image: e.target.value })} 
                    />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Tours Count</label>
                    <input 
                      type="number" 
                      value={editingDest.toursCount ?? 0} 
                      onChange={(e) => setEditingDest({ ...editingDest, toursCount: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button 
                    type="button" 
                    onClick={() => setEditingDest(null)} 
                    className={styles.addPrefCancelBtn}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={editLoading} 
                    className={styles.submitBtn} 
                    style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                  >
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
