import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/Toast';
import './Auth.css';

const Auth = () => {
    const toast = useToast();
    const [isPanelActive, setIsPanelActive] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkingSession, setCheckingSession] = useState(true);
    const navigate = useNavigate();

    // ═══════════════════════════════════════════════════════════════════
    // التحقق من الجلسة عند تحميل الصفحة (مهم جداً للموبايل بعد OAuth)
    // ═══════════════════════════════════════════════════════════════════
    useEffect(() => {
        // 1. التحقق إذا المستخدم مسجل دخول بالفعل
        const checkExistingSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    console.log('✅ Active session found, redirecting...');
                    navigate('/', { replace: true });
                    return;
                }
            } catch (err) {
                console.error('Session check error:', err);
            } finally {
                setCheckingSession(false);
            }
        };

        checkExistingSession();

        // 2. الاستماع لتغير حالة المصادقة (يلتقط OAuth callback)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔑 Auth event:', event);
            if (event === 'SIGNED_IN' && session?.user) {
                console.log('✅ User signed in via:', event);
                navigate('/', { replace: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

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
            setError(null);
            const { error } = await authService.signInWithGoogle();
            if (error) throw error;
            // OAuth سيعيد التوجيه تلقائياً — لا حاجة لـ navigate هنا
        } catch (err: any) {
            setError(err.message);
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
                toast.info('Check your email for confirmation link!');
                setIsPanelActive(false);
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
                // onAuthStateChange سيلتقط هذا ويعيد التوجيه
                navigate('/', { replace: true });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // شاشة تحميل أثناء التحقق من الجلسة
    if (checkingSession) {
        return (
            <div className="auth-page-wrapper flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

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
