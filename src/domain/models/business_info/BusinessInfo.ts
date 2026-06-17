export interface BusinessInfo {
    id: string,
    paymentMethods: PaymentMethods[],
    cancellationPolicy: string,
    chatbotContext: string,
    businessHours: BusinessHour[]
}

export interface BusinessHour {
    dayOfWeek: number
    openTime: string
    closeTime: string
}

export const paymentMethods = {
  EFECTIVO: "Efectivo",
  DEBITO: "Débito",
  CREDITO: "Crédito",
  TRANSFERENCIA: "Transferencia",
  MERCADO_PAGO: "Mercado Pago",
} as const

export type PaymentMethods = typeof paymentMethods[keyof typeof paymentMethods]