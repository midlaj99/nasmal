'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'packages' | 'destinations' | 'bestDeals' | 'orders'>('overview');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [packages, setPackages] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);

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
      .then(data => setDestinations(data))
      .catch(console.error);

    fetch('/api/orders')
      .then(r => r.json())
      .then(data => setOrders(data))
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
      
      setSuccess(true);
      setDestData({ title: '', image: '' });
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
            className={`${styles.navItem} ${activeTab === 'orders' ? styles.active : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span>🛒</span> Orders
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'packages' ? styles.active : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            <span>🎒</span> Packages
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'destinations' ? styles.active : ''}`}
            onClick={() => setActiveTab('destinations')}
          >
            <span>📍</span> Destinations
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'bestDeals' ? styles.active : ''}`}
            onClick={() => setActiveTab('bestDeals')}
          >
            <span>🔥</span> Best Deals
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
                        <td colSpan={5} style={{ textAlign: 'center' }}>No orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
                  <select required id="destination" name="destination" value={packageData.destination} onChange={handlePackageChange}>
                    <option value="Dubai">Dubai</option>
                    <option value="Abu Dhabi">Abu Dhabi</option>
                    <option value="Sharjah">Sharjah</option>
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
                    <label htmlFor="isPopular" style={{marginBottom: 0}}>Mark as Popular Package</label>
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
                  <small style={{color: '#666', marginTop: '4px'}}>This will show crossed out next to the current price.</small>
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
                        <div style={{fontSize: '0.85rem'}}>{order.email}</div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>{order.phone}</div>
                      </td>
                      <td style={{fontWeight: '600'}}>AED {order.totalAmount}</td>
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
      </main>
    </div>
  );
}
