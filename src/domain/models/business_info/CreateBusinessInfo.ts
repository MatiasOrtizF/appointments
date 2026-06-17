import { BusinessHour, PaymentMethods } from "./BusinessInfo";

export interface CreateBusinessInfo {
    id?: string

    paymentMethods: PaymentMethods[],
    cancellationPolicy: string,
    chatbotContext: string,
    
    businessHours: BusinessHour[]
}