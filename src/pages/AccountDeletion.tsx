import axios from 'axios';
import React, { useState } from 'react';

export default function AccountDeletion() {
    const [email, setEmail] = useState('');
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            await axios.post('/api/request-deletion', { email, reason });
            setSubmitted(true);
            alert('Your request has been received. Your account will be deleted soon in 7 days.');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request. Please try again later.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="public-page-wrapper">
                <div className="public-page-card small-card success-box">
                    <div className="success-icon">
                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="public-page-title">Request Received</h2>
                    <p className="public-page-content">Your account will be deleted securely within 7 days.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="public-page-wrapper">
            <div className="public-page-card small-card">
                <h1 className="public-page-title" style={{ marginBottom: "8px" }}>Delete Account</h1>
                <p className="public-page-subtitle">
                    If you wish to permanently delete your Massma account and all associated data,
                    please verify your email and provide a reason below.
                </p>

                {error && <div className="warning-box" style={{ marginBottom: "20px" }}>{error}</div>}

                <form onSubmit={handleSubmit} className="deletion-form">
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            required
                            type="email"
                            className="form-input"
                            placeholder="Enter the email associated with your account"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reason">Reason for deletion (Optional)</label>
                        <textarea
                            id="reason"
                            className="form-input textarea-input"
                            placeholder="Please tell us why you are leaving..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="warning-box">
                        <p className="warning-title">Warning: This action cannot be undone.</p>
                        <p>All your data, products, companies, and connections will be permanently lost.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn btn-danger btn-full-width"
                        style={{ marginTop: "8px" }}
                    >
                        {submitting ? 'Submitting...' : 'Request Account Deletion'}
                    </button>
                </form>
            </div>
        </div>
    );
}
