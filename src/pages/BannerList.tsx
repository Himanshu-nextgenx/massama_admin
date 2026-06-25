import { Image, Plus, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import type { Banner } from '../store/bannerStore';
import { useBannerStore } from '../store/bannerStore';
import getCroppedImg from '../utils/cropUtils';

export default function BannerList() {
    const {
        banners,
        isLoading,
        error,
        fetchBanners,
        uploadBanner,
        deleteBanner,
    } = useBannerStore();

    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Position filter & upload position
    const [filterPosition, setFilterPosition] = useState<'all' | 'top' | 'bottom'>('all');
    const [uploadPosition, setUploadPosition] = useState<'top' | 'bottom'>('top');

    // Crop State
    const [tempImage, setTempImage] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        console.log('[BannerList] Fetching banners on mount');
        fetchBanners(filterPosition === 'all' ? undefined : filterPosition);
    }, [fetchBanners, filterPosition]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const topCount = banners.filter(b => (b.position || 'top') === 'top').length;
        const bottomCount = banners.filter(b => (b.position || 'top') === 'bottom').length;
        const currentCount = uploadPosition === 'top' ? topCount : bottomCount;

        if (currentCount >= 10) {
            alert(`Maximum of 10 ${uploadPosition} banners allowed. Please delete an existing banner to add a new one.`);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setTempImage(reader.result as string);
            });
            reader.readAsDataURL(file);
        }
    };

    const onCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleUpload = async () => {
        if (!tempImage || !croppedAreaPixels) return;

        try {
            setIsUploading(true);
            const croppedBlob = await getCroppedImg(tempImage, croppedAreaPixels);

            if (croppedBlob) {
                const file = new File([croppedBlob], 'banner-cropped.jpg', { type: 'image/jpeg' });
                console.log('[BannerList] Uploading cropped file:', file.name, 'position:', uploadPosition);
                await uploadBanner(file, uploadPosition);

                setTempImage(null);
                setCrop({ x: 0, y: 0 });
                setZoom(1);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        } catch (e) {
            console.error('Failed to crop/upload image:', e);
            alert('Failed to process image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const cancelCrop = () => {
        setTempImage(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDelete = async (id: number) => {
        console.log('[BannerList] Deleting banner:', id);
        const success = await deleteBanner(id);
        if (success) {
            setDeleteConfirm(null);
        }
    };

    const displayedBanners = filterPosition === 'all'
        ? banners
        : banners.filter(b => (b.position || 'top') === filterPosition);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Banners</h1>
                <div className="page-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: '#666' }}>
                        {displayedBanners.length} Banners
                    </span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />

                    {/* Position selector for upload */}
                    <select
                        className="form-input"
                        value={uploadPosition}
                        onChange={(e) => setUploadPosition(e.target.value as 'top' | 'bottom')}
                        style={{ width: 130 }}
                    >
                        <option value="top">Top Banner</option>
                        <option value="bottom">Bottom Banner</option>
                    </select>

                    <button
                        className="btn btn-primary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading || isUploading}
                    >
                        <Plus size={16} />
                        {isLoading || isUploading ? 'Processing...' : 'Upload Banner'}
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {(['all', 'top', 'bottom'] as const).map(pos => (
                    <button
                        key={pos}
                        onClick={() => setFilterPosition(pos)}
                        style={{
                            padding: '8px 20px',
                            borderRadius: 20,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: 14,
                            backgroundColor: filterPosition === pos ? '#5C6BC0' : '#E5E9F2',
                            color: filterPosition === pos ? 'white' : '#1A1D1F',
                            transition: 'all 0.2s',
                        }}
                    >
                        {pos === 'all' ? 'All' : pos === 'top' ? 'Top Banners' : 'Bottom Banners'}
                    </button>
                ))}
            </div>

            {error && (
                <div style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 16,
                }}>
                    {error}
                </div>
            )}

            {/* Banners Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 20,
            }}>
                {isLoading && displayedBanners.length === 0 ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', gridColumn: '1 / -1' }}>
                        Loading banners...
                    </div>
                ) : displayedBanners.length === 0 ? (
                    <div className="card" style={{ padding: 40, textAlign: 'center', gridColumn: '1 / -1' }}>
                        <Upload size={48} color="#6F767E" style={{ marginBottom: 16, opacity: 0.5 }} />
                        <p style={{ color: '#6F767E' }}>No banners found. Click 'Upload Banner' to add one.</p>
                    </div>
                ) : (
                    displayedBanners.map((banner: Banner) => (
                        <div key={banner.id} className="card" style={{ overflow: 'hidden' }}>
                            {/* Banner Image */}
                            <div style={{
                                height: 180,
                                background: '#F4F4F5',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {banner.image ? (
                                    <img
                                        src={banner.image}
                                        alt={`Banner ${banner.id}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Error';
                                        }}
                                    />
                                ) : (
                                    <Image size={48} color="#6F767E" opacity={0.5} />
                                )}
                            </div>

                            {/* Banner Info */}
                            <div style={{ padding: 16 }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <h4 style={{ fontSize: 14, fontWeight: 600 }}>Banner #{banner.id}</h4>
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                                            <span style={{
                                                fontSize: 11,
                                                padding: '2px 8px',
                                                borderRadius: 10,
                                                fontWeight: 600,
                                                backgroundColor: (banner.position || 'top') === 'top' ? '#DBEAFE' : '#FEF3C7',
                                                color: (banner.position || 'top') === 'top' ? '#2563EB' : '#D97706',
                                            }}>
                                                {(banner.position || 'top').toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: 12, color: '#6F767E' }}>
                                                {banner.created_at
                                                    ? new Date(banner.created_at).toLocaleDateString()
                                                    : 'No date'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => setDeleteConfirm(banner.id)}
                                        style={{ padding: '8px 12px' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Crop Modal */}
            {tempImage && (
                <div className="modal-overlay" style={{ zIndex: 1000 }}>
                    <div className="modal" style={{ width: '90%', maxWidth: 600, height: '80vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="modal-header">
                            <h3>Crop Banner ({uploadPosition === 'top' ? 'Top' : 'Bottom'})</h3>
                            <button className="close-btn" onClick={cancelCrop}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body" style={{ flex: 1, position: 'relative', minHeight: 400 }}>
                            <Cropper
                                image={tempImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={16 / 9}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="modal-footer" style={{ padding: '16px 24px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 12, marginBottom: 4, display: 'block' }}>Zoom</label>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-labelledby="Zoom"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    style={{ width: '100%' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: 10, marginLeft: 20 }}>
                                <button className="btn btn-secondary" onClick={cancelCrop}>
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                >
                                    {isUploading ? 'Uploading...' : 'Save & Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Banner</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this banner? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setDeleteConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDelete(deleteConfirm)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
