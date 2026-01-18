// services/Email.ts
import { EmailCaller } from '@/infra/email/EmailCaller';
import { EmailResource } from '@/infra/email/EmailResource';
import { EmailService } from '@/primary/email';

// Crear la cadena UNA VEZ (Singleton pattern)
// EmailCaller -> EmailResource -> EmailService
const emailCaller = new EmailCaller();
const emailResource = new EmailResource(emailCaller);
const emailService = new EmailService(emailResource);

export { emailService };
