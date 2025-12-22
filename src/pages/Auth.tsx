import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Auth.css';

const Auth = () => {
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        setIsPanelActive(true);
        setError(null);
    };

    const handleLoginClick = () => {
        setIsPanelActive(false);
        setError(null);
    };

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);
            const { error } = await authService.signInWithGoogle();
            if (error) throw error;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await authService.signUpWithEmail(email, password, fullName);
            if (error) throw error;
            if (data.user) {
                // Usually requires email confirmation, inform user or navigate
                alert('Check your email for confirmation link!');
                setIsPanelActive(false); // Switch to login view
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await authService.signInWithEmail(email, password);
            if (error) throw error;
            if (data.user) {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="ltr" className="auth-page-wrapper">
            <div className={`auth-wrapper ${isPanelActive ? 'panel-active' : ''}`} id="authWrapper">
                <div className="auth-form-box register-form-box">
                    <form onSubmit={handleEmailRegister}>
                        <h1>Create Account</h1>
                        <div className="social-links">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }} aria-label="Google"><i className="fab fa-google"></i></a>
                        </div>
                        <span>or use your email for registration</span>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {error && isPanelActive && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        <button type="submit" disabled={loading}>{loading ? 'Signing Up...' : 'Sign Up'}</button>
                        <div className="mobile-switch">
                            <p>Already have an account?</p>
                            <button type="button" onClick={handleLoginClick} id="mobileLoginBtn">Sign In</button>
                        </div>
                    </form>
                </div>
                <div className="auth-form-box login-form-box">
                    <form onSubmit={handleEmailLogin}>
                        <h1>Sign In</h1>
                        <div className="social-links">
                            <a href="#" onClick={(e) => { e.preventDefault(); handleGoogleLogin(); }} aria-label="Google"><i className="fab fa-google"></i></a>
                        </div>
                        <span>or use your account</span>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <a href="#">Forgot your password?</a>
                        {error && !isPanelActive && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        <button type="submit" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                        <div className="mobile-switch">
                            <p>Don't have an account?</p>
                            <button type="button" onClick={handleRegisterClick} id="mobileRegisterBtn">Sign Up</button>
                        </div>
                    </form>
                </div>
                <div className="slide-panel-wrapper">
                    <div className="slide-panel">
                        <div className="panel-content panel-content-left">
                            <h1>Welcome Back!</h1>
                            <p>Stay connected by logging in with your credentials and continue your experience</p>
                            <button type="button" className="transparent-btn" onClick={handleLoginClick} id="loginBtn">Sign In</button>
                        </div>
                        <div className="panel-content panel-content-right">
                            <h1>Hey There!</h1>
                            <p>Begin your amazing journey by creating an account with us today</p>
                            <button type="button" className="transparent-btn" onClick={handleRegisterClick} id="registerBtn">Sign Up</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;
