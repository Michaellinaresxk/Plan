// utils/emailUtils.ts

interface EmailConfig {
  to: string;
  subject?: string;
  body?: string;
  cc?: string[];
  bcc?: string[];
}

/**
 * Genera URL mailto con parámetros personalizables
 */
export const createMailtoUrl = (config: EmailConfig): string => {
  const { to, subject, body, cc, bcc } = config;

  const params = new URLSearchParams();

  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  if (cc && cc.length > 0) params.set('cc', cc.join(','));
  if (bcc && bcc.length > 0) params.set('bcc', bcc.join(','));

  return `mailto:${to}${params.toString() ? '?' + params.toString() : ''}`;
};

/**
 * Templates predefinidos de emails
 */
export const emailTemplates = {
  inquiry: (language: 'en' | 'es' = 'en') => ({
    subject:
      language === 'es'
        ? 'Consulta sobre servicios Lux Punta Cana'
        : 'Inquiry about Lux Punta Cana services',
    body:
      language === 'es'
        ? `Hola,

Me interesa conocer más información sobre sus servicios en Punta Cana.

Datos de contacto:
- Nombre: 
- Teléfono: 
- Fechas de viaje: 
- Número de huéspedes: 
- Servicios de interés: 

Por favor, contáctenme para coordinar una consulta.

Saludos cordiales.`
        : `Hello,

I'm interested in learning more about your services in Punta Cana.

Contact information:
- Name: 
- Phone: 
- Travel dates: 
- Number of guests: 
- Services of interest: 

Please contact me to arrange a consultation.

Best regards.`,
  }),

  booking: (language: 'en' | 'es' = 'en') => ({
    subject:
      language === 'es'
        ? 'Solicitud de reserva - Lux Punta Cana'
        : 'Booking Request - Lux Punta Cana',
    body:
      language === 'es'
        ? `Estimados,

Quisiera hacer una reserva para los siguientes servicios:

Información del viaje:
- Fechas: 
- Número de huéspedes: 
- Alojamiento: 
- Servicios solicitados: 

Datos de contacto:
- Nombre: 
- Email: 
- Teléfono: 

Aguardo su respuesta.

Cordiales saludos.`
        : `Dear Team,

I would like to make a booking for the following services:

Trip Information:
- Dates: 
- Number of guests: 
- Accommodation: 
- Requested services: 

Contact Information:
- Name: 
- Email: 
- Phone: 

Looking forward to your response.

Best regards.`,
  }),
};

/**
 * Hook personalizado para manejar emails
 */
export const useEmailContact = () => {
  const companyEmail = 'info@luxpuntacana.com'; // Configura tu email aquí

  const sendInquiry = (language: 'en' | 'es' = 'en') => {
    const template = emailTemplates.inquiry(language);
    const mailtoUrl = createMailtoUrl({
      to: companyEmail,
      subject: template.subject,
      body: template.body,
    });

    window.location.href = mailtoUrl;
  };

  const sendBookingRequest = (language: 'en' | 'es' = 'en') => {
    const template = emailTemplates.booking(language);
    const mailtoUrl = createMailtoUrl({
      to: companyEmail,
      subject: template.subject,
      body: template.body,
    });

    window.location.href = mailtoUrl;
  };

  const sendCustomEmail = (config: Partial<EmailConfig>) => {
    const mailtoUrl = createMailtoUrl({
      to: companyEmail,
      ...config,
    });

    window.location.href = mailtoUrl;
  };

  return {
    sendInquiry,
    sendBookingRequest,
    sendCustomEmail,
    companyEmail,
  };
};
