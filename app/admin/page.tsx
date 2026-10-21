'use client';

import { useState, useEffect, useRef } from 'react';
import { isEmbedVideo, isInstagramUrl, getEmbedUrl } from '@/lib/videoHelper';
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

function getFinalOptionsList(existingOptions: any[] = [], pendingForm: any = null) {
  const result = [...(existingOptions || [])];
  if (pendingForm && pendingForm.title && pendingForm.title.trim()) {
    result.push({
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      title: pendingForm.title.trim(),
      badge: (pendingForm.badge || '').trim(),
      price: (pendingForm.price || '').trim(),
      childPrice: (pendingForm.childPrice || '').trim(),
      inclusions: Array.isArray(pendingForm.inclusions)
        ? pendingForm.inclusions
        : (pendingForm.inclusions || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
      moreDetails: (pendingForm.moreDetails || '').trim(),
      isAvailable: pendingForm.isAvailable !== false,
    });
  }
  return result.map((o: any) => ({
    id: o.id || Date.now() + Math.random().toString(36).substring(2, 6),
    title: o.title,
    badge: o.badge || '',
    inclusions: Array.isArray(o.inclusions) ? o.inclusions : (o.inclusions || '').split('\n').map((s: string) => s.trim()).filter(Boolean),
    moreDetails: o.moreDetails || '',
    price: o.price || '',
    childPrice: o.childPrice || '',
    isAvailable: o.isAvailable !== false,
  }));
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'allPackages' | 'packages' | 'allDestinations' | 'destinations' | 'bestDeals' | 'orders' | 'changeNumber'>('overview');

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = checking, true/false
  const [authView, setAuthView] = useState<'login' | 'forgot_email' | 'forgot_otp' | 'forgot_reset'>('login');
  const [authUsername, setAuthUsername] = useState('nasmaltourism@admin');
  const [authPassword, setAuthPassword] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [authNewPassword, setAuthNewPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authResetToken, setAuthResetToken] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

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
  const modalOverlayMouseDown = useRef<EventTarget | null>(null);

  // Preferable / Suitable For state
  const [preferences, setPreferences] = useState<PreferenceOption[]>(DEFAULT_PREFERENCES);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [showAddPreference, setShowAddPreference] = useState(false);
  const [newPrefTitle, setNewPrefTitle] = useState('');
  const [newPrefIcon, setNewPrefIcon] = useState('');
  const [isSavingPref, setIsSavingPref] = useState(false);

  const [packageImageFile, setPackageImageFile] = useState<File | null>(null);
  const [destImageFile, setDestImageFile] = useState<File | null>(null);
  const [editDestImageFile, setEditDestImageFile] = useState<File | null>(null);

  // WhatsApp Settings & Order Dispatch State
  const [waCountryCode, setWaCountryCode] = useState('+971');
  const [waPhone, setWaPhone] = useState('582659321');
  const [currentWaNumber, setCurrentWaNumber] = useState('+971582659321');
  const [waLoading, setWaLoading] = useState(false);
  const [waSuccessMsg, setWaSuccessMsg] = useState('');
  const [waErrorMsg, setWaErrorMsg] = useState('');

  // Cloudinary Settings State
  const [cldCloudName, setCldCloudName] = useState('woe2kr5p');
  const [cldApiKey, setCldApiKey] = useState('');
  const [cldApiSecret, setCldApiSecret] = useState('');
  const [cldUploadPreset, setCldUploadPreset] = useState('');
  const [cldIsConfigured, setCldIsConfigured] = useState(false);
  const [cldLoading, setCldLoading] = useState(false);
  const [cldSuccessMsg, setCldSuccessMsg] = useState('');
  const [cldErrorMsg, setCldErrorMsg] = useState('');

  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState('');

  // Universal Media & Video Uploader: Uses signed direct-to-Cloudinary upload to bypass Vercel's 4.5MB Serverless function limit
  const uploadImage = async (file: File): Promise<string> => {
    const isVideo = file.type.startsWith('video/');
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);

    // 1. Attempt Signed/Direct Cloudinary upload (bypasses Vercel 4.5MB limit completely)
    try {
      const signRes = await fetch('/api/upload/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceType: isVideo ? 'video' : 'image' })
      });

      if (signRes.ok) {
        const signData = await signRes.json();
        if (signData.isConfigured && signData.cloudName) {
          const cldFormData = new FormData();
          cldFormData.append('file', file);

          if (signData.mode === 'signed') {
            cldFormData.append('api_key', signData.apiKey);
            cldFormData.append('timestamp', String(signData.timestamp));
            cldFormData.append('signature', signData.signature);
            cldFormData.append('folder', signData.folder || 'nasmal_packages');
          } else if (signData.uploadPreset) {
            cldFormData.append('upload_preset', signData.uploadPreset);
            cldFormData.append('folder', signData.folder || 'nasmal_packages');
          }

          const resourceType = signData.resourceType || (isVideo ? 'video' : 'image');
          const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/${resourceType}/upload`;

          const cldRes = await fetch(uploadUrl, {
            method: 'POST',
            body: cldFormData,
          });

          const cldData = await cldRes.json();
          if (!cldRes.ok) {
            throw new Error(cldData.error?.message || 'Direct Cloudinary upload failed');
          }

          let secureUrl = cldData.secure_url || cldData.url;
          if (isVideo && secureUrl.includes('/video/upload/') && !secureUrl.includes('/f_auto')) {
            secureUrl = secureUrl.replace('/video/upload/', '/video/upload/f_auto,q_auto,vc_auto/');
          }
          return secureUrl;
        }
      }
    } catch (directErr: any) {
      console.warn('Direct upload notice:', directErr?.message || directErr);
      if (file.size > 4 * 1024 * 1024) {
        throw new Error(
          `Cloudinary direct upload failed: ${directErr?.message || 'Upload error'}. (File size: ${fileSizeMB}MB. Please verify Cloudinary credentials in Admin Settings -> Cloudinary CDN).`
        );
      }
    }

    // 2. Vercel 4.5MB Payload Guard: prevent 413 error
    if (file.size > 4 * 1024 * 1024) {
      throw new Error(
        `This file is ${fileSizeMB}MB, which exceeds Vercel's 4.5MB serverless limit. Please configure your Cloudinary API Key & Secret in Admin Settings -> "Cloudinary CDN Configuration" to enable direct uploads up to 100MB!`
      );
    }

    // 3. Fallback for files <= 4MB: upload via /api/upload
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      if (res.status === 413) {
        throw new Error(
          `File payload too large (${fileSizeMB}MB) for Vercel Serverless. Please connect Cloudinary in Admin Settings for direct upload.`
        );
      }
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'File upload failed');
    }

    const data = await res.json();
    return data.url;
  };

  const handleMultipleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingGallery(true);
    setGalleryUploadError('');

    try {
      const results = await Promise.allSettled(Array.from(files).map(file => uploadImage(file)));
      const newUrls: string[] = [];
      let failCount = 0;
      let lastErrMsg = '';

      results.forEach(res => {
        if (res.status === 'fulfilled' && res.value) {
          newUrls.push(res.value);
        } else if (res.status === 'rejected') {
          failCount++;
          lastErrMsg = res.reason?.message || 'Upload error';
        }
      });

      if (newUrls.length > 0) {
        setPackageData(prev => {
          const currentList = prev.images
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);
          const combined = [...currentList, ...newUrls];
          return {
            ...prev,
            images: combined.join('\n'),
            image: prev.image || newUrls[0]
          };
        });
      }

      if (failCount > 0) {
        setGalleryUploadError(`${newUrls.length} image(s) uploaded, but ${failCount} failed: ${lastErrMsg}`);
      }
    } catch (err: any) {
      console.error('Gallery upload error:', err);
      setGalleryUploadError(err.message || 'Error uploading gallery images');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setPackageData(prev => {
      const currentList = prev.images
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const filtered = currentList.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered.join('\n'),
      };
    });
  };

  // Edit package upload & gallery states
  const [editPackageImageFile, setEditPackageImageFile] = useState<File | null>(null);
  const [isEditingGalleryUploading, setIsEditingGalleryUploading] = useState(false);
  const [editGalleryUploadError, setEditGalleryUploadError] = useState('');
  const [showEditAddPreference, setShowEditAddPreference] = useState(false);
  const [newEditPrefTitle, setNewEditPrefTitle] = useState('');
  const [newEditPrefIcon, setNewEditPrefIcon] = useState('');

  const handleMultipleEditGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingPackage) return;

    setIsEditingGalleryUploading(true);
    setEditGalleryUploadError('');

    try {
      const results = await Promise.allSettled(Array.from(files).map(file => uploadImage(file)));
      const newUrls: string[] = [];
      let failCount = 0;
      let lastErrMsg = '';

      results.forEach(res => {
        if (res.status === 'fulfilled' && res.value) {
          newUrls.push(res.value);
        } else if (res.status === 'rejected') {
          failCount++;
          lastErrMsg = res.reason?.message || 'Upload error';
        }
      });

      if (newUrls.length > 0) {
        setEditingPackage((prev: any) => {
          if (!prev) return prev;
          const currentList = (typeof prev.images === 'string' ? prev.images : '')
            .split('\n')
            .map((s: string) => s.trim())
            .filter(Boolean);
          const combined = [...currentList, ...newUrls];
          return {
            ...prev,
            images: combined.join('\n'),
            image: prev.image || newUrls[0]
          };
        });
      }

      if (failCount > 0) {
        setEditGalleryUploadError(`${newUrls.length} image(s) uploaded, but ${failCount} failed: ${lastErrMsg}`);
      }
    } catch (err: any) {
      console.error('Edit gallery upload error:', err);
      setEditGalleryUploadError(err.message || 'Error uploading gallery images');
    } finally {
      setIsEditingGalleryUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveEditGalleryImage = (indexToRemove: number) => {
    setEditingPackage((prev: any) => {
      if (!prev) return prev;
      const currentList = (typeof prev.images === 'string' ? prev.images : '')
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean);
      const filtered = currentList.filter((_: string, idx: number) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered.join('\n'),
      };
    });
  };

  const startEditPackage = (pkg: any) => {
    setEditingPackage({
      id: pkg.id,
      title: pkg.title || '',
      destination: pkg.destination || destinations[0]?.title || 'Dubai',
      price: String(pkg.price ?? ''),
      childPrice: String(pkg.childPrice ?? ''),
      childAgeLimit: pkg.childAgeLimit ?? '',
      rating: String(pkg.rating ?? '5.0'),
      reviewsCount: String(pkg.reviewsCount ?? '0'),
      image: pkg.image || '',
      images: Array.isArray(pkg.images) ? pkg.images.join('\n') : (pkg.images || ''),
      description: pkg.description || '',
      highlights: Array.isArray(pkg.highlights) ? pkg.highlights.join('\n') : (pkg.highlights || ''),
      quickFacts: Array.isArray(pkg.quickFacts) ? pkg.quickFacts.join('\n') : (pkg.quickFacts || ''),
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n') : (pkg.inclusions || ''),
      tags: Array.isArray(pkg.tags) ? pkg.tags.join(', ') : (pkg.tags || ''),
      suitableFor: Array.isArray(pkg.suitableFor) ? [...pkg.suitableFor] : [],
      isPopular: !!pkg.isPopular,
      isBestDeal: !!pkg.isBestDeal,
      originalPrice: String(pkg.originalPrice ?? ''),
      hasOptions: Boolean(pkg.hasOptions || (pkg.options && pkg.options.length > 0)),
      optionsSectionTitle: pkg.optionsSectionTitle || 'Available Options',
      options: Array.isArray(pkg.options) ? pkg.options : [],
      video: pkg.video || '',
    });
    setEditPackageImageFile(null);
    setEditGalleryUploadError('');
    setShowEditAddPreference(false);
    setEditModalEditingOptionIndex(null);
    setEditModalOptionForm({
      title: '',
      badge: '',
      price: '',
      childPrice: '',
      inclusions: '',
      moreDetails: '',
      isAvailable: true,
    });
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete order');
      }
      setOrders(prev => prev.filter(o => o.id !== orderId));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error deleting order');
    }
  };

  // Check admin session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/me');
        let data: any = {};
        try {
          const text = await res.text();
          data = text ? JSON.parse(text) : {};
        } catch {
          data = {};
        }
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authUsername.trim(),
          password: authPassword
        })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        if (res.status === 504 || res.status === 502) {
          throw new Error('Database server connection timed out. In MongoDB Atlas, go to "Network Access" -> click "Add IP Address" -> select "Allow Access from Anywhere (0.0.0.0/0)" and save.');
        }
        if (res.status === 500) {
          throw new Error(data.error || 'Database connection error. Please verify your MONGODB_URI in Vercel settings and ensure 0.0.0.0/0 is whitelisted in Atlas Network Access.');
        }
        throw new Error(data.error || 'Authentication failed. Please check your username and password.');
      }

      setIsAuthenticated(true);
      setAuthPassword('');
      setAuthError('');
    } catch (err: any) {
      setAuthError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setIsAuthenticated(false);
      setAuthView('login');
      setAuthPassword('');
      setAuthError('');
      setAuthSuccess('You have been signed out successfully.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/admin/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authUsername.trim() })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch security OTP');
      }

      setAuthSuccess(`A 6-digit security OTP code was sent to ${data.email || 'nasmaltourism@gmail.com'}`);
      setAuthView('forgot_otp');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to dispatch OTP');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/admin/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authUsername.trim(),
          otp: authOtp.trim()
        })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || 'Invalid or expired OTP code');
      }

      setAuthResetToken(data.resetToken);
      setAuthSuccess('Code verified successfully. Enter your new password.');
      setAuthView('forgot_reset');
    } catch (err: any) {
      setAuthError(err.message || 'OTP verification failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authNewPassword.length < 6) {
      setAuthError('New password must be at least 6 characters long.');
      return;
    }
    if (authNewPassword !== authConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    setAuthSuccess('');

    try {
      const res = await fetch('/api/admin/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resetToken: authResetToken,
          newPassword: authNewPassword
        })
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setAuthSuccess('Password has been updated successfully! Please log in with your new password.');
      setAuthView('login');
      setAuthPassword('');
      setAuthNewPassword('');
      setAuthConfirmPassword('');
      setAuthOtp('');
      setAuthResetToken('');
    } catch (err: any) {
      setAuthError(err.message || 'Failed to reset password');
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch('/api/packages?nocache=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPackages(data);
        } else {
          console.error('API /api/packages returned non-array:', data);
          setPackages([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch packages:', err);
        setPackages([]);
      });

    fetch('/api/destinations?nocache=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setDestinations(data);
          setPackageData(prev => ({
            ...prev,
            destination: prev.destination || data[0]?.title || 'Dubai'
          }));
        } else {
          setDestinations([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch destinations:', err);
        setDestinations([]);
      });

    fetch('/api/orders?nocache=' + Date.now(), { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          setOrders([]);
        }
      })
      .catch(err => {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      });

    fetch('/api/preferences')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPreferences(data);
        }
      })
      .catch(console.error);

    fetch('/api/settings/whatsapp')
      .then(r => r.json())
      .then(data => {
        if (data?.fullNumber) {
          setCurrentWaNumber(data.fullNumber);
          if (data.countryCode) setWaCountryCode(data.countryCode);
          if (data.phone) setWaPhone(data.phone);
        }
      })
      .catch(console.error);

    fetch('/api/settings/cloudinary')
      .then(r => r.json())
      .then(data => {
        if (data?.cloudName) setCldCloudName(data.cloudName);
        if (data?.uploadPreset) setCldUploadPreset(data.uploadPreset);
        if (data?.isConfigured) setCldIsConfigured(true);
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const [packageData, setPackageData] = useState({
    title: '',
    destination: 'Dubai',
    price: '',
    childPrice: '',
    childAgeLimit: '',
    rating: '5.0',
    reviewsCount: '0',
    image: '',
    images: '',
    description: '',
    highlights: '',
    quickFacts: '',
    inclusions: '',
    tags: '',
    isPopular: false,
    hasOptions: false,
    optionsSectionTitle: 'Available Options',
    options: [] as Array<{
      id: string;
      title: string;
      badge: string;
      inclusions: string[] | string;
      moreDetails: string;
      price: string;
      childPrice: string;
      isAvailable: boolean;
    }>,
    video: '',
  });

  // Option Form State for Package Creation
  const [newOptionForm, setNewOptionForm] = useState({
    title: '',
    badge: '',
    price: '',
    childPrice: '',
    inclusions: '',
    moreDetails: '',
    isAvailable: true,
  });
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);

  // Option Form State for Package Editing Modal
  const [editModalOptionForm, setEditModalOptionForm] = useState({
    title: '',
    badge: '',
    price: '',
    childPrice: '',
    inclusions: '',
    moreDetails: '',
    isAvailable: true,
  });
  const [editModalEditingOptionIndex, setEditModalEditingOptionIndex] = useState<number | null>(null);

  const handleSaveOptionToPackage = () => {
    if (!newOptionForm.title.trim()) {
      alert('Please enter a title for the option card.');
      return;
    }
    const optObj = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      title: newOptionForm.title.trim(),
      badge: newOptionForm.badge.trim(),
      price: newOptionForm.price.trim(),
      childPrice: newOptionForm.childPrice.trim(),
      inclusions: newOptionForm.inclusions.split('\n').map(s => s.trim()).filter(Boolean),
      moreDetails: newOptionForm.moreDetails.trim(),
      isAvailable: newOptionForm.isAvailable,
    };

    if (editingOptionIndex !== null && editingOptionIndex >= 0) {
      setPackageData(prev => ({
        ...prev,
        options: prev.options.map((item, idx) => idx === editingOptionIndex ? { ...item, ...optObj, id: item.id || optObj.id } : item)
      }));
      setEditingOptionIndex(null);
    } else {
      setPackageData(prev => ({
        ...prev,
        options: [...(prev.options || []), optObj]
      }));
    }

    setNewOptionForm({
      title: '',
      badge: '',
      price: '',
      childPrice: '',
      inclusions: '',
      moreDetails: '',
      isAvailable: true,
    });
  };

  const handleRemoveOptionFromPackage = (idxToRemove: number) => {
    setPackageData(prev => ({
      ...prev,
      options: prev.options.filter((_, idx) => idx !== idxToRemove)
    }));
    if (editingOptionIndex === idxToRemove) {
      setEditingOptionIndex(null);
    }
  };

  const handleEditOptionInPackage = (idxToEdit: number) => {
    const opt = packageData.options[idxToEdit];
    if (!opt) return;
    setNewOptionForm({
      title: opt.title || '',
      badge: opt.badge || '',
      price: opt.price || '',
      childPrice: opt.childPrice || '',
      inclusions: Array.isArray(opt.inclusions) ? opt.inclusions.join('\n') : (opt.inclusions || ''),
      moreDetails: opt.moreDetails || '',
      isAvailable: opt.isAvailable !== false,
    });
    setEditingOptionIndex(idxToEdit);
  };

  const handleSaveOptionToEditModal = () => {
    if (!editModalOptionForm.title.trim()) {
      alert('Please enter a title for the option card.');
      return;
    }
    const optObj = {
      id: Date.now() + Math.random().toString(36).substring(2, 6),
      title: editModalOptionForm.title.trim(),
      badge: editModalOptionForm.badge.trim(),
      price: editModalOptionForm.price.trim(),
      childPrice: editModalOptionForm.childPrice.trim(),
      inclusions: editModalOptionForm.inclusions.split('\n').map(s => s.trim()).filter(Boolean),
      moreDetails: editModalOptionForm.moreDetails.trim(),
      isAvailable: editModalOptionForm.isAvailable,
    };

    if (editModalEditingOptionIndex !== null && editModalEditingOptionIndex >= 0) {
      setEditingPackage((prev: any) => ({
        ...prev,
        options: (prev.options || []).map((item: any, idx: number) => idx === editModalEditingOptionIndex ? { ...item, ...optObj, id: item.id || optObj.id } : item)
      }));
      setEditModalEditingOptionIndex(null);
    } else {
      setEditingPackage((prev: any) => ({
        ...prev,
        options: [...(prev.options || []), optObj]
      }));
    }

    setEditModalOptionForm({
      title: '',
      badge: '',
      price: '',
      childPrice: '',
      inclusions: '',
      moreDetails: '',
      isAvailable: true,
    });
  };

  const handleRemoveOptionFromEditModal = (idxToRemove: number) => {
    setEditingPackage((prev: any) => ({
      ...prev,
      options: (prev.options || []).filter((_: any, idx: number) => idx !== idxToRemove)
    }));
    if (editModalEditingOptionIndex === idxToRemove) {
      setEditModalEditingOptionIndex(null);
    }
  };

  const handleEditOptionInEditModal = (idxToEdit: number) => {
    const opt = editingPackage.options[idxToEdit];
    if (!opt) return;
    setEditModalOptionForm({
      title: opt.title || '',
      badge: opt.badge || '',
      price: opt.price || '',
      childPrice: opt.childPrice || '',
      inclusions: Array.isArray(opt.inclusions) ? opt.inclusions.join('\n') : (opt.inclusions || ''),
      moreDetails: opt.moreDetails || '',
      isAvailable: opt.isAvailable !== false,
    });
    setEditModalEditingOptionIndex(idxToEdit);
  };

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
      if (packageImageFile) {
        finalImageUrl = await uploadImage(packageImageFile);
      }
      if (!finalImageUrl) {
        throw new Error('Please select a main image file to upload.');
      }

      const finalPackageOptions = getFinalOptionsList(packageData.options, newOptionForm);
      const hasAnyOptions = Boolean(packageData.hasOptions || finalPackageOptions.length > 0);

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
        hasOptions: hasAnyOptions,
        optionsSectionTitle: packageData.optionsSectionTitle?.trim() || 'Available Options',
        options: finalPackageOptions,
        video: packageData.video?.trim() || '',
      };

      if (payload.image && payload.images.length === 0) {
        payload.images.push(payload.image);
      }

      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add package');
      }

      const newPkg = await res.json();
      setPackages(prev => [newPkg, ...prev]);

      setSuccess(true);
      setSelectedPreferences([]);
      setPackageData({
        title: '', destination: destinations[0]?.title || 'Dubai', price: '', childPrice: '', childAgeLimit: '', rating: '5.0', reviewsCount: '0',
        image: '', images: '', description: '', highlights: '', quickFacts: '',
        inclusions: '', tags: '', isPopular: false,
        hasOptions: false, optionsSectionTitle: 'Available Options', options: [],
        video: '',
      });
      setNewOptionForm({
        title: '',
        badge: '',
        price: '',
        childPrice: '',
        inclusions: '',
        moreDetails: '',
        isAvailable: true,
      });
      setEditingOptionIndex(null);
      setPackageImageFile(null);
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
      const res = await fetch(`/api/packages/${encodeURIComponent(dealData.packageId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBestDeal: true,
          originalPrice: dealData.originalPrice
        })
      });

      if (!res.ok) throw new Error('Failed to update package');

      setPackages(prev => prev.map(p => p.id === dealData.packageId ? { ...p, isBestDeal: true, originalPrice: dealData.originalPrice } : p));
      setSuccess(true);
      setDealData({ packageId: '', originalPrice: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBestDeal = async (packageId: string) => {
    try {
      const res = await fetch(`/api/packages/${encodeURIComponent(packageId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isBestDeal: false,
          originalPrice: ''
        })
      });
      if (!res.ok) throw new Error('Failed to remove deal');
      setPackages(prev => prev.map(p => p.id === packageId ? { ...p, isBestDeal: false, originalPrice: '' } : p));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error removing best deal');
    }
  };

  const handleSaveWhatsAppNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaLoading(true);
    setWaErrorMsg('');
    setWaSuccessMsg('');
    try {
      const res = await fetch('/api/settings/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: waCountryCode,
          phone: waPhone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update WhatsApp number');
      setCurrentWaNumber(data.fullNumber);
      setWaSuccessMsg(`✓ WhatsApp number updated to ${data.fullNumber}! Customer orders and chat inquiries will now be sent to this number.`);
    } catch (err: any) {
      setWaErrorMsg(err.message || 'Error updating WhatsApp number');
    } finally {
      setWaLoading(false);
    }
  };

  const handleSaveCloudinaryConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setCldLoading(true);
    setCldErrorMsg('');
    setCldSuccessMsg('');
    try {
      const res = await fetch('/api/settings/cloudinary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cloudName: cldCloudName,
          apiKey: cldApiKey,
          apiSecret: cldApiSecret,
          uploadPreset: cldUploadPreset,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Cloudinary configuration');
      setCldIsConfigured(data.isConfigured);
      setCldSuccessMsg('✓ Cloudinary connected! Video and media uploads will now stream via Cloudinary with zero Mongo free tier storage consumed.');
      setCldApiKey('');
      setCldApiSecret('');
    } catch (err: any) {
      setCldErrorMsg(err.message || 'Error saving Cloudinary settings');
    } finally {
      setCldLoading(false);
    }
  };

  const submitDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      let finalImageUrl = destData.image;
      if (destImageFile) {
        finalImageUrl = await uploadImage(destImageFile);
      }
      if (!finalImageUrl) {
        throw new Error('Please select a destination image file to upload.');
      }

      const res = await fetch('/api/destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...destData, image: finalImageUrl })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to add destination');
      }
      const newDest = await res.json();

      // Immediately fetch updated destinations list
      const updatedDestinations = await fetch('/api/destinations?nocache=' + Date.now(), { cache: 'no-store' }).then(r => r.json());
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
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh orders
        const updatedOrders = await fetch('/api/orders?nocache=' + Date.now(), { cache: 'no-store' }).then(r => r.json());
        setOrders(updatedOrders);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await fetch(`/api/packages/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete package');
      }
      setPackages(prev => prev.filter(p => p.id !== id));
      if (editingPackage?.id === id) {
        setEditingPackage(null);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error deleting package');
    }
  };

  const handleSaveEditPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage) return;
    setEditLoading(true);
    setError('');
    try {
      let finalImageUrl = editingPackage.image;
      if (editPackageImageFile) {
        finalImageUrl = await uploadImage(editPackageImageFile);
      }

      const finalEditPackageOptions = getFinalOptionsList(editingPackage.options, editModalOptionForm);
      const hasAnyEditOptions = Boolean(editingPackage.hasOptions || finalEditPackageOptions.length > 0);

      const payload = {
        title: editingPackage.title,
        destination: editingPackage.destination,
        price: editingPackage.price,
        childPrice: editingPackage.childPrice ? String(editingPackage.childPrice).trim() : '',
        childAgeLimit: editingPackage.childAgeLimit ? String(editingPackage.childAgeLimit).trim() : '',
        image: finalImageUrl,
        images: typeof editingPackage.images === 'string'
          ? editingPackage.images.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : (editingPackage.images || []),
        rating: editingPackage.rating,
        reviewsCount: parseInt(editingPackage.reviewsCount) || 0,
        description: editingPackage.description,
        highlights: typeof editingPackage.highlights === 'string'
          ? editingPackage.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : (editingPackage.highlights || []),
        quickFacts: typeof editingPackage.quickFacts === 'string'
          ? editingPackage.quickFacts.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : (editingPackage.quickFacts || []),
        inclusions: typeof editingPackage.inclusions === 'string'
          ? editingPackage.inclusions.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : (editingPackage.inclusions || []),
        tags: typeof editingPackage.tags === 'string'
          ? editingPackage.tags.split(',').map((s: string) => s.trim()).filter(Boolean)
          : (editingPackage.tags || []),
        suitableFor: editingPackage.suitableFor || [],
        isPopular: !!editingPackage.isPopular,
        isBestDeal: !!editingPackage.isBestDeal,
        originalPrice: editingPackage.originalPrice || '',
        hasOptions: hasAnyEditOptions,
        optionsSectionTitle: editingPackage.optionsSectionTitle?.trim() || 'Available Options',
        options: finalEditPackageOptions,
        video: typeof editingPackage.video === 'string' ? editingPackage.video.trim() : '',
      };

      if (payload.image && payload.images.length === 0) {
        payload.images.push(payload.image);
      }

      const res = await fetch(`/api/packages/${encodeURIComponent(editingPackage.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update package');
      }
      const updated = await res.json();
      setPackages(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingPackage(null);
      setEditPackageImageFile(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error updating package');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteDestination = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this destination? Any packages linked to it will also be removed.')) return;
    try {
      const res = await fetch(`/api/destinations/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete destination');
      }
      const targetDest = destinations.find(d => d.id === id);
      setDestinations(prev => prev.filter(d => d.id !== id));
      if (targetDest) {
        setPackages(prev => prev.filter(p => p.destination?.toLowerCase().trim() !== targetDest.title?.toLowerCase().trim()));
      }
      if (editingDest?.id === id) {
        setEditingDest(null);
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error deleting destination');
    }
  };

  const handleSaveEditDestination = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    setEditLoading(true);
    setError('');
    try {
      let finalImageUrl = editingDest.image;
      if (editDestImageFile) {
        finalImageUrl = await uploadImage(editDestImageFile);
      }

      const res = await fetch(`/api/destinations/${encodeURIComponent(editingDest.id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingDest,
          image: finalImageUrl
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update destination');
      }
      const updated = await res.json();
      setDestinations(prev => prev.map(d => d.id === updated.id ? updated : d));
      setEditingDest(null);
      setEditDestImageFile(null);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Error updating destination');
    } finally {
      setEditLoading(false);
    }
  };

  // Loading state while checking active admin session
  if (isAuthenticated === null) {
    return (
      <div className={styles.authOverlay}>
        <div style={{ textAlign: 'center', color: '#64748b', fontSize: '1rem', fontWeight: 600 }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔒</div>
          Verifying security session...
        </div>
      </div>
    );
  }

  // White Themed Administrative Authentication Portal
  if (!isAuthenticated) {
    return (
      <div className={styles.authOverlay}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <div className={styles.authBadge}>
              <span>🛡️</span> Security Gateway
            </div>
            <h1 className={styles.authTitle}>Nasmal Admin</h1>
            <p className={styles.authSubtitle}>
              {authView === 'login' && 'Please sign in to access the administrator console.'}
              {authView === 'forgot_email' && 'Enter your admin username to receive a security OTP via email.'}
              {authView === 'forgot_otp' && 'Enter the 6-digit OTP code sent to nasmaltourism@gmail.com.'}
              {authView === 'forgot_reset' && 'Set a strong new password for your administrator account.'}
            </p>
          </div>

          {authError && (
            <div className={styles.authAlertError}>
              <span>⚠️</span>
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className={styles.authAlertSuccess}>
              <span>✅</span>
              <span>{authSuccess}</span>
            </div>
          )}

          {/* VIEW 1: LOGIN FORM */}
          {authView === 'login' && (
            <form onSubmit={handleAdminLogin} className={styles.authForm}>
              <div className={styles.authField}>
                <label className={styles.authLabel}>Admin Username / Identifier</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="nasmaltourism@admin"
                  className={styles.authInput}
                  autoComplete="username"
                />
              </div>

              <div className={styles.authField}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.authLabel}>Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError('');
                      setAuthSuccess('');
                      setAuthView('forgot_email');
                    }}
                    className={styles.authLink}
                  >
                    Forgot Password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={styles.authInput}
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={styles.authButton}
              >
                {authLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard →'}
              </button>
            </form>
          )}

          {/* VIEW 2: FORGOT PASSWORD - REQUEST OTP */}
          {authView === 'forgot_email' && (
            <form onSubmit={handleSendOtp} className={styles.authForm}>
              <div className={styles.authField}>
                <label className={styles.authLabel}>Administrator Username</label>
                <input
                  type="text"
                  required
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  placeholder="nasmaltourism@admin"
                  className={styles.authInput}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={styles.authButton}
              >
                {authLoading ? 'Dispatching OTP...' : 'Send Security OTP to Email ✉️'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setAuthView('login');
                }}
                className={styles.authSecondaryButton}
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* VIEW 3: VERIFY OTP */}
          {authView === 'forgot_otp' && (
            <form onSubmit={handleVerifyOtp} className={styles.authForm}>
              <div className={styles.authField}>
                <label className={styles.authLabel}>Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={authOtp}
                  onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className={`${styles.authInput} ${styles.authOtpInput}`}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={authLoading || authOtp.length !== 6}
                className={styles.authButton}
              >
                {authLoading ? 'Verifying OTP...' : 'Verify OTP Code →'}
              </button>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  disabled={authLoading}
                  onClick={handleSendOtp}
                  className={styles.authSecondaryButton}
                  style={{ flex: 1 }}
                >
                  Resend OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthError('');
                    setAuthSuccess('');
                    setAuthView('login');
                  }}
                  className={styles.authSecondaryButton}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* VIEW 4: RESET PASSWORD */}
          {authView === 'forgot_reset' && (
            <form onSubmit={handleResetPassword} className={styles.authForm}>
              <div className={styles.authField}>
                <label className={styles.authLabel}>New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authNewPassword}
                  onChange={(e) => setAuthNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={styles.authInput}
                />
              </div>

              <div className={styles.authField}>
                <label className={styles.authLabel}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={authConfirmPassword}
                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={styles.authInput}
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className={styles.authButton}
              >
                {authLoading ? 'Updating Password...' : 'Save New Password & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError('');
                  setAuthSuccess('');
                  setAuthView('login');
                }}
                className={styles.authSecondaryButton}
              >
                Cancel
              </button>
            </form>
          )}

          <div className={styles.authFooter}>
            <span className={styles.authFooterLock}>🔒</span>
            <span>256-Bit Encrypted TLS Session • Zero-Trust Protected</span>
          </div>
        </div>
      </div>
    );
  }

  const safePackages = Array.isArray(packages) ? packages : [];
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeDestinations = Array.isArray(destinations) ? destinations : [];

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
          <button
            className={`${styles.navItem} ${activeTab === 'changeNumber' ? styles.active : ''}`}
            onClick={() => setActiveTab('changeNumber')}
          >
            <span>📞</span> Change Number
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            onClick={handleAdminLogout}
            className={styles.logoutButton}
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>Admin Portal</h1>
              <p>Welcome back, <strong>{authUsername}</strong>! Here's what's happening today.</p>
            </div>
            <button
              type="button"
              onClick={handleAdminLogout}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#64748b',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Sign Out
            </button>
          </div>
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
                  <p>{safePackages.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📍</div>
                <div className={styles.statInfo}>
                  <h3>Destinations</h3>
                  <p>{safeDestinations.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🛍️</div>
                <div className={styles.statInfo}>
                  <h3>Total Orders</h3>
                  <p>{safeOrders.length}</p>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>🔥</div>
                <div className={styles.statInfo}>
                  <h3>Best Deals</h3>
                  <p>{safePackages.filter(p => p.isBestDeal).length}</p>
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
                    {safeOrders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id.slice(0, 8)}</td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{order.firstName} {order.lastName}</div>
                          {order.packageTitle && <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{order.packageTitle}</div>}
                        </td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td style={{ fontWeight: '600' }}>AED {order.totalPrice ?? order.totalAmount ?? 0}</td>
                        <td>
                          <span className={`${styles.badge} ${order.status?.toLowerCase() === 'confirmed' ? styles.badgeConfirmed : order.status?.toLowerCase() === 'cancelled' ? styles.badgeCancelled : styles.badgePending}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {safeOrders.length === 0 && (
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
                <h2>All Packages ({safePackages.length})</h2>
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
                  {safePackages
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
                            onClick={() => startEditPackage(pkg)}
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
                  {safePackages.length === 0 && (
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
                    {safeDestinations.map((d: any) => (
                      <option key={d.id || d.title} value={d.title}>
                        {d.title}
                      </option>
                    ))}
                    {safeDestinations.length === 0 && (
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
                  <label htmlFor="childPrice">Child Price (AED) <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                  <input type="text" id="childPrice" name="childPrice" value={packageData.childPrice} onChange={handlePackageChange} placeholder="e.g. 100" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="childAgeLimit">Child Age Limit <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                  <input type="text" id="childAgeLimit" name="childAgeLimit" value={packageData.childAgeLimit} onChange={handlePackageChange} placeholder="e.g. 3 - 12 years" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="pkg-file">Main Image * (Upload File from PC)</label>
                  <input 
                    key="pkg-file" 
                    required={!packageData.image}
                    type="file" 
                    id="pkg-file"
                    accept="image/*" 
                    onChange={(e) => setPackageImageFile(e.target.files?.[0] || null)} 
                  />
                  {packageImageFile && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#047857' }}>
                      Selected: {packageImageFile.name}
                    </div>
                  )}
                </div>

                <div className={styles.formGroupFull}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ margin: 0 }}>Gallery Images (Upload Multiple from PC)</label>
                    {isUploadingGallery && (
                      <span className={styles.galleryUploadLoading}>
                        ⏳ Uploading images...
                      </span>
                    )}
                  </div>

                  {galleryUploadError && (
                    <div style={{ color: '#e11d48', fontSize: '0.85rem', marginBottom: '8px' }}>
                      ⚠️ {galleryUploadError}
                    </div>
                  )}

                  {/* Multiple file upload from PC button */}
                  <div className={styles.galleryUploadWrapper}>
                    <div className={styles.galleryUploadHeader}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                          Upload Gallery Images from PC
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                          Choose one or multiple image files directly from your computer.
                        </div>
                      </div>

                      <div>
                        <input
                          type="file"
                          id="galleryMultiInput"
                          multiple
                          accept="image/*"
                          onChange={handleMultipleGalleryUpload}
                          style={{ display: 'none' }}
                          disabled={isUploadingGallery}
                        />
                        <label
                          htmlFor="galleryMultiInput"
                          className={styles.galleryUploadBtn}
                          style={{ opacity: isUploadingGallery ? 0.6 : 1, cursor: isUploadingGallery ? 'wait' : 'pointer' }}
                        >
                          {isUploadingGallery ? '⏳ Uploading...' : '📁 Choose Files (Multiple)'}
                        </label>
                      </div>
                    </div>

                    {/* Previews of uploaded gallery images with 1-click delete */}
                    {packageData.images.split('\n').map(s => s.trim()).filter(Boolean).length > 0 && (
                      <div className={styles.galleryPreviewGrid}>
                        {packageData.images
                          .split('\n')
                          .map(s => s.trim())
                          .filter(Boolean)
                          .map((imgUrl, idx) => (
                            <div key={idx} className={styles.galleryPreviewCard} title={imgUrl}>
                              <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(idx)}
                                className={styles.galleryRemoveBtn}
                                title="Remove image"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tour Video Section (YouTube & Instagram Links) */}
                <div className={styles.formGroupFull}>
                  <label htmlFor="packageVideoInput" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>Tour / Promotional Video (YouTube or Instagram Link)</span>
                    <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
                      ✓ Interactive Iframe Player
                    </span>
                  </label>

                  <div className={styles.videoAdminCard}>
                    <div className={styles.videoAdminHeader}>
                      <div>
                        <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>▶ YouTube & 📸 Instagram Video Embed</span>
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px', lineHeight: '1.4' }}>
                          Paste any YouTube link (Standard, Shorts, youtu.be) or Instagram link (Reel, Post, TV). It will display directly in an ultra-fast, responsive iframe on the package details page with zero loading lag!
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '12px' }}>
                      <input
                        type="text"
                        id="packageVideoInput"
                        name="video"
                        value={packageData.video || ''}
                        onChange={handlePackageChange}
                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                        className={styles.videoUrlInputField}
                      />
                    </div>

                    {/* Quick Format Help Chips */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                      <span style={{ fontSize: '0.78rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px' }}>
                        ▶ YouTube: watch?v=..., youtu.be/..., shorts/...
                      </span>
                      <span style={{ fontSize: '0.78rem', background: '#fdf2f8', color: '#db2777', padding: '3px 8px', borderRadius: '4px' }}>
                        📸 Instagram: instagram.com/reel/... or /p/...
                      </span>
                    </div>

                    {/* Live Preview if video exists */}
                    {packageData.video && (
                      <div className={styles.videoAdminPreviewWrapper}>
                        <div className={styles.videoAdminPreviewHeader}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                            Live Iframe Preview
                          </span>
                          <button
                            type="button"
                            onClick={() => setPackageData(prev => ({ ...prev, video: '' }))}
                            className={styles.videoAdminRemoveBtn}
                          >
                            ✕ Remove Video
                          </button>
                        </div>
                        <div className={styles.videoAdminPreviewContainer}>
                          {isEmbedVideo(packageData.video) ? (
                            isInstagramUrl(packageData.video) ? (
                              <div className={styles.videoAdminInstagramContainer}>
                                <iframe
                                  src={getEmbedUrl(packageData.video)}
                                  title="Instagram preview"
                                  className={styles.videoAdminInstagramIframe}
                                  scrolling="no"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  allowFullScreen
                                />
                              </div>
                            ) : (
                              <iframe
                                src={getEmbedUrl(packageData.video)}
                                title="Video preview"
                                className={styles.videoAdminIframe}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            )
                          ) : (
                            <video
                              src={packageData.video}
                              controls
                              className={styles.videoAdminNative}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
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

                {/* Available Options / Sub-categories Section (Optional) */}
                <div className={styles.formGroupFull}>
                  <div className={styles.optionsAdminSection}>
                    <div className={styles.optionsAdminHeader}>
                      <div className={styles.optionsAdminTitle}>
                        <span>🏷️ Sub-Categories / Available Options</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>(Optional)</span>
                      </div>
                      <div className={styles.optionsAdminHelp}>
                        Add variations or sub-packages (e.g. &quot;At The Top + Sunrise + Morning Treat&quot;, VIP access, Prime Hours) that appear in the &quot;Available Options&quot; section above the Overview on the package details page.
                      </div>
                    </div>

                    <div className={styles.optionsToggleBox}>
                      <input
                        type="checkbox"
                        id="enableOptions"
                        name="hasOptions"
                        checked={!!packageData.hasOptions}
                        onChange={(e) => setPackageData({ ...packageData, hasOptions: e.target.checked })}
                      />
                      <label htmlFor="enableOptions" className={styles.optionsToggleLabel}>
                        Enable Sub-categories / Available Options section for this package
                      </label>
                    </div>

                    {packageData.hasOptions && (
                      <div>
                        {/* Section Header Title */}
                        <div style={{ marginBottom: '16px' }}>
                          <label htmlFor="optionsSectionTitle" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                            Section Title (as displayed on customer page)
                          </label>
                          <input
                            type="text"
                            id="optionsSectionTitle"
                            value={packageData.optionsSectionTitle}
                            onChange={(e) => setPackageData({ ...packageData, optionsSectionTitle: e.target.value })}
                            placeholder="Available Options"
                            style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                          />
                        </div>

                        {/* List of Current Options */}
                        <div style={{ marginBottom: '14px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          Current Options ({packageData.options.length}):
                        </div>

                        {packageData.options.length === 0 ? (
                          <div style={{ padding: '16px', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginBottom: '18px' }}>
                            No options added yet. Fill in the builder form below to add your first option card.
                          </div>
                        ) : (
                          <div className={styles.optionsListPreview}>
                            {packageData.options.map((opt: any, idx: number) => {
                              const inclusionsArr = Array.isArray(opt.inclusions)
                                ? opt.inclusions
                                : (opt.inclusions || '').split('\n').filter(Boolean);
                              const isAvail = opt.isAvailable !== false;

                              return (
                                <div key={opt.id || idx} className={styles.optionPreviewCard}>
                                  <div className={styles.optionPreviewHeader}>
                                    {opt.badge && (
                                      <span className={styles.optionPreviewBadge}>
                                        🔥 {opt.badge}
                                      </span>
                                    )}
                                    <div className={styles.optionPreviewTitle}>{opt.title}</div>
                                  </div>

                                  <div className={styles.optionPreviewBody}>
                                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>Inclusions:</div>
                                    <ul className={styles.optionPreviewInclusions}>
                                      {inclusionsArr.length > 0 ? (
                                        inclusionsArr.slice(0, 3).map((inc: string, iIdx: number) => (
                                          <li key={iIdx}>{inc}</li>
                                        ))
                                      ) : (
                                        <li>Standard tour package inclusions</li>
                                      )}
                                      {inclusionsArr.length > 3 && (
                                        <li style={{ color: '#047857', fontWeight: 600 }}>+{inclusionsArr.length - 3} more</li>
                                      )}
                                    </ul>

                                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#475569' }}>
                                      Price: <strong style={{ color: '#047857' }}>AED {opt.price || packageData.price || '0'}</strong>
                                      {opt.childPrice && <span> • Child: AED {opt.childPrice}</span>}
                                    </div>
                                  </div>

                                  <div className={styles.optionPreviewFooter}>
                                    <span className={`${styles.optionAvailTag} ${isAvail ? styles.optionAvailYes : styles.optionAvailNo}`}>
                                      {isAvail ? '✓ Available' : '✕ Not Available'}
                                    </span>

                                    <div className={styles.optionPreviewActions}>
                                      <button
                                        type="button"
                                        className={styles.optionMiniBtn}
                                        onClick={() => handleEditOptionInPackage(idx)}
                                      >
                                        Edit
                                      </button>
                                      <button
                                        type="button"
                                        className={`${styles.optionMiniBtn} ${styles.optionMiniBtnDanger}`}
                                        onClick={() => handleRemoveOptionFromPackage(idx)}
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Add / Edit Option Card Builder */}
                        <div className={styles.optionBuilderBox}>
                          <div className={styles.optionBuilderHeader}>
                            <span>{editingOptionIndex !== null ? '✏️ Edit Option Card' : '➕ Add Option / Sub-Category Card'}</span>
                            {editingOptionIndex !== null && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingOptionIndex(null);
                                  setNewOptionForm({
                                    title: '',
                                    badge: '',
                                    price: '',
                                    childPrice: '',
                                    inclusions: '',
                                    moreDetails: '',
                                    isAvailable: true,
                                  });
                                }}
                                style={{ background: 'none', border: 'none', color: '#e11d48', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                              >
                                Cancel Edit
                              </button>
                            )}
                          </div>

                          <div className={styles.optionFieldsGrid}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                Option Title / Name *
                              </label>
                              <input
                                type="text"
                                value={newOptionForm.title}
                                onChange={(e) => setNewOptionForm({ ...newOptionForm, title: e.target.value })}
                                placeholder="e.g. At The Top + Sunrise + Morning Treat"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                Badge Tag (Optional)
                              </label>
                              <input
                                type="text"
                                value={newOptionForm.badge}
                                onChange={(e) => setNewOptionForm({ ...newOptionForm, badge: e.target.value })}
                                placeholder="e.g. Prime Hours, Best Value, VIP Pass"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                              />
                              <div className={styles.badgePillsRow}>
                                {['Prime Hours', 'Best Value', 'Popular', 'VIP Pass', 'Instant Confirmation'].map(b => (
                                  <button
                                    key={b}
                                    type="button"
                                    className={`${styles.badgePillBtn} ${newOptionForm.badge === b ? styles.badgePillBtnActive : ''}`}
                                    onClick={() => setNewOptionForm({ ...newOptionForm, badge: newOptionForm.badge === b ? '' : b })}
                                  >
                                    {b}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                Adult Price (AED) <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={newOptionForm.price}
                                onChange={(e) => setNewOptionForm({ ...newOptionForm, price: e.target.value })}
                                placeholder="Leave empty for package price (AED)"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                Child Price (AED) <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Optional)</span>
                              </label>
                              <input
                                type="text"
                                value={newOptionForm.childPrice}
                                onChange={(e) => setNewOptionForm({ ...newOptionForm, childPrice: e.target.value })}
                                placeholder="e.g. 100"
                                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                              />
                            </div>
                          </div>

                          <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              Inclusions (One per line)
                            </label>
                            <textarea
                              rows={3}
                              value={newOptionForm.inclusions}
                              onChange={(e) => setNewOptionForm({ ...newOptionForm, inclusions: e.target.value })}
                              placeholder={`Admission tickets to 124 & 125 Floors of the Burj Khalifa.\nAccess to the telescopes on 124th floor`}
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                            />
                          </div>

                          <div style={{ marginBottom: '14px' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              More Details / Description (Revealed on clicking &quot;More details ⌄&quot;)
                            </label>
                            <textarea
                              rows={2}
                              value={newOptionForm.moreDetails}
                              onChange={(e) => setNewOptionForm({ ...newOptionForm, moreDetails: e.target.value })}
                              placeholder="Additional terms, meeting instructions, or special details for this option..."
                              style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                            />
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: newOptionForm.isAvailable ? '#047857' : '#e11d48' }}>
                              <input
                                type="checkbox"
                                checked={newOptionForm.isAvailable}
                                onChange={(e) => setNewOptionForm({ ...newOptionForm, isAvailable: e.target.checked })}
                                style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }}
                              />
                              {newOptionForm.isAvailable ? '✓ Status: Available' : '✕ Status: Not Available (Shows "Not Available" badge)'}
                            </label>

                            <button
                              type="button"
                              onClick={handleSaveOptionToPackage}
                              style={{
                                background: '#047857',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 18px',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {editingOptionIndex !== null ? '✓ Update Option' : '+ Add Option Card'}
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
                <h2>All Destinations ({safeDestinations.length})</h2>
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
                  {safeDestinations
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
                            onClick={() => {
                              setEditingDest({ ...dest });
                              setEditDestImageFile(null);
                            }}
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
                  {safeDestinations.length === 0 && (
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
                  <label htmlFor="dest-file">Destination Image * (Upload File from PC)</label>
                  <input 
                    key="dest-file" 
                    required 
                    type="file" 
                    id="dest-file"
                    accept="image/*" 
                    onChange={(e) => setDestImageFile(e.target.files?.[0] || null)} 
                  />
                  {destImageFile && (
                    <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#047857' }}>
                      Selected: {destImageFile.name}
                    </div>
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
                    {safePackages
                      .filter(p => !p.isBestDeal && safeDestinations.some(d => d.title?.toLowerCase().trim() === (p.destination || '').toLowerCase().trim()))
                      .map(p => (
                        <option key={p.id} value={p.id}>{p.title} ({p.destination}) - AED {p.price}</option>
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

            {/* Currently Active Best Deals List */}
            <div style={{ marginTop: '36px' }}>
              <div className={styles.sectionHeader}>
                <h3>Currently Active Best Deals ({safePackages.filter(p => p.isBestDeal).length})</h3>
              </div>
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Package</th>
                      <th>Destination</th>
                      <th>Deal Price</th>
                      <th>Original Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {safePackages.filter(p => p.isBestDeal).map((pkg) => (
                      <tr key={pkg.id}>
                        <td style={{ fontWeight: 600 }}>{pkg.title}</td>
                        <td>{pkg.destination}</td>
                        <td style={{ color: '#047857', fontWeight: 700 }}>AED {pkg.price}</td>
                        <td style={{ textDecoration: 'line-through', color: '#94a3b8' }}>AED {pkg.originalPrice || '-'}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveBestDeal(pkg.id)}
                            className={styles.deleteActionBtn}
                            title="Remove deal status"
                          >
                            ✕ Remove Deal
                          </button>
                        </td>
                      </tr>
                    ))}
                    {safePackages.filter(p => p.isBestDeal).length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', color: '#64748b' }}>
                          No active best deals. Select a package above to feature it in the Best Deals carousel!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
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
                  {safeOrders.map((order) => {
                    const isConfirmed = order.status?.toLowerCase() === 'confirmed';
                    const isCancelled = order.status?.toLowerCase() === 'cancelled';
                    return (
                      <tr key={order.id}>
                        <td>#{order.id.slice(0, 8)}</td>
                        <td>
                          <div style={{ fontWeight: '600', color: '#0f172a' }}>{order.firstName} {order.lastName}</div>
                          {order.packageTitle && <div style={{ fontSize: '0.8rem', color: '#64748b' }}>📦 {order.packageTitle}</div>}
                          {order.visitDate && <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>📅 {order.visitDate}</div>}
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem' }}>{order.email}</div>
                          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{order.phone}</div>
                        </td>
                        <td style={{ fontWeight: '600' }}>AED {order.totalPrice ?? order.totalAmount ?? 0}</td>
                        <td>
                          <span className={`${styles.badge} ${isConfirmed ? styles.badgeConfirmed : isCancelled ? styles.badgeCancelled : styles.badgePending}`}>
                            {order.status || 'Pending'}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {!isConfirmed && (
                            <button onClick={() => updateOrderStatus(order.id, 'Confirmed')} className={styles.actionBtn}>
                              Confirm
                            </button>
                          )}
                          {!isCancelled && (
                            <button onClick={() => updateOrderStatus(order.id, 'Cancelled')} className={styles.actionBtn}>
                              Cancel
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteOrder(order.id)}
                            className={styles.deleteActionBtn}
                            title="Delete this order"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {safeOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center' }}>No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Change Number (WhatsApp & Order Dispatch Number) Section */}
        {activeTab === 'changeNumber' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <h2>📞 WhatsApp Order Dispatch & Contact Number</h2>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                All customer orders from the checkout page and floating chat buttons will be instantly sent to this WhatsApp number. Supports any country worldwide.
              </p>
            </div>

            {waSuccessMsg && (
              <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#047857', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
                {waSuccessMsg}
              </div>
            )}

            {waErrorMsg && (
              <div style={{ padding: '12px 16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#e11d48', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
                {waErrorMsg}
              </div>
            )}

            {/* Current Active Number Card */}
            <div className={styles.waCurrentCard}>
              <div className={styles.waCurrentInfo}>
                <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Current Active Order Number
                </div>
                <div className={styles.waCurrentDigits}>
                  <span>💬</span>
                  <span>{currentWaNumber}</span>
                  <span className={styles.waActiveBadge}>✓ Live & Dispatched</span>
                </div>
              </div>
              <a
                href={`https://wa.me/${currentWaNumber.replace(/[^0-9]/g, '')}?text=Test%20order%20dispatch%20check`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waTestBtn}
                title="Open test chat in WhatsApp"
              >
                <span>💬 Test WhatsApp Link</span>
                <span style={{ fontSize: '0.75rem' }}>↗</span>
              </a>
            </div>

            {/* Change Number Form */}
            <form onSubmit={handleSaveWhatsAppNumber} className={styles.waFormCard}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '14px' }}>
                Change to a New Number
              </h3>

              <div className={styles.optionFieldsGrid}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Country Dialing Code *
                  </label>
                  <select
                    value={waCountryCode}
                    onChange={(e) => setWaCountryCode(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#ffffff' }}
                  >
                    <option value="+971">🇦🇪 +971 (United Arab Emirates)</option>
                    <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                    <option value="+968">🇴🇲 +968 (Oman)</option>
                    <option value="+974">🇶🇦 +974 (Qatar)</option>
                    <option value="+965">🇰🇼 +965 (Kuwait)</option>
                    <option value="+973">🇧🇭 +973 (Bahrain)</option>
                    <option value="+91">🇮🇳 +91 (India)</option>
                    <option value="+1">🇺🇸 +1 (USA / Canada)</option>
                    <option value="+44">🇬🇧 +44 (United Kingdom)</option>
                    <option value="+49">🇩🇪 +49 (Germany)</option>
                    <option value="+33">🇫🇷 +33 (France)</option>
                    <option value="+7">🇷🇺 +7 (Russia)</option>
                    <option value="+86">🇨🇳 +86 (China)</option>
                    <option value="+61">🇦🇺 +61 (Australia)</option>
                    <option value="+65">🇸🇬 +65 (Singapore)</option>
                    <option value="+60">🇲🇾 +60 (Malaysia)</option>
                    <option value="+92">🇵🇰 +92 (Pakistan)</option>
                    <option value="+880">🇧🇩 +880 (Bangladesh)</option>
                    <option value="+20">🇪🇬 +20 (Egypt)</option>
                    <option value="+962">🇯🇴 +962 (Jordan)</option>
                    <option value="+961">🇱🇧 +961 (Lebanon)</option>
                    <option value="+90">🇹🇷 +90 (Turkey)</option>
                    <option value="+39">🇮🇹 +39 (Italy)</option>
                    <option value="+34">🇪🇸 +34 (Spain)</option>
                    <option value="+31">🇳🇱 +31 (Netherlands)</option>
                    <option value="+41">🇨🇭 +41 (Switzerland)</option>
                    <option value="+27">🇿🇦 +27 (South Africa)</option>
                    <option value="+63">🇵🇭 +63 (Philippines)</option>
                    <option value="+62">🇮🇩 +62 (Indonesia)</option>
                    <option value="+66">🇹🇭 +66 (Thailand)</option>
                    <option value="+84">🇻🇳 +84 (Vietnam)</option>
                    <option value="+81">🇯🇵 +81 (Japan)</option>
                    <option value="+82">🇰🇷 +82 (South Korea)</option>
                    <option value="+55">🇧🇷 +55 (Brazil)</option>
                    <option value="+52">🇲🇽 +52 (Mexico)</option>
                    <option value="+234">🇳🇬 +234 (Nigeria)</option>
                    <option value="+254">🇰🇪 +254 (Kenya)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Phone Number (Without country code) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="e.g. 582659321"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                  <small style={{ color: '#64748b', fontSize: '0.78rem', display: 'block', marginTop: '4px' }}>
                    Enter digits only or with spaces (e.g. 58 265 9321 or 9876543210).
                  </small>
                </div>
              </div>

              {/* Real-time Preview */}
              <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px dashed #cbd5e1', marginBottom: '18px', fontSize: '0.85rem', wordBreak: 'break-all', overflowWrap: 'anywhere' }}>
                <span style={{ color: '#64748b' }}>Resulting International Number: </span>
                <strong style={{ color: '#047857' }}>
                  {waCountryCode}{waPhone.replace(/[^0-9]/g, '')}
                </strong>
                <span style={{ color: '#94a3b8', marginLeft: '8px', wordBreak: 'break-all', display: 'inline-block' }}>
                  (Target: https://wa.me/{waCountryCode.replace(/[^0-9]/g, '')}{waPhone.replace(/[^0-9]/g, '')})
                </span>
              </div>

              <button
                type="submit"
                disabled={waLoading || !waPhone.trim()}
                className={styles.submitBtn}
                style={{ width: 'auto', padding: '10px 24px' }}
              >
                {waLoading ? 'Saving...' : '💾 Save WhatsApp Number'}
              </button>
            </form>

            {/* Cloudinary CDN Media Storage Configuration Card */}
            <div className={styles.cldSettingsSection} style={{ marginTop: '36px' }}>
              <div className={styles.sectionHeader}>
                <h2>☁️ Cloudinary Media CDN Configuration (Zero Mongo Space)</h2>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                  Connect your Cloudinary account so videos and high-res photos stream at 120-160 FPS worldwide with adaptive compression, taking <strong>ZERO space</strong> from your MongoDB Atlas Free Tier.
                </p>
              </div>

              {cldSuccessMsg && (
                <div style={{ padding: '12px 16px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#047857', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
                  {cldSuccessMsg}
                </div>
              )}

              {cldErrorMsg && (
                <div style={{ padding: '12px 16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#e11d48', fontSize: '0.9rem', fontWeight: 600, marginBottom: '20px' }}>
                  {cldErrorMsg}
                </div>
              )}

              <div className={styles.waCurrentCard} style={{ marginBottom: '20px' }}>
                <div className={styles.waCurrentInfo}>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Cloudinary CDN Status
                  </div>
                  <div className={styles.waCurrentDigits}>
                    <span>☁️</span>
                    <span>{cldCloudName || 'Not configured'}</span>
                    <span className={cldIsConfigured ? styles.waActiveBadge : styles.waPendingBadge}>
                      {cldIsConfigured ? '✓ Cloudinary Active & Streaming' : '○ Standby / Local DB Mode'}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveCloudinaryConfig} className={styles.waFormCard}>
                <div className={styles.optionFieldsGrid}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Cloud Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={cldCloudName}
                      onChange={(e) => setCldCloudName(e.target.value)}
                      placeholder="e.g. woe2kr5p"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      API Key
                    </label>
                    <input
                      type="text"
                      value={cldApiKey}
                      onChange={(e) => setCldApiKey(e.target.value)}
                      placeholder="e.g. 123456789012345"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={cldApiSecret}
                      onChange={(e) => setCldApiSecret(e.target.value)}
                      placeholder="Enter your Cloudinary secret"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Upload Preset <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={cldUploadPreset}
                      onChange={(e) => setCldUploadPreset(e.target.value)}
                      placeholder="e.g. ml_default or nasmal_uploads"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={cldLoading || !cldCloudName.trim() || ((!cldApiKey.trim() || !cldApiSecret.trim()) && !cldUploadPreset.trim())}
                  className={styles.submitBtn}
                  style={{ width: 'auto', padding: '10px 24px', background: '#0284c7' }}
                >
                  {cldLoading ? 'Connecting...' : '☁️ Save Cloudinary Credentials'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Edit Package Modal */}
        {editingPackage && (
          <div
            className={styles.modalOverlay}
            onMouseDown={(e) => {
              modalOverlayMouseDown.current = e.target;
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && modalOverlayMouseDown.current === e.currentTarget) {
                setEditingPackage(null);
              }
              modalOverlayMouseDown.current = null;
            }}
          >
            <div
              className={styles.modalDialog}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '880px' }}
            >
              <div className={styles.modalHeader}>
                <h3>✏️ Edit Package: {editingPackage.title}</h3>
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
                      <label htmlFor="editTitle">Package Title *</label>
                      <input 
                        required 
                        type="text" 
                        id="editTitle"
                        value={editingPackage.title || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, title: e.target.value })} 
                        placeholder="e.g. Desert Safari"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editDestination">Destination *</label>
                      <select 
                        required 
                        id="editDestination"
                        value={editingPackage.destination || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, destination: e.target.value })}
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
                      <label htmlFor="editPrice">Price (AED) *</label>
                      <input 
                        required 
                        type="text" 
                        id="editPrice"
                        value={editingPackage.price || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value })} 
                        placeholder="e.g. 150"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editChildPrice">Child Price (AED) <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                      <input 
                        type="text" 
                        id="editChildPrice"
                        value={editingPackage.childPrice || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, childPrice: e.target.value })} 
                        placeholder="e.g. 100"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editChildAgeLimit">Child Age Limit <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>(Optional)</span></label>
                      <input 
                        type="text" 
                        id="editChildAgeLimit"
                        value={editingPackage.childAgeLimit || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, childAgeLimit: e.target.value })} 
                        placeholder="e.g. 3 - 12 years"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="edit-pkg-file">Main Image (Upload New File from PC)</label>
                      <input 
                        key="edit-pkg-file" 
                        id="edit-pkg-file"
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setEditPackageImageFile(e.target.files?.[0] || null)} 
                      />
                      {editPackageImageFile && (
                        <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#047857' }}>
                          Selected: {editPackageImageFile.name}
                        </div>
                      )}
                      {editingPackage.image && (
                        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <img 
                            src={editingPackage.image} 
                            alt="Current main" 
                            style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
                          />
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Current image</span>
                        </div>
                      )}
                    </div>

                    {/* Gallery Images Section */}
                    <div className={styles.formGroupFull}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <label style={{ margin: 0 }}>Gallery Images (Upload Multiple from PC)</label>
                        {isEditingGalleryUploading && (
                          <span className={styles.galleryUploadLoading}>
                            ⏳ Uploading images...
                          </span>
                        )}
                      </div>

                      {editGalleryUploadError && (
                        <div style={{ color: '#e11d48', fontSize: '0.85rem', marginBottom: '8px' }}>
                          ⚠️ {editGalleryUploadError}
                        </div>
                      )}

                      <div className={styles.galleryUploadWrapper}>
                        <div className={styles.galleryUploadHeader}>
                          <div>
                            <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem' }}>
                              Upload Gallery Images from PC
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '2px' }}>
                              Choose one or multiple image files directly from your computer.
                            </div>
                          </div>

                          <div>
                            <input
                              type="file"
                              id="editGalleryMultiInput"
                              multiple
                              accept="image/*"
                              onChange={handleMultipleEditGalleryUpload}
                              style={{ display: 'none' }}
                              disabled={isEditingGalleryUploading}
                            />
                            <label
                              htmlFor="editGalleryMultiInput"
                              className={styles.galleryUploadBtn}
                              style={{ opacity: isEditingGalleryUploading ? 0.6 : 1, cursor: isEditingGalleryUploading ? 'wait' : 'pointer' }}
                            >
                              {isEditingGalleryUploading ? '⏳ Uploading...' : '📁 Choose Files (Multiple)'}
                            </label>
                          </div>
                        </div>

                        {/* Previews of uploaded gallery images with 1-click delete */}
                        {typeof editingPackage.images === 'string' &&
                          editingPackage.images.split('\n').map((s: string) => s.trim()).filter(Boolean).length > 0 && (
                          <div className={styles.galleryPreviewGrid}>
                            {editingPackage.images
                              .split('\n')
                              .map((s: string) => s.trim())
                              .filter(Boolean)
                              .map((imgUrl: string, idx: number) => (
                                <div key={idx} className={styles.galleryPreviewCard} title={imgUrl}>
                                  <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveEditGalleryImage(idx)}
                                    className={styles.galleryRemoveBtn}
                                    title="Remove image"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Optional Tour Video Section in Edit Modal */}
                    <div className={styles.formGroupFull}>
                      <label htmlFor="editPackageVideoInput" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span>Tour / Promotional Video (YouTube or Instagram Link)</span>
                        <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 600 }}>
                          ✓ Interactive Iframe Player
                        </span>
                      </label>

                      <div className={styles.videoAdminCard}>
                        <div className={styles.videoAdminHeader}>
                          <div>
                            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span>▶ YouTube & 📸 Instagram Video Embed</span>
                            </div>
                            <div style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '4px', lineHeight: '1.4' }}>
                              Paste any YouTube link (Standard, Shorts, youtu.be) or Instagram link (Reel, Post, TV). It will display directly in an ultra-fast, responsive iframe on the package details page with zero loading lag!
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: '12px' }}>
                          <input
                            type="text"
                            id="editPackageVideoInput"
                            value={editingPackage.video || ''}
                            onChange={(e) => setEditingPackage({ ...editingPackage, video: e.target.value })}
                            placeholder="e.g. https://www.youtube.com/watch?v=... or https://www.instagram.com/reel/..."
                            className={styles.videoUrlInputField}
                          />
                        </div>

                        {/* Quick Format Help Chips */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.78rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '4px' }}>
                            ▶ YouTube: watch?v=..., youtu.be/..., shorts/...
                          </span>
                          <span style={{ fontSize: '0.78rem', background: '#fdf2f8', color: '#db2777', padding: '3px 8px', borderRadius: '4px' }}>
                            📸 Instagram: instagram.com/reel/... or /p/...
                          </span>
                        </div>

                        {/* Live Preview if video exists */}
                        {editingPackage.video && (
                          <div className={styles.videoAdminPreviewWrapper}>
                            <div className={styles.videoAdminPreviewHeader}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                                Live Iframe Preview
                              </span>
                              <button
                                type="button"
                                onClick={() => setEditingPackage({ ...editingPackage, video: '' })}
                                className={styles.videoAdminRemoveBtn}
                              >
                                ✕ Remove Video
                              </button>
                            </div>
                            <div className={styles.videoAdminPreviewContainer}>
                              {isEmbedVideo(editingPackage.video) ? (
                                isInstagramUrl(editingPackage.video) ? (
                                  <div className={styles.videoAdminInstagramContainer}>
                                    <iframe
                                      src={getEmbedUrl(editingPackage.video)}
                                      title="Instagram preview"
                                      className={styles.videoAdminInstagramIframe}
                                      scrolling="no"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                      allowFullScreen
                                    />
                                  </div>
                                ) : (
                                  <iframe
                                    src={getEmbedUrl(editingPackage.video)}
                                    title="Video preview"
                                    className={styles.videoAdminIframe}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                  />
                                )
                              ) : (
                                <video
                                  src={editingPackage.video}
                                  controls
                                  className={styles.videoAdminNative}
                                />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label htmlFor="editDescription">Description</label>
                      <textarea 
                        id="editDescription" 
                        value={editingPackage.description || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, description: e.target.value })} 
                        rows={4} 
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label htmlFor="editHighlights">Highlights (One per line)</label>
                      <textarea 
                        id="editHighlights" 
                        value={editingPackage.highlights || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, highlights: e.target.value })} 
                        rows={3} 
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label htmlFor="editQuickFacts">Quick Facts (One per line, e.g. "Duration: 4 hours")</label>
                      <textarea 
                        id="editQuickFacts" 
                        value={editingPackage.quickFacts || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, quickFacts: e.target.value })} 
                        rows={3} 
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <label htmlFor="editInclusions">Inclusions (One per line)</label>
                      <textarea 
                        id="editInclusions" 
                        value={editingPackage.inclusions || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, inclusions: e.target.value })} 
                        rows={3} 
                      />
                    </div>

                    {/* Preferable / Suitable For */}
                    <div className={styles.formGroupFull}>
                      <div className={styles.prefSectionWrapper}>
                        <div className={styles.prefSectionHeader}>
                          <label className={styles.prefSectionLabel}>
                            Most Preferable For
                            {(editingPackage.suitableFor || []).length > 0 && (
                              <span className={styles.badgeCount}>
                                {(editingPackage.suitableFor || []).length} selected
                              </span>
                            )}
                          </label>
                          <span className={styles.prefHelpText}>
                            Select traveller & activity types this package is suitable for:
                          </span>
                        </div>

                        <div className={styles.prefButtonsContainer}>
                          {preferences.map((pref) => {
                            const isSelected = (editingPackage.suitableFor || []).includes(pref.label);
                            return (
                              <button
                                key={pref.id}
                                type="button"
                                onClick={() => {
                                  const current = editingPackage.suitableFor || [];
                                  const next = isSelected 
                                    ? current.filter((p: string) => p !== pref.label) 
                                    : [...current, pref.label];
                                  setEditingPackage({ ...editingPackage, suitableFor: next });
                                }}
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

                          {/* "+ Other" Button in Edit */}
                          <button
                            type="button"
                            onClick={() => setShowEditAddPreference(prev => !prev)}
                            className={`${styles.prefItem} ${styles.prefItemAdd} ${showEditAddPreference ? styles.prefItemAddActive : ''}`}
                            title="Add new category with title and icon"
                          >
                            <div className={styles.prefIconWrapperAdd}>
                              <span className={styles.prefIconAdd}>+</span>
                            </div>
                            <span className={styles.prefLabel}>Other</span>
                            <span className={styles.prefIndicatorLine}></span>
                          </button>
                        </div>

                        {showEditAddPreference && (
                          <div className={styles.newPrefCard}>
                            <div className={styles.newPrefHeader}>
                              <h4>Add Custom Category / Preference</h4>
                              <button
                                type="button"
                                onClick={() => setShowEditAddPreference(false)}
                                className={styles.closeBtn}
                                title="Close"
                              >
                                ✕
                              </button>
                            </div>
                            <div className={styles.newPrefForm}>
                              <div className={styles.newPrefInputCol}>
                                <label>Title / Category Name *</label>
                                <input
                                  type="text"
                                  value={newEditPrefTitle}
                                  onChange={(e) => setNewEditPrefTitle(e.target.value)}
                                  placeholder="e.g. Solo Travellers, Luxury, Nightlife..."
                                  className={styles.titleInput}
                                />
                              </div>

                              <div className={styles.newPrefInputCol}>
                                <label>Icon / Emoji</label>
                                <div className={styles.iconInputRow}>
                                  <input
                                    type="text"
                                    value={newEditPrefIcon}
                                    onChange={(e) => setNewEditPrefIcon(e.target.value)}
                                    placeholder="Enter"
                                    className={styles.iconInput}
                                    maxLength={4}
                                  />
                                  <div className={styles.quickEmojis}>
                                    {['🎒', '🏄', '🏖️', '🏎️', '🚢', '🚁', '👑', '🧗', '🏕️', '🎭', '🍕', '🛥️', '🎟️', '🧘'].map(emoji => (
                                      <button
                                        key={emoji}
                                        type="button"
                                        className={`${styles.quickEmojiBtn} ${newEditPrefIcon === emoji ? styles.quickEmojiBtnActive : ''}`}
                                        onClick={() => setNewEditPrefIcon(prev => prev === emoji ? '' : emoji)}
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
                                  disabled={!newEditPrefTitle.trim() || isSavingPref}
                                  onClick={async () => {
                                    const trimmedTitle = newEditPrefTitle.trim();
                                    if (!trimmedTitle) return;
                                    const iconToUse = newEditPrefIcon.trim() || '🏷️';
                                    const id = trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                                    const newOption = { id, label: trimmedTitle, icon: iconToUse, isCustom: true };
                                    setPreferences(prev => [...prev.filter(p => p.id !== id), newOption]);
                                    setEditingPackage((prev: any) => ({
                                      ...prev,
                                      suitableFor: [...(prev.suitableFor || []).filter((p: string) => p !== trimmedTitle), trimmedTitle]
                                    }));
                                    setNewEditPrefTitle('');
                                    setNewEditPrefIcon('');
                                    setShowEditAddPreference(false);
                                    try {
                                      await fetch('/api/preferences', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ label: trimmedTitle, icon: iconToUse })
                                      });
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className={styles.addPrefConfirmBtn}
                                >
                                  Add & Select
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowEditAddPreference(false)}
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

                    {/* Available Options / Sub-categories Section (Optional) */}
                    <div className={styles.formGroupFull}>
                      <div className={styles.optionsAdminSection}>
                        <div className={styles.optionsAdminHeader}>
                          <div className={styles.optionsAdminTitle}>
                            <span>🏷️ Sub-Categories / Available Options</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>(Optional)</span>
                          </div>
                          <div className={styles.optionsAdminHelp}>
                            Add variations or sub-packages (e.g. &quot;At The Top + Sunrise + Morning Treat&quot;, VIP access, Prime Hours) that appear in the &quot;Available Options&quot; section above the Overview on the package details page.
                          </div>
                        </div>

                        <div className={styles.optionsToggleBox}>
                          <input
                            type="checkbox"
                            id="editEnableOptions"
                            checked={!!editingPackage.hasOptions}
                            onChange={(e) => setEditingPackage({ ...editingPackage, hasOptions: e.target.checked })}
                          />
                          <label htmlFor="editEnableOptions" className={styles.optionsToggleLabel}>
                            Enable Sub-categories / Available Options section for this package
                          </label>
                        </div>

                        {editingPackage.hasOptions && (
                          <div>
                            {/* Section Header Title */}
                            <div style={{ marginBottom: '16px' }}>
                              <label htmlFor="editOptionsSectionTitle" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                                Section Title (as displayed on customer page)
                              </label>
                              <input
                                type="text"
                                id="editOptionsSectionTitle"
                                value={editingPackage.optionsSectionTitle || 'Available Options'}
                                onChange={(e) => setEditingPackage({ ...editingPackage, optionsSectionTitle: e.target.value })}
                                placeholder="Available Options"
                                style={{ width: '100%', padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
                              />
                            </div>

                            {/* List of Current Options */}
                            <div style={{ marginBottom: '14px', fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                              Current Options ({(editingPackage.options || []).length}):
                            </div>

                            {(!editingPackage.options || editingPackage.options.length === 0) ? (
                              <div style={{ padding: '16px', background: '#ffffff', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem', textAlign: 'center', marginBottom: '18px' }}>
                                No options added yet. Fill in the builder form below to add your first option card.
                              </div>
                            ) : (
                              <div className={styles.optionsListPreview}>
                                {(editingPackage.options || []).map((opt: any, idx: number) => {
                                  const inclusionsArr = Array.isArray(opt.inclusions)
                                    ? opt.inclusions
                                    : (opt.inclusions || '').split('\n').filter(Boolean);
                                  const isAvail = opt.isAvailable !== false;

                                  return (
                                    <div key={opt.id || idx} className={styles.optionPreviewCard}>
                                      <div className={styles.optionPreviewHeader}>
                                        {opt.badge && (
                                          <span className={styles.optionPreviewBadge}>
                                            🔥 {opt.badge}
                                          </span>
                                        )}
                                        <div className={styles.optionPreviewTitle}>{opt.title}</div>
                                      </div>

                                      <div className={styles.optionPreviewBody}>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Inclusions:</div>
                                        <ul className={styles.optionPreviewInclusions}>
                                          {inclusionsArr.length > 0 ? (
                                            inclusionsArr.slice(0, 3).map((inc: string, iIdx: number) => (
                                              <li key={iIdx}>{inc}</li>
                                            ))
                                          ) : (
                                            <li>Standard tour package inclusions</li>
                                          )}
                                          {inclusionsArr.length > 3 && (
                                            <li style={{ color: '#047857', fontWeight: 600 }}>+{inclusionsArr.length - 3} more</li>
                                          )}
                                        </ul>

                                        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#475569' }}>
                                          Price: <strong style={{ color: '#047857' }}>AED {opt.price || editingPackage.price || '0'}</strong>
                                          {opt.childPrice && <span> • Child: AED {opt.childPrice}</span>}
                                        </div>
                                      </div>

                                      <div className={styles.optionPreviewFooter}>
                                        <span className={`${styles.optionAvailTag} ${isAvail ? styles.optionAvailYes : styles.optionAvailNo}`}>
                                          {isAvail ? '✓ Available' : '✕ Not Available'}
                                        </span>

                                        <div className={styles.optionPreviewActions}>
                                          <button
                                            type="button"
                                            className={styles.optionMiniBtn}
                                            onClick={() => handleEditOptionInEditModal(idx)}
                                          >
                                            Edit
                                          </button>
                                          <button
                                            type="button"
                                            className={`${styles.optionMiniBtn} ${styles.optionMiniBtnDanger}`}
                                            onClick={() => handleRemoveOptionFromEditModal(idx)}
                                          >
                                            Delete
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {/* Add / Edit Option Card Builder */}
                            <div className={styles.optionBuilderBox}>
                              <div className={styles.optionBuilderHeader}>
                                <span>{editModalEditingOptionIndex !== null ? '✏️ Edit Option Card' : '➕ Add Option / Sub-Category Card'}</span>
                                {editModalEditingOptionIndex !== null && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditModalEditingOptionIndex(null);
                                      setEditModalOptionForm({
                                        title: '',
                                        badge: '',
                                        price: '',
                                        childPrice: '',
                                        inclusions: '',
                                        moreDetails: '',
                                        isAvailable: true,
                                      });
                                    }}
                                    style={{ background: 'none', border: 'none', color: '#e11d48', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}
                                  >
                                    Cancel Edit
                                  </button>
                                )}
                              </div>

                              <div className={styles.optionFieldsGrid}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                    Option Title / Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={editModalOptionForm.title}
                                    onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, title: e.target.value })}
                                    placeholder="e.g. At The Top + Sunrise + Morning Treat"
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                    Badge Tag (Optional)
                                  </label>
                                  <input
                                    type="text"
                                    value={editModalOptionForm.badge}
                                    onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, badge: e.target.value })}
                                    placeholder="e.g. Prime Hours, Best Value, VIP Pass"
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                                  />
                                  <div className={styles.badgePillsRow}>
                                    {['Prime Hours', 'Best Value', 'Popular', 'VIP Pass', 'Instant Confirmation'].map(b => (
                                      <button
                                        key={b}
                                        type="button"
                                        className={`${styles.badgePillBtn} ${editModalOptionForm.badge === b ? styles.badgePillBtnActive : ''}`}
                                        onClick={() => setEditModalOptionForm({ ...editModalOptionForm, badge: editModalOptionForm.badge === b ? '' : b })}
                                      >
                                        {b}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                    Adult Price (AED) <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Optional)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={editModalOptionForm.price}
                                    onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, price: e.target.value })}
                                    placeholder="Leave empty for package price (AED)"
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                    Child Price (AED) <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Optional)</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={editModalOptionForm.childPrice}
                                    onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, childPrice: e.target.value })}
                                    placeholder="e.g. 100"
                                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem' }}
                                  />
                                </div>
                              </div>

                              <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                  Inclusions (One per line)
                                </label>
                                <textarea
                                  rows={3}
                                  value={editModalOptionForm.inclusions}
                                  onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, inclusions: e.target.value })}
                                  placeholder={`Admission tickets to 124 & 125 Floors of the Burj Khalifa.\nAccess to the telescopes on 124th floor`}
                                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                                />
                              </div>

                              <div style={{ marginBottom: '14px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                                  More Details / Description (Revealed on clicking &quot;More details ⌄&quot;)
                                </label>
                                <textarea
                                  rows={2}
                                  value={editModalOptionForm.moreDetails}
                                  onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, moreDetails: e.target.value })}
                                  placeholder="Additional terms, meeting instructions, or special details for this option..."
                                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', resize: 'vertical' }}
                                />
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, color: editModalOptionForm.isAvailable ? '#047857' : '#e11d48' }}>
                                  <input
                                    type="checkbox"
                                    checked={editModalOptionForm.isAvailable}
                                    onChange={(e) => setEditModalOptionForm({ ...editModalOptionForm, isAvailable: e.target.checked })}
                                    style={{ width: '16px', height: '16px', accentColor: '#047857', cursor: 'pointer' }}
                                  />
                                  {editModalOptionForm.isAvailable ? '✓ Status: Available' : '✕ Status: Not Available (Shows "Not Available" badge)'}
                                </label>

                                <button
                                  type="button"
                                  onClick={handleSaveOptionToEditModal}
                                  style={{
                                    background: '#047857',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 18px',
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  {editModalEditingOptionIndex !== null ? '✓ Update Option' : '+ Add Option Card'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={styles.formGroupFull}>
                      <label htmlFor="editTags">Tags (Comma separated)</label>
                      <input 
                        type="text" 
                        id="editTags" 
                        value={editingPackage.tags || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, tags: e.target.value })} 
                        placeholder="adventure, family, desert" 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editRating">Rating</label>
                      <input 
                        type="text" 
                        id="editRating" 
                        value={editingPackage.rating || ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, rating: e.target.value })} 
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="editReviewsCount">Reviews Count</label>
                      <input 
                        type="number" 
                        id="editReviewsCount" 
                        value={editingPackage.reviewsCount ?? ''} 
                        onChange={(e) => setEditingPackage({ ...editingPackage, reviewsCount: e.target.value })} 
                      />
                    </div>

                    <div className={styles.formGroupFull}>
                      <div className={styles.checkboxGroup}>
                        <input 
                          type="checkbox" 
                          id="editPopular" 
                          checked={!!editingPackage.isPopular} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, isPopular: e.target.checked })} 
                        />
                        <label htmlFor="editPopular" style={{ marginBottom: 0 }}>Mark as Popular Package</label>
                      </div>
                    </div>

                    <div className={styles.formGroupFull}>
                      <div className={styles.checkboxGroup}>
                        <input 
                          type="checkbox" 
                          id="editBestDeal" 
                          checked={!!editingPackage.isBestDeal} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, isBestDeal: e.target.checked })} 
                        />
                        <label htmlFor="editBestDeal" style={{ marginBottom: 0 }}>Mark as Best Deal</label>
                      </div>
                    </div>

                    {editingPackage.isBestDeal && (
                      <div className={styles.formGroupFull}>
                        <label htmlFor="editOriginalPrice">Original Crossed-out Price (AED)</label>
                        <input 
                          type="text" 
                          id="editOriginalPrice" 
                          value={editingPackage.originalPrice || ''} 
                          onChange={(e) => setEditingPackage({ ...editingPackage, originalPrice: e.target.value })} 
                          placeholder="e.g. 250" 
                        />
                      </div>
                    )}
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
                    style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                  >
                    {editLoading ? 'Saving Changes...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Destination Modal */}
        {editingDest && (
          <div
            className={styles.modalOverlay}
            onMouseDown={(e) => {
              modalOverlayMouseDown.current = e.target;
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget && modalOverlayMouseDown.current === e.currentTarget) {
                setEditingDest(null);
              }
              modalOverlayMouseDown.current = null;
            }}
          >
            <div
              className={styles.modalDialog}
              style={{ maxWidth: '540px' }}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
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
                    <label htmlFor="edit-dest-file">Destination Image (Upload New File from PC)</label>
                    <input 
                      key="edit-dest-file" 
                      id="edit-dest-file"
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setEditDestImageFile(e.target.files?.[0] || null)} 
                    />
                    {editDestImageFile && (
                      <div style={{ marginTop: '6px', fontSize: '0.8rem', color: '#047857' }}>
                        Selected: {editDestImageFile.name}
                      </div>
                    )}
                    {editingDest.image && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={editingDest.image} 
                          alt="Current destination" 
                          style={{ width: '56px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
                        />
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Current image</span>
                      </div>
                    )}
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
