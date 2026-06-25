import axios from 'axios';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = '/api';

export default function Login() {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        console.log('[Login] Attempting login with:', { mobileNumber, password: '***' });

        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                mobile_number: mobileNumber,
                password: password,
            });

            console.log('[Login] Login response:', response.data);

            // Extract tokens from response
            const { access_token, refresh_token, user, userId } = response.data;

            // Store tokens and user info
            localStorage.setItem('admin_token', access_token);
            if (refresh_token) {
                localStorage.setItem('refresh_token', refresh_token);
            }

            // Store user ID - might be in response directly or in user object
            const storedUserId = userId || user?.id;
            if (storedUserId) {
                localStorage.setItem('user_id', String(storedUserId));
                console.log('[Login] User ID stored:', storedUserId);
            }

            // Decode token to extract user ID if not provided directly
            if (!storedUserId && access_token) {
                try {
                    const tokenPayload = JSON.parse(atob(access_token.split('.')[1]));
                    console.log('[Login] Token payload:', tokenPayload);
                    if (tokenPayload.sub) {
                        localStorage.setItem('user_id', String(tokenPayload.sub));
                        console.log('[Login] User ID from token:', tokenPayload.sub);
                    }
                } catch (decodeError) {
                    console.error('[Login] Error decoding token:', decodeError);
                }
            }

            console.log('[Login] Login successful, navigating to dashboard');
            navigate('/');
        } catch (err: unknown) {
            console.error('[Login] Login error:', err);
            if (axios.isAxiosError(err)) {
                console.error('[Login] Error response:', err.response?.data);
                const message = err.response?.data?.message || 'Invalid credentials';
                setError(Array.isArray(message) ? message.join(', ') : message);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}>
            <div className="card" style={{ width: 400, padding: 32 }}>
                <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                        <div style={{ width: 64, height: 64, background: '#4F7CFF', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={32} color="white" />
                        </div>
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1D1F' }}>
                        Welcome to Massma
                    </h1>
                    <p style={{ color: '#6F767E', marginTop: 8 }}>
                        Enter your credentials to login
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#FEE2E2',
                        color: '#DC2626',
                        padding: '12px 16px',
                        borderRadius: 8,
                        marginBottom: 16,
                        fontSize: 14,
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#1A1D1F', fontSize: 14 }}>Mobile Number</label>
                        <input
                            type="tel"
                            className="form-input"
                            placeholder="Enter mobile number (e.g. 9876543210)"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '10px 14px', 
                                border: '2px solid #EFEFEF', 
                                borderRadius: 12, 
                                fontSize: 14,
                                boxSizing: 'border-box',
                                margin: 0,
                                background: '#FCFCFC'
                            }}
                        />
                    </div>

                    <div className="form-group" style={{ marginBottom: 24 }}>
                        <label className="form-label" style={{ display: 'block', marginBottom: 8, fontWeight: 500, color: '#1A1D1F', fontSize: 14 }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                style={{ 
                                    width: '100%', 
                                    padding: '10px 48px 10px 14px', 
                                    border: '2px solid #EFEFEF', 
                                    borderRadius: 12, 
                                    fontSize: 14,
                                    boxSizing: 'border-box',
                                    margin: 0,
                                    background: '#FCFCFC'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#6F767E',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: 4
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: 8, padding: '12px 16px', fontWeight: 600, fontSize: 14, borderRadius: 12, background: '#4F7CFF', color: 'white', border: 'none', cursor: 'pointer' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

            </div>
        </div>
    );
}
