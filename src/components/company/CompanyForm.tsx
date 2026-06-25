import { Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CompanyFormData } from '../../store/companyStore';
import { useCompanyStore } from '../../store/companyStore';

interface Props {
    initialData?: Partial<CompanyFormData>;
    companyId?: number;
    isEdit?: boolean;
}

export default function CompanyForm({ initialData, companyId, isEdit = false }: Props) {
    const navigate = useNavigate();
    const { createCompany, updateCompany, isLoading } = useCompanyStore();

    const [formData, setFormData] = useState<CompanyFormData>({
        name: initialData?.name || '',
        gst_no: initialData?.gst_no || '',
        pancard_no: initialData?.pancard_no || '',
        din_no: initialData?.din_no || '',
        website: initialData?.website || '',
        hughes_no: initialData?.hughes_no || ['', '', '', '', ''],
        mobile_number: initialData?.mobile_number || '',
        resi: initialData?.resi || '',
        amd: initialData?.amd || false,
        email: initialData?.email || '',
        address: initialData?.address || '',
        city: initialData?.city || '',
        bank: initialData?.bank || '',
        branch: initialData?.branch || '',
        account_number: initialData?.account_number || '',
        logo: null,
        user_id: initialData?.user_id || 0,
    });

    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'file' && files && files[0]) {
            setFormData(prev => ({ ...prev, logo: files[0] }));
            setLogoPreview(URL.createObjectURL(files[0]));
        } else if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let success = false;
        // Filter out empty hughes numbers
        const cleanFormData = {
            ...formData,
            hughes_no: Array.isArray(formData.hughes_no)
                ? formData.hughes_no.filter(h => h && h.trim() !== '')
                : [],
        };

        if (isEdit && companyId) {
            success = await updateCompany(companyId, cleanFormData);
        } else {
            success = await createCompany(cleanFormData);
        }

        if (success) {
            navigate('/companies');
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    Company Details &gt; {isEdit ? 'Edit Company' : 'Create Company'}
                </h1>
            </div>

            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <p style={{ fontSize: 14, color: '#6F767E', marginBottom: 20 }}>
                            #{companyId ? `A-${String(companyId).padStart(3, '0')}` : 'A-NEW'}
                        </p>

                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Member Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-input"
                                    placeholder="Enter Company Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
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
                                <label className="form-label">Resi</label>
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
                                onClick={() => navigate('/companies')}
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
