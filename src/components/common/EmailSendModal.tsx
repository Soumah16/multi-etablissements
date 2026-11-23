import React, { useEffect, useState } from 'react';
import {
  Mail,
  Send,
  X,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import {
  buildGmailComposeUrl,
  buildMailtoUrl,
  dispatchEmailViaServer
} from '../../utils/emailDispatch';
import { buildWhatsAppUrl } from '../../utils/whatsapp';

export interface EmailRecipientOption {
  label: string;
  email: string;
}

export interface EmailSendModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  recipientOptions: EmailRecipientOption[];
  defaultSubject: string;
  defaultBody: string;
  whatsappPhone?: string;
  onDispatched?: (channel: 'email' | 'whatsapp', recipient: string) => void;
}

export const EmailSendModal: React.FC<EmailSendModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  recipientOptions,
  defaultSubject,
  defaultBody,
  whatsappPhone,
  onDispatched
}) => {
  const validOptions = recipientOptions.filter(o => o.email && o.email.trim());
  const [toEmail, setToEmail] = useState(validOptions[0]?.email || '');
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [sendingServer, setSendingServer] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const wasOpenRef = React.useRef(false);

  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      const firstValid = recipientOptions.find(o => o.email && o.email.trim())?.email || '';
      setToEmail(firstValid);
      setSubject(defaultSubject);
      setBody(defaultBody);
      setFeedback(null);
      setCopied(false);
      setSendingServer(false);
    }
    wasOpenRef.current = isOpen;
  }, [isOpen, defaultSubject, defaultBody, recipientOptions]);

  if (!isOpen) return null;

  const trimmedEmail = toEmail.trim();
  const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
  const gmailUrl = buildGmailComposeUrl(trimmedEmail, subject, body);
  const mailtoUrl = buildMailtoUrl(trimmedEmail, subject, body);
  const whatsappUrl = whatsappPhone ? buildWhatsAppUrl(whatsappPhone, body) : '';

  const handleServerSend = async () => {
    if (!hasValidEmail) {
      setFeedback({ type: 'error', text: 'Veuillez saisir une adresse email valide.' });
      return;
    }
    setSendingServer(true);
    setFeedback(null);
    const res = await dispatchEmailViaServer({ to: trimmedEmail, subject, body });
    setSendingServer(false);

    if (res.deliveryStatus === 'sent') {
      setFeedback({ type: 'success', text: res.message });
      onDispatched?.('email', trimmedEmail);
    } else {
      setFeedback({ type: 'info', text: res.message });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard errors
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-2.5 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-blue-200 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-teal-50 via-blue-50 to-white border-b border-blue-100 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-black text-blue-950 truncate">{title}</h3>
              {subtitle && <p className="text-[11px] text-slate-600 truncate">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-blue-950 rounded-lg hover:bg-blue-100/60 shrink-0"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11px] font-medium">
            <strong>Envoi externe par Email ou WhatsApp :</strong> Vous pouvez envoyer ce message directement par <strong>Gmail</strong>, votre application <strong>Mail</strong>, ou <strong>WhatsApp</strong>.
          </div>

          {validOptions.length > 0 && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-600">
                Destinataires enregistrés :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {validOptions.map((opt, idx) => {
                  const selected = trimmedEmail.toLowerCase() === opt.email.trim().toLowerCase();
                  return (
                    <button
                      key={`${opt.label}-${idx}`}
                      type="button"
                      onClick={() => setToEmail(opt.email.trim())}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                        selected
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-blue-50'
                      }`}
                    >
                      {opt.label} : <span className="font-mono">{opt.email}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Adresse Email du destinataire *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={toEmail}
                onChange={e => setToEmail(e.target.value)}
                placeholder="ex: parent@gmail.com"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-mono focus:outline-hidden focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Objet de l'email</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-blue-950 font-semibold focus:outline-hidden focus:border-teal-600 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Message &amp; Identifiants</label>
            <textarea
              rows={7}
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-mono text-[11px] leading-relaxed focus:outline-hidden focus:border-teal-600 focus:bg-white"
            />
          </div>

          {feedback && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 text-[11px] font-medium ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : feedback.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Direct Free Send Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <a
              href={hasValidEmail ? gmailUrl : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => {
                if (!hasValidEmail) {
                  e.preventDefault();
                  setFeedback({ type: 'error', text: "Saisissez d'abord une adresse email valide." });
                  return;
                }
                onDispatched?.('email', trimmedEmail);
              }}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Ouvrir dans Gmail</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <a
              href={hasValidEmail ? mailtoUrl : undefined}
              onClick={e => {
                if (!hasValidEmail) {
                  e.preventDefault();
                  setFeedback({ type: 'error', text: "Saisissez d'abord une adresse email valide." });
                  return;
                }
                onDispatched?.('email', trimmedEmail);
              }}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-sm transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Application Mail (mailto)</span>
            </a>

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onDispatched?.('whatsapp', whatsappPhone || '')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer par WhatsApp</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Message copié ✓' : 'Copier le message'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-blue-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            disabled={sendingServer}
            onClick={handleServerSend}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer disabled:opacity-60"
            title="Envoi automatique si une clé Resend ou Webhook Email serveur est configurée"
          >
            {sendingServer ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Envoi Auto Serveur (Resend)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
