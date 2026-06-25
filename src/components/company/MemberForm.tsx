import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MemberFormData } from '../../store/memberStore';
import { useMemberStore } from '../../store/memberStore';
import { useUserStore } from '../../store/userStore';
import { useEffect } from 'react';

interface Props {
    initialData?: Partial<MemberFormData>;
    memberId?: number;
    isEdit?: boolean;
    initialLogoUrl?: string;
}

export default function MemberForm({ initialData, memberId, isEdit = false, initialLogoUrl }: Props) {
    const navigate = useNavigate();
    const { createMember, updateMember, isLoading, error } = useMemberStore(); // Destructure error
    const { users, fetchUsers } = useUserStore();

    useEffect(() => {
        fetchUsers(1, 100); // Fetch a batch of users for the dropdown
    }, [fetchUsers]);

    const [formData, setFormData] = useState<MemberFormData>({
        name: initialData?.name || '',
        gst_no: initialData?.gst_no || '',
        pancard_no: initialData?.pancard_no || '',
        din_no: initialData?.din_no || '',
        website: initialData?.website || '',
        hughes_no: initialData?.hughes_no || ['', '', '', '', ''],
        mobile_number: initialData?.mobile_number || '',
        resi: initialData?.resi || '',
        amd: initialData?.amd !== undefined ? initialData.amd : true,
        email: initialData?.email || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        bank: initialData?.bank || '',
        branch: initialData?.branch || '',
        account_number: initialData?.account_number || '',
        ifsc_code: initialData?.ifsc_code || '',
        account_type: initialData?.account_type || '',
        upi_id: initialData?.upi_id || '',
        account_holder_name: initialData?.account_holder_name || '',
        contact_no: initialData?.contact_no || '',
        contact_person_name: initialData?.contact_person_name || '',
        logo: null,
        user_id: initialData?.user_id || 0,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(initialLogoUrl || null);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file' && files && files[0]) {
            setFormData(prev => ({ ...prev, logo: files[0] }));
            setLogoPreview(URL.createObjectURL(files[0]));
        } else if (name === 'mobile_number') {
            // Restrict to 10 digits and numbers only
            const numericValue = value.replace(/\D/g, '').slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: numericValue }));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // ... handleSubmit ...
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for Mobile Number length
        if (formData.mobile_number.length !== 10) {
            alert('Mobile number must be exactly 10 digits');
            return;
        }

        let success = false;
        // Filter out empty hughes numbers
        const cleanFormData = {
            ...formData,
            hughes_no: Array.isArray(formData.hughes_no)
                ? formData.hughes_no.filter(h => h && h.trim() !== '')
                : [],
        };
        // If user_id is given from dropdown string, parse it
        if (cleanFormData.user_id) {
            cleanFormData.user_id = Number(cleanFormData.user_id);
        }
        
        // Remove user_id if it's 0 or invalid to prevent FK constraint errors
        if (!cleanFormData.user_id) {
            delete (cleanFormData as any).user_id;
        }

        if (isEdit && memberId) {
            success = await updateMember(memberId, cleanFormData);
        } else {
            success = await createMember(cleanFormData);
        }

        if (success) {
            navigate('/members');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    Member Details &gt; {isEdit ? 'Edit Member' : 'Create Member'}
                </h1>
            </div>

            {error && (
                <div style={{
                    background: '#FEE2E2',
                    color: '#DC2626',
                    padding: '12px 16px',
                    borderRadius: 8,
                    marginBottom: 16
                }}>
                    Error: {error}
                </div>
            )}

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <p style={{ fontSize: 14, color: '#6F767E', marginBottom: 20 }}>
                            #{memberId ? `A-${String(memberId).padStart(3, '0')}` : 'A-NEW'}
                        </p>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Member Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="Enter Member Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Linked User Profile</label>
                                <select
                                    name="user_id"
                                    className="form-input"
                                    value={formData.user_id || ''}
                                    onChange={(e) => {
                                        const userId = Number(e.target.value);
                                        const selectedUser = users.find(u => u.id === userId);
                                        if (selectedUser) {
                                            // Sync details
                                            setFormData(prev => ({
                                                ...prev,
                                                user_id: userId,
                                                name: prev.name || selectedUser.fullname || '',
                                                email: prev.email || selectedUser.email || '',
                                                mobile_number: prev.mobile_number || selectedUser.mobile_number || '',
                                                pancard_no: prev.pancard_no || selectedUser.pancard_number || ''
                                            }));
                                        } else {
                                           setFormData(prev => ({ ...prev, user_id: 0 }));
                                        }
                                    }}
                                >
                                    <option value="">-- No Linked User --</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.fullname || u.email || u.mobile_number} (ID: {u.id})
                                        </option>
                                    ))}
                                </select>
                                <small style={{ color: '#6F767E' }}>Select a user to sync profile details.</small>
                            </div>

                            <div className="form-group">
                                <label className="form-label">GST No</label>
                                <input
                                    type="text"
                                    name="gst_no"
                                    className="form-input"
                                    placeholder="Enter GST No"
                                    value={formData.gst_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Pan Card No</label>
                                <input
                                    type="text"
                                    name="pancard_no"
                                    className="form-input"
                                    placeholder="Enter PAN Card No"
                                    value={formData.pancard_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">DIN No</label>
                                <input
                                    type="text"
                                    name="din_no"
                                    className="form-input"
                                    placeholder="Enter DIN No"
                                    value={formData.din_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Web Site</label>
                                <input
                                    type="url"
                                    name="website"
                                    className="form-input"
                                    placeholder="https://example.com"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Product-Wise Members Data (5 Entries)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            className="form-input"
                                            placeholder={`Entry ${index + 1}`}
                                            value={Array.isArray(formData.hughes_no) ? formData.hughes_no[index] : ''}
                                            onChange={(e) => {
                                                const newHughes = Array.isArray(formData.hughes_no) ? [...formData.hughes_no] : ['', '', '', '', ''];
                                                newHughes[index] = e.target.value;
                                                setFormData(prev => ({ ...prev, hughes_no: newHughes }));
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Mobile No</label>
                                <input
                                    type="tel"
                                    name="mobile_number"
                                    className="form-input"
                                    placeholder="+91 XXXXXXXXXX"
                                    value={formData.mobile_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Residential Address</label>
                                <input
                                    type="text"
                                    name="resi"
                                    className="form-input"
                                    placeholder="Enter Residential Address"
                                    value={formData.resi}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <div className="form-checkbox" style={{ marginTop: 24 }}>
                                    <input
                                        type="checkbox"
                                        name="amd"
                                        checked={formData.amd}
                                        onChange={handleChange}
                                    />
                                    <label className="form-label">AMD</label>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Email Id</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-input"
                                    placeholder="email@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Factory Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    className="form-input"
                                    placeholder="Enter Factory Address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    className="form-input"
                                    placeholder="City name"
                                    value={formData.city}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Bank</label>
                                <input
                                    type="text"
                                    name="bank"
                                    className="form-input"
                                    placeholder="Bank name"
                                    value={formData.bank}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Branch</label>
                                <input
                                    type="text"
                                    name="branch"
                                    className="form-input"
                                    placeholder="Branch name"
                                    value={formData.branch}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Account Number</label>
                                <input
                                    type="text"
                                    name="account_number"
                                    className="form-input"
                                    placeholder="Account number"
                                    value={formData.account_number}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">IFSC Code</label>
                                <input
                                    type="text"
                                    name="ifsc_code"
                                    className="form-input"
                                    placeholder="Enter IFSC Code"
                                    value={formData.ifsc_code}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Account Type</label>
                                <input
                                    type="text"
                                    name="account_type"
                                    className="form-input"
                                    placeholder="Savings/Current"
                                    value={formData.account_type}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Account Holder Name</label>
                                <input
                                    type="text"
                                    name="account_holder_name"
                                    className="form-input"
                                    placeholder="Enter Holder Name"
                                    value={formData.account_holder_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">UPI ID</label>
                                <input
                                    type="text"
                                    name="upi_id"
                                    className="form-input"
                                    placeholder="example@upi"
                                    value={formData.upi_id}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact Person Name</label>
                                <input
                                    type="text"
                                    name="contact_person_name"
                                    className="form-input"
                                    placeholder="Enter Contact Person"
                                    value={formData.contact_person_name}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Contact No</label>
                                <input
                                    type="text"
                                    name="contact_no"
                                    className="form-input"
                                    placeholder="Contact number"
                                    value={formData.contact_no}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label className="form-label">Attachments Logo</label>
                                <label className="image-upload">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    {logoPreview ? (
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                        />
                                    ) : (
                                        <>
                                            <ImageIcon size={40} />
                                            <span>Image</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
                            <button
                                type="button"
                                className="btn btn-outline"
                                onClick={() => navigate('/members')}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
