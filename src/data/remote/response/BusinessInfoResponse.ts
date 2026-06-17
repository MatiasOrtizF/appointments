import { BusinessHour, BusinessInfo, PaymentMethods } from "../../../domain/models/business_info/BusinessInfo"

export interface BusinessInfoResponse {
    business_id: string
    payment_methods: PaymentMethods[],
    cancellation_policy: string,
    chatbot_context: string,
    business_hours: BusinessHourResponse[]
}

interface BusinessHourResponse {
    day_of_week: number
    open_time: string
    close_time: string
}

const businessHourToDomain = (
    response: BusinessHourResponse
): BusinessHour => {
    return {
        dayOfWeek: response.day_of_week,
        openTime: response.open_time,
        closeTime: response.close_time,
    }
}

export const businessInfoToDomain = (
    response: BusinessInfoResponse
): BusinessInfo => {
    return {
        id: response.business_id,
        paymentMethods: response.payment_methods,
        cancellationPolicy: response.cancellation_policy,
        chatbotContext: response.chatbot_context,
        businessHours: response.business_hours.map(
            businessHourToDomain
        ),
    }
}