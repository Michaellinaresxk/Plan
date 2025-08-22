// servicios/Payment.ts
import { StripeCaller } from '@/infra/payment/StripeCaller';
import { PaymentCaller } from '@/infra/payment/PaymentCaller';
import { db } from '@/infra/api/FirebaseConfig';
import { PaymentResource } from '@/infra/payment/PaymentResource';
import { PaymentService } from '@/primary/payment';

// Crear la cadena de dependencias
const stripeCaller = new StripeCaller();
const paymentCaller = new PaymentCaller(db);
const paymentResource = new PaymentResource(stripeCaller, paymentCaller);
const paymentService = new PaymentService();

export { paymentService };
