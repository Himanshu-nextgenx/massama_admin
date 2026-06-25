import { Upload, X } from 'lucide-react';
import { useState } from 'react';

import { useMemberStore } from '../../store/memberStore';
import api from '../../utils/auth';

interface Props {
    onClose: () => void;
}

export default function UploadExcelModal({ onClose }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const { fetchMembers } = useMemberStore();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            await api.post('/company/bulk-upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchMembers();
            onClose();
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed check console');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" style={{ width: 500 }} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3 className="modal-title">Upload Excel</h3>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                            <Upload size={16} />
                            Upload File
                            <input
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>

                    <p style={{ fontSize: 12, color: '#9A9FA5', marginBottom: 16 }}>
                        (XLS file only)
                    </p>

                    {file && (
                        <div style={{ marginTop: 16 }}>
                            <p style={{ fontSize: 14, marginBottom: 8 }}>
                                Selected: <strong>{file.name}</strong>
                            </p>
                        </div>
                    )}


                </div>

                <div className="modal-footer">
                    <button className="btn btn-outline" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}
