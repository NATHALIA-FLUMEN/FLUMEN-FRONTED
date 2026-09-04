import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Play, Home, Loader2 } from 'lucide-react';
import { paymentService } from '../services/api.js';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verificando');
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');
  const videoId = searchParams.get('video');

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setError('No se encontró la sesión de pago');
      return;
    }

    const confirm = async () => {
      try {
        await paymentService.confirm(sessionId);
        setStatus('exito');
      } catch (err) {
        setError(err.message);
        setStatus('error');
      }
    };
    confirm();
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16">
      <div className="bg-dark-800 rounded-3xl p-8 max-w-md w-full text-center border border-emerald-500/30 shadow-glow animate-slide-up">
        {status === 'verificando' && (
          <div className="py-8">
            <Loader2 className="w-14 h-14 text-brand-500 animate-spin mx-auto mb-4" />
            <p className="text-white font-semibold">Verificando tu pago...</p>
          </div>
        )}

        {status === 'exito' && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              ¡Pago exitoso!
            </h1>
            <p className="text-gray-400 mb-2">
              Ya tienes acceso al video. Disfruta del contenido.
            </p>
            <p className="text-sm text-emerald-400 font-medium mb-6">
              Tu compra fue confirmada correctamente
            </p>
            <div className="space-y-3">
              {videoId && (
                <button
                  onClick={() => navigate(`/video/${videoId}`)}
                  className="btn-primary w-full"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Reproducir ahora
                </button>
              )}
              <button
                onClick={() => navigate('/explorar')}
                className="btn-secondary w-full"
              >
                <Home className="w-5 h-5" />
                Seguir explorando
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 rounded-full bg-brand-600/20 flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">
              No pudimos confirmar el pago
            </h1>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => navigate('/explorar')}
              className="btn-primary w-full"
            >
              Volver a explorar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
