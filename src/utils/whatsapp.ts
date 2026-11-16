import { School } from '../types';

/**
 * Nettoie un numéro de téléphone et le normalise au format international WhatsApp (sans "+").
 * Pour les numéros guinéens locaux à 9 chiffres commençant par 6 (ex: 622102030), ajoute "224".
 */
export function sanitizeWhatsAppDigits(phone?: string): string {
  if (!phone) return '';
  let digits = phone.replace(/[^\d]/g, '');
  if (!digits) return '';
  if (digits.startsWith('00')) {
    digits = digits.slice(2);
  }
  if (digits.length === 9 && digits.startsWith('6')) {
    digits = `224${digits}`;
  }
  return digits;
}

/**
 * Construit un lien officiel https://wa.me/... prêt à rediriger vers WhatsApp / WhatsApp Web.
 */
export function buildWhatsAppUrl(phone?: string, message?: string): string {
  const digits = sanitizeWhatsAppDigits(phone);
  if (digits.length < 8) return '';
  if (message && message.trim()) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(message.trim())}`;
  }
  return `https://wa.me/${digits}`;
}

/**
 * Retourne le numéro WhatsApp configuré pour l'établissement (ou son téléphone par défaut).
 */
export function getSchoolWhatsAppNumber(school?: School | null): string {
  if (!school) return '';
  return (school.whatsappNumber && school.whatsappNumber.trim()) || school.phone || '';
}

/**
 * Correspondance souple entre identifiant de session (ECOLE-001, ECOLE-002, ECOLE-003 ou sch-gn-*)
 * et la liste des établissements de la plateforme.
 */
const SCHOOL_ALIAS_MAP: Record<string, string> = {
  'ECOLE-001': 'sch-gn-ck-001',
  'ECOLE-002': 'sch-gn-kd-003',
  'ECOLE-003': 'sch-gn-ck-005',
};

export function resolveSchoolForContext(schools: School[], schoolIdOrAlias?: string): School | undefined {
  if (!schools.length) return undefined;
  if (!schoolIdOrAlias) return schools[0];

  const mappedId = SCHOOL_ALIAS_MAP[schoolIdOrAlias] || schoolIdOrAlias;
  return (
    schools.find(s => s.id === mappedId || s.id === schoolIdOrAlias || s.code === schoolIdOrAlias) ||
    schools[0]
  );
}
