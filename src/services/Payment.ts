// servicios/Payment.ts
import { SquareCaller } from '@/infra/payment/SquareCaller';
import { PaymentCaller } from '@/infra/payment/PaymentCaller';
import { db } from '@/infra/api/FirebaseConfig';
import { PaymentResource } from '@/infra/payment/PaymentResource';
import { PaymentService } from '@/primary/payment';

// Crear la cadena de dependencias
const squareCaller = new SquareCaller();
const paymentCaller = new PaymentCaller(db);
const paymentResource = new PaymentResource(squareCaller, paymentCaller);
const paymentService = new PaymentService();

export { paymentService };
