import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { Mail, Lock, User, ShieldCheck, Eye, EyeOff, LogIn, UserPlus, Sparkles } from 'lucide-react';
import Spinner from '../components/ui/Spinner.jsx';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useReCaptcha } from '../components/auth/ReCaptchaProvider.jsx';

export default function Auth() {
  const { login, register, loginGoogle, loading } = useAuth();
  const { execute } = useReCaptcha();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    adminCode: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const from = location.state?.from || '/';

  useEffect(() => {
    if (!submitting && !loading) {
      // reset
    }
  }, [submitting, loading]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldError('');

    if (mode === 'register' && form.name.trim().length < 2) {
      setFieldError('Ingresa tu nombre completo');
      return;
    }
    if (!form.email.trim() || !form.email.includes('@')) {
      setFieldError('Ingresa un email válido');
      return;
    }
    if (form.password.length < 8) {
      setFieldError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const recaptchaToken = await execute(mode === 'login' ? 'login' : 'register');
      const payload = { ...form, recaptchaToken };
      if (mode === 'login') {
        await login({ email: form.email, password: form.password, recaptchaToken });
      } else {
        await register(payload);
      }
      navigate(from);
    } catch (err) {
      // errores ya mostrados por toast en el context
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async (credentialResponse) => {
    try {
      const recaptchaToken = await execute('google');
      const payload = {
        idToken: credentialResponse.credential,
        name: form.name || undefined,
        email: form.email || undefined,
        adminCode: form.adminCode || undefined,
        recaptchaToken
      };
      await loginGoogle(payload);
      navigate(from);
    } catch {
      // errors via toast
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" withText={false} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
          </h1>
          <p className="text-gray-400 text-sm">
            {mode === 'login'
              ? 'Inicia sesión para disfrutar de Flumen'
              : 'Únete a la plataforma de videos premium'}
          </p>
        </div>

        <div className="card-surface p-6 sm:p-8">
          <div className="grid grid-cols-2 gap-2 p-1 bg-dark-700 rounded-xl mb-6">
            <button
              onClick={() => { setMode('login'); setFieldError(''); }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === 'login' ? 'bg-brand-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </button>
            <button
              onClick={() => { setMode('register'); setFieldError(''); }}
              className={`py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                mode === 'register' ? 'bg-brand-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nombre completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre completo"
                    className="input-app !pl-11"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="input-app !pl-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-app !pl-11 !pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {mode === 'register' && (
                <p className="text-[11px] text-gray-500 mt-1">Mínimo 8 caracteres, con mayúscula y número</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                  Código de administrador <span className="text-gray-600 normal-case font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  name="adminCode"
                  value={form.adminCode}
                  onChange={handleChange}
                  placeholder="Si tienes código de admin, ingrésalo"
                  className="input-app"
                />
                <p className="text-[11px] text-gray-500 mt-1">Con el código maestro obtienes rol de administrador</p>
              </div>
            )}

            {fieldError && (
              <p className="text-sm text-brand-400 bg-brand-600/10 border border-brand-600/30 rounded-xl p-3">
                {fieldError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || loading}
              className="btn-primary w-full !py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting || loading ? (
                <Spinner size="sm" color="white" />
              ) : mode === 'login' ? (
                'Iniciar sesión'
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-dark-500"></div>
            <span className="text-xs text-gray-500">o continúa con</span>
            <div className="flex-1 h-px bg-dark-500"></div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogle}
            onError={() => setFieldError('No se pudo iniciar sesión con Google')}
            theme="filled_black"
            shape="pill"
            size="large"
            width="100%"
            text="continue_with"
          />

          <p className="text-center text-[11px] text-gray-500 mt-6 leading-relaxed">
            <Sparkles className="w-3 h-3 inline-block mr-1 text-brand-500" />
            Al continuar aceptas los términos y la política de privacidad de Flumen.
            Protegido con verificación de seguridad.
          </p>
        </div>
      </div>
    </div>
  );
}
