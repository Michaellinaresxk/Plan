// utils/priceCalculator.ts

export interface PriceBreakdown {
  subtotal: number;
  tax: number;
  total: number;
  details: PriceDetail[];
}

export interface PriceDetail {
  label: string;
  amount: number;
  type?: 'base' | 'addon' | 'fee' | 'discount';
}

export interface TaxConfig {
  rate: number; // Porcentaje (ej: 5 para 5%)
  label?: string;
}

/**
 * UTILIDAD GENÉRICA: Calcular precio con impuestos
 * Esta función es la BASE para TODOS los formularios
 *
 * @param subtotal - El precio calculado ANTES de impuestos
 * @param taxRate - Porcentaje de impuesto (default: 5)
 * @returns Objeto con subtotal, tax y total
 *
 * @example
 * // Para cualquier formulario
 * const breakdown = calculatePriceWithTax(100, 5);
 * // { subtotal: 100, tax: 5, total: 105 }
 */
export const calculatePriceWithTax = (
  subtotal: number,
  taxRate: number = 5
): PriceBreakdown => {
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount;

  return {
    subtotal: roundToDecimals(subtotal, 2),
    tax: roundToDecimals(taxAmount, 2),
    total: roundToDecimals(total, 2),
    details: [],
  };
};

/**
 * UTILIDAD ESPECÍFICA BABYSITTER: Calcular precio por niños y horas
 * Esta es la lógica ESPECÍFICA del formulario de babysitter
 *
 * @param childrenCount - Cantidad de niños
 * @param hours - Cantidad de horas
 * @param pricePerChildPerHour - Precio por niño por hora (default: 20)
 * @param taxRate - Porcentaje de impuesto (default: 5)
 * @returns Desglose completo con impuestos
 *
 * @example
 * const breakdown = calculateBabysitterPrice(2, 3, 20, 5);
 * // Cálculo: 2 niños × 3 horas × $20 = $120
 * // Impuesto: $120 × 5% = $6
 * // Total: $126
 */
export const calculateBabysitterPrice = (
  childrenCount: number,
  hours: number,
  pricePerChildPerHour: number = 20,
  taxRate: number = 5
): PriceBreakdown => {
  // Lógica específica: niños × horas × precio
  const subtotal = childrenCount * hours * pricePerChildPerHour;

  const breakdown = calculatePriceWithTax(subtotal, taxRate);

  return {
    ...breakdown,
    details: [
      {
        label: `${childrenCount} niño${
          childrenCount > 1 ? 's' : ''
        } × ${hours} hora${hours > 1 ? 's' : ''} × $${pricePerChildPerHour}`,
        amount: subtotal,
        type: 'base',
      },
    ],
  };
};

/**
 * CLASE GENÉRICA: Constructor de precios progresivo
 * Úsala cuando tengas lógica compleja con múltiples addons
 *
 * @example
 * // Para un formulario de limpieza con extras
 * const breakdown = new PriceBuilder(basePrice, 'Servicio Base')
 *   .addItem('Limpieza profunda', 30)
 *   .addItem('Productos especiales', 15)
 *   .withTax(5)
 *   .build();
 */
export class PriceBuilder {
  private subtotal: number;
  private details: PriceDetail[] = [];
  private taxConfig?: TaxConfig;

  constructor(basePrice: number, baseLabel: string = 'Base Price') {
    this.subtotal = basePrice;
    this.details.push({
      label: baseLabel,
      amount: basePrice,
      type: 'base',
    });
  }

  /**
   * Agrega un item al precio
   */
  addItem(
    label: string,
    amount: number,
    type: PriceDetail['type'] = 'addon'
  ): this {
    if (amount > 0) {
      this.subtotal += amount;
      this.details.push({ label, amount, type });
    }
    return this;
  }

  /**
   * Agrega un multiplicador (ej: precio × cantidad)
   */
  addMultiplier(label: string, pricePerUnit: number, quantity: number): this {
    const totalAmount = pricePerUnit * quantity;
    if (totalAmount > 0) {
      this.subtotal += totalAmount;
      this.details.push({
        label: `${label} (${quantity} × $${pricePerUnit})`,
        amount: totalAmount,
        type: 'addon',
      });
    }
    return this;
  }

  /**
   * Agrega un item condicional
   */
  addConditional(label: string, amount: number, condition: boolean): this {
    if (condition && amount > 0) {
      return this.addItem(label, amount, 'addon');
    }
    return this;
  }

  /**
   * Aplica un descuento
   */
  applyDiscount(label: string, amount: number): this {
    if (amount > 0) {
      this.subtotal -= amount;
      this.details.push({
        label,
        amount: -amount,
        type: 'discount',
      });
    }
    return this;
  }

  /**
   * Configura los impuestos (SIEMPRE 5% para todos los formularios)
   */
  withTax(rate: number = 5, label?: string): this {
    this.taxConfig = { rate, label: label || `Impuestos (${rate}%)` };
    return this;
  }

  /**
   * Construye el desglose final
   */
  build(): PriceBreakdown {
    const subtotal = roundToDecimals(this.subtotal, 2);

    if (this.taxConfig) {
      const taxAmount = (subtotal * this.taxConfig.rate) / 100;
      const total = subtotal + taxAmount;

      return {
        subtotal: roundToDecimals(subtotal, 2),
        tax: roundToDecimals(taxAmount, 2),
        total: roundToDecimals(total, 2),
        details: [...this.details],
      };
    }

    return {
      subtotal,
      tax: 0,
      total: subtotal,
      details: this.details,
    };
  }
}

/**
 * Redondea un número a ciertos decimales
 */
export const roundToDecimals = (
  value: number,
  decimals: number = 2
): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Formatea un precio a string con símbolo de moneda
 */
export const formatPrice = (
  amount: number,
  currency: string = '$',
  showDecimals: boolean = true
): string => {
  const formatted = showDecimals
    ? amount.toFixed(2)
    : Math.round(amount).toString();
  return `${currency}${formatted}`;
};

/**
 * Calcula duración en horas entre dos tiempos
 * Útil para formularios que necesitan calcular horas
 */
export const calculateDuration = (
  startTime: string,
  endTime: string,
  minimumHours: number = 0
): number => {
  if (!startTime || !endTime) return minimumHours;

  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  let duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  // Si el tiempo de fin es menor, asumimos que es al día siguiente
  if (duration < 0) {
    duration += 24;
  }

  return Math.max(duration, minimumHours);
};

// ============================================
// EJEMPLOS DE USO PARA DIFERENTES FORMULARIOS
// ============================================

/**
 * EJEMPLO 1: BABYSITTER FORM
 * Lógica: niños × horas × $20/hora + 5%
 */
export const exampleBabysitterCalculation = () => {
  const childrenCount = 2;
  const hours = 3;

  // Opción 1: Usar función específica (RECOMENDADO)
  const breakdown1 = calculateBabysitterPrice(childrenCount, hours, 20, 5);

  // Opción 2: Calcular manualmente y agregar tax
  const subtotal = childrenCount * hours * 20; // 2 × 3 × 20 = 120
  const breakdown2 = calculatePriceWithTax(subtotal, 5);

  console.log('Babysitter:', breakdown1);
  // { subtotal: 120, tax: 6, total: 126 }
};
