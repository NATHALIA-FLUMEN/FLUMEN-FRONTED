import { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle2, Rocket } from 'lucide-react';
import Spinner from './Spinner.jsx';

export default function PaymentModal({ video, onClose, onSuccess }) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 16) {
      setError('Ingresa un número de tarjeta válido (16 dígitos)');
      return;
    }
    if (!cardName.trim()) {
      setError('Ingresa el nombre del titular');
      return;
    }
    if (expiry.length < 5) {
      setError('Ingresa una fecha de expiración válida');
      return;
    }
    if (cvv.length < 3) {
      setError('Ingresa un código de seguridad válido');
      return;
    }

    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-dark-800 rounded-3xl p-8 max-w-md w-full text-center border border-emerald-500/30 shadow-glow animate-slide-up" onClick={(e) => e.stopPropagation()}>
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">¡Compra exitosa!</h3>
          <p className="text-gray-400 mb-2">
            Ahora tienes acceso a:
          </p>
          <p className="font-semibold text-brand-400 mb-6">{video.title}</p>
          <button className="btn-primary w-full" onClick={() => { onSuccess?.(); onClose(); }}>
            <Rocket className="w-5 h-5" />
            Reproducir ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-dark-800 rounded-3xl p-6 sm:p-8 max-w-md w-full border border-dark-500 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-500" />
              Desbloquear Premium
            </h3>
            <p className="text-sm text-gray-400 mt-1">{video.title}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-dark-700/50 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Precio</p>
            <p className="text-3xl font-bold text-white">${video.price.toFixed(2)}</p>
          </div>
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-glow">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Número de tarjeta</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              className="input-app font-mono"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Nombre del titular</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value.toUpperCase())}
              placeholder="FLUMEN USER"
              className="input-app uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Expiración</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                placeholder="MM/AA"
                className="input-app font-mono"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="•••"
                className="input-app font-mono"
                inputMode="numeric"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-brand-400 bg-brand-600/10 border border-brand-600/30 rounded-xl p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={processing}
            className="btn-primary w-full !py-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" color="white" />
                Procesando pago...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Pagar ${video.price.toFixed(2)} de forma segura
              </span>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-500">
            🔒 Pago seguro cifrado · Demo educativa. No se procesan pagos reales.
          </p>
        </form>
      </div>
    </div>
  );
}
