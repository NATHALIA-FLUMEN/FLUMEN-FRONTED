import { useEffect, useState } from 'react';
import { Save, Palette, Type, Mail, MousePointerClick, ToggleLeft, RefreshCcw } from 'lucide-react';
import { adminService } from '../../services/api.js';
import Spinner from '../../components/ui/Spinner.jsx';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [accentPreview, setAccentPreview] = useState('#00e5ff');

  useEffect(() => {
    adminService
      .getSettings()
      .then((res) => {
        setSettings(res.data || {});
        if (res.data?.accentColor) setAccentPreview(res.data.accentColor);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
    if (key === 'accentColor') setAccentPreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updates = { ...settings };
      delete updates.id;
      await adminService.updateSettings(updates);
      toast.success('Configuración guardada. Los cambios se aplican al instante.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('¿Restablecer todos los textos a los valores por defecto?')) return;
    const reset = {
      siteName: 'Flumen',
      tagline: 'Premium Videos',
      heroTitle: 'Flumen Originals',
      heroSubtitle: 'Experiencia visual en 4K Ultra HD',
      heroDescription: 'Descubre contenido exclusivo, documentales y series premium solo para suscriptores de Flumen.',
      heroButton: 'Reproducir ahora',
      heroButtonSecondary: 'Más información',
      footerText: 'Tu plataforma de referencia para contenido de video de alta calidad.',
      accentColor: '#00e5ff',
      supportEmail: 'soporte@flumen.com',
      enableRegistration: 'true',
      enablePayments: 'true',
      maintenanceMode: 'false'
    };
    setSettings(reset);
    setAccentPreview('#00e5ff');
    try {
      await adminService.updateSettings(reset);
      toast.success('Configuración restablecida');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading || !settings) {
    return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;
  }

  const section = (icon, title, desc) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-xl bg-brand-600/20 flex items-center justify-center text-brand-500">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Personalizar sitio</h1>
          <p className="text-gray-400 text-sm mt-1">Edita los textos y la apariencia de tu página</p>
        </div>
        <button onClick={handleReset} className="btn-secondary !py-2.5">
          <RefreshCcw className="w-4 h-4" />
          Restablecer
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        <div className="card-surface p-6">
          {section(<Type className="w-5 h-5" />, 'Identidad', 'Nombre y texto del pie de página')}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nombre del sitio</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="input-app"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Eslogan</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                className="input-app"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Texto del pie de página</label>
            <textarea
              value={settings.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="input-app min-h-[70px]"
            />
          </div>
        </div>

        <div className="card-surface p-6">
          {section(<MousePointerClick className="w-5 h-5" />, 'Banner principal (Hero)', 'El gran titular de la portada')}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Título</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                className="input-app"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Subtítulo</label>
              <input
                type="text"
                value={settings.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className="input-app"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Descripción</label>
            <textarea
              value={settings.heroDescription}
              onChange={(e) => handleChange('heroDescription', e.target.value)}
              className="input-app min-h-[80px]"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Botón principal</label>
              <input
                type="text"
                value={settings.heroButton}
                onChange={(e) => handleChange('heroButton', e.target.value)}
                className="input-app"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Botón secundario</label>
              <input
                type="text"
                value={settings.heroButtonSecondary}
                onChange={(e) => handleChange('heroButtonSecondary', e.target.value)}
                className="input-app"
              />
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          {section(<Palette className="w-5 h-5" />, 'Apariencia', 'Personaliza los colores de la marca')}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Color principal</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => handleChange('accentColor', e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer bg-dark-700 border border-dark-500"
                />
                <span
                  className="text-sm font-mono px-3 py-2 rounded-lg"
                  style={{ backgroundColor: accentPreview + '22', color: accentPreview }}
                >
                  {settings.accentColor}
                </span>
              </div>
            </div>
            <div className="ml-auto text-center">
              <p className="text-xs text-gray-500 mb-2">Vista previa</p>
              <div
                className="w-24 h-14 rounded-xl flex items-center justify-center text-white text-xs font-semibold shadow-lg"
                style={{ backgroundColor: accentPreview }}
              >
                Flumen
              </div>
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          {section(<Mail className="w-5 h-5" />, 'Contacto', 'Email de soporte')}
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => handleChange('supportEmail', e.target.value)}
            className="input-app"
          />
        </div>

        <div className="card-surface p-6">
          {section(<ToggleLeft className="w-5 h-5" />, 'Opciones de plataforma', 'Activa o desactiva funciones')}
          <div className="space-y-3">
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-white">Permitir registro de usuarios</p>
                <p className="text-xs text-gray-500">Si se desactiva, nadie puede crear cuentas nuevas</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableRegistration === 'true'}
                onChange={(e) => handleChange('enableRegistration', String(e.target.checked))}
                className="w-5 h-5 accent-brand-600"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-white">Habilitar pagos</p>
                <p className="text-xs text-gray-500">Activa las compras de videos premium con Stripe</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enablePayments === 'true'}
                onChange={(e) => handleChange('enablePayments', String(e.target.checked))}
                className="w-5 h-5 accent-brand-600"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div>
                <p className="text-sm font-medium text-white">Modo mantenimiento</p>
                <p className="text-xs text-gray-500">Muestra una pantalla de mantenimiento a los visitantes</p>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode === 'true'}
                onChange={(e) => handleChange('maintenanceMode', String(e.target.checked))}
                className="w-5 h-5 accent-brand-600"
              />
            </label>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? <Spinner size="sm" color="white" /> : (
            <>
              <Save className="w-4 h-4" />
              Guardar configuración
            </>
          )}
        </button>
      </form>
    </div>
  );
}
