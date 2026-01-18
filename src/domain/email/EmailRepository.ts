import { Email } from './Email';

export default interface EmailRepository {
  sendPaymentConfirmationEmail(email: Email): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;
}
