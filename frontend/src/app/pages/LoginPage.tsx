import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { LanguageToggle } from '../components/LanguageToggle';
import { Coffee } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'phone' | 'otp' | 'newPassword'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { login } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        if (loggedInUser.role === 1) {
          setLanguage('jp');
          navigate('/home');
        } else if (loggedInUser.role === 2) {
          setLanguage('vn');
          navigate('/owner');
        } else if (loggedInUser.role === 3) {
          setLanguage('vn');
          navigate('/admin');
        } else if (loggedInUser.role === 4) {
          setLanguage('vn');
          navigate('/staff');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : (language === 'jp' ? 'ログインに失敗しました' : 'Đăng nhập thất bại'));
    }
  };

  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_BASE_URL as string;

  const handleSendOTP = async () => {
    if (!phone) {
      setError(language === 'jp' ? '電話番号を入力してください' : 'Vui lòng nhập số điện thoại');
      return;
    }
    setIsOtpLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (response.ok) {
        setForgotPasswordStep('otp');
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || (language === 'jp' ? 'OTPの送信に失敗しました' : 'Gửi OTP thất bại'));
      }
    } catch {
      setError(language === 'jp' ? 'ネットワークエラーが発生しました' : 'Lỗi kết nối mạng');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError(language === 'jp' ? '6桁のOTPを入力してください' : 'Vui lòng nhập đủ 6 chữ số OTP');
      return;
    }
    setIsOtpLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      if (response.ok) {
        setForgotPasswordStep('newPassword');
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || (language === 'jp' ? 'OTPが正しくありません' : 'Mã OTP không đúng'));
      }
    } catch {
      setError(language === 'jp' ? 'ネットワークエラーが発生しました' : 'Lỗi kết nối mạng');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError(language === 'jp' ? 'パスワードが一致しません' : 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (newPassword.length < 6) {
      setError(language === 'jp' ? 'パスワードは6文字以上にしてください' : 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setIsOtpLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword })
      });
      if (response.ok) {
        setShowForgotPassword(false);
        setForgotPasswordStep('phone');
        setPhone('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        alert(language === 'jp' ? 'パスワードを再設定しました。ログインしてください。' : 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.');
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || (language === 'jp' ? 'パスワードの再設定に失敗しました' : 'Đặt lại mật khẩu thất bại'));
      }
    } catch {
      setError(language === 'jp' ? 'ネットワークエラーが発生しました' : 'Lỗi kết nối mạng');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep('phone');
    setPhone('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coffee className="size-6 text-amber-700" />
            <h1 className="font-bold">どこカフェ</h1>
          </div>
          <LanguageToggle />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">{t('login')}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('emailOrPhone')}</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full">
              {t('login')}
            </Button>

            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => setShowForgotPassword(true)}
            >
              {t('forgotPassword')}
            </Button>

            <div className="text-center text-sm text-gray-600">
              {t('noAccount')}{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                {t('register')}
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{t('forgotPassword')}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {forgotPasswordStep === 'phone' && (
              <>
                <div>
                  <Label htmlFor="phone">{t('phoneNumber')}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="mt-2"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button onClick={handleSendOTP} className="w-full" disabled={isOtpLoading}>
                  {isOtpLoading ? '...' : t('sendOTP')}
                </Button>
              </>
            )}

            {forgotPasswordStep === 'otp' && (
              <>
                <div className="space-y-2">
                  <Label>{t('enterOTP')}</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button onClick={handleVerifyOTP} className="w-full" disabled={isOtpLoading}>
                  {isOtpLoading ? '...' : t('verifyOTP')}
                </Button>
              </>
            )}

            {forgotPasswordStep === 'newPassword' && (
              <>
                <div>
                  <Label htmlFor="newPassword">{t('newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-2"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button onClick={handleResetPassword} className="w-full" disabled={isOtpLoading}>
                  {isOtpLoading ? '...' : t('submit')}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
