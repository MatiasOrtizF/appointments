import { useEffect, useState } from "react"
import { BusinessHour, BusinessInfo, PaymentMethods } from "../../../../domain/models/business_info/BusinessInfo"
import { adminRepository } from "../../../../data/repository/AdminRepository"
import { mapDatabaseErrorToMessage } from "../../../../errors/databaseErrorMessages"
import { CreateBusinessInfo } from "../../../../domain/models/business_info/CreateBusinessInfo"

export const useInfoAdmin = () => {
    const [info, setInfo] = useState<BusinessInfo | null>(null)

    const [newPaymentMethods, setNewPaymentMethods] = useState<BusinessInfo["paymentMethods"]>([])
    const [newCancellationPolicy, setNewCancellationPolicy] = useState<BusinessInfo["cancellationPolicy"]>("")
    const [newChatbotContext, setNewChatbotContext] = useState<BusinessInfo["chatbotContext"]>("")
    const [newBusinessHours, setNewBusinessHours] = useState<BusinessInfo["businessHours"]>([])
    const [businessHours, setBusinessHours] = useState([
        {
            dayOfWeek: 1,
            dayName: "Lunes",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
        {
            dayOfWeek: 2,
            dayName: "Martes",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
        {
            dayOfWeek: 3,
            dayName: "Miércoles",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
        {
            dayOfWeek: 4,
            dayName: "Jueves",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
        {
            dayOfWeek: 5,
            dayName: "Viernes",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
        {
            dayOfWeek: 6,
            dayName: "Sábado",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
        {
            dayOfWeek: 0,
            dayName: "Domingo",
            enabled: false,
            openTime: "00:00",
            closeTime: "00:00",
        },
    ]);

    const [editingInfo, setEditingInfo] = useState(false)
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchBusinessInfo()
    }, [])

    const fetchBusinessInfo = async () => {
        try {
            const result = await adminRepository.getBusinessInfo()

            if (result.ok) {
                setInfo(result.data)
                setNewPaymentMethods(result.data.paymentMethods)
                setNewChatbotContext(result.data.chatbotContext)
                setNewCancellationPolicy(result.data.cancellationPolicy)
                mapBusinessHours(result.data.businessHours);
            } else {
                if (result.error !== "not-found") {
                    setError(mapDatabaseErrorToMessage(result.error))
                }
            }

        } finally {
            setLoading(false)
        }
    }

    const editBusinessInfo = async () => {
        setEditingInfo(true)
        setError(null)

        if (isChanged()) {
            console.log(info)
            console.log("realizar los cambios.")
            if (isFormValid()) {
                const newBusinessHours = businessHours
                    .filter(day => day.enabled)
                    .map(day => ({
                        dayOfWeek: day.dayOfWeek,
                        openTime: day.openTime,
                        closeTime: day.closeTime,
                    }));

                setNewBusinessHours(newBusinessHours);
                const infoInput: CreateBusinessInfo = {
                    id: info?.id,
                    paymentMethods: newPaymentMethods,
                    cancellationPolicy: newCancellationPolicy,
                    chatbotContext: newChatbotContext,
                    businessHours: newBusinessHours
                };
                console.log("mandar esta info: ", infoInput)
                const result = await adminRepository.saveBusinessInfo(infoInput)
                if (result.ok) {
                    setSuccess(true)
                } else {
                    setError(mapDatabaseErrorToMessage(result.error))
                }

            } else {
                setError("Debes completar todos los campos")
                setEditingInfo(false)
            }
            /*if (selectedStatus != null && isFormValid()) {
                console.log("primera opcion ", newImage.trim().length > 0, "segunda opcion ", newImage.trim())
                const employeeInput: EditEmployeeInput = {
                    id: employeeId,
                    name: name,
                    lastName: lastName,
                    status: selectedStatus,
                    newImage: newImage,
                    oldImageUrl: image,
                    imageChanged: newImage.trim().length > 0
                };
                try {
                    const result = await editEmployeeUsecase(employeeInput)

                    if (result.ok) {
                        setSuccess(true)
                    } else {
                        setError(mapDatabaseErrorToMessage(result.error))
                        setEditingEmployee(false)
                    }
                } finally {
                    setEditingEmployee(false)
                }
            } else {
                setError("Debes completar todos los campos")
                setEditingEmployee(false)
            }*/
        } else {
            setError("Debes realizar almenos un cambio")
            setEditingInfo(false)
        }
    }

    const toggleSelectedMethod = (method: PaymentMethods) => {
        setNewPaymentMethods(prevList =>
            prevList.includes(method)
                ? prevList.filter(item => item !== method) // lo saco
                : [...prevList, method] // lo agrego
        )
    }

    const toggleDay = (index: number) => {
        setBusinessHours(prev =>
            prev.map((day, i) =>
                i === index
                    ? {
                        ...day,
                        enabled: !day.enabled,
                    }
                    : day
            )
        );
    };


    const isFormValid = () => {
        return (
            newCancellationPolicy.trim() !== "" &&
            newChatbotContext.trim() !== ""
        );
    };

    const isChanged = () => {
        return (
            info?.cancellationPolicy != newCancellationPolicy ||
            info?.chatbotContext != newChatbotContext
        )
    }

    const mapBusinessHours = (
        hoursFromDb: BusinessHour[]
    ) => {
        setBusinessHours(prev =>
            prev.map(day => {

                const existingHour = hoursFromDb.find(
                    hour => hour.dayOfWeek === day.dayOfWeek
                );

                return existingHour
                    ? {
                        ...day,
                        enabled: true,
                        openTime: existingHour.openTime.slice(0, 5),
                        closeTime: existingHour.closeTime.slice(0, 5),
                    }
                    : {
                        ...day,
                        enabled: false,
                    };
            })
        );
    };

    return {
        info,
        newPaymentMethods, setNewPaymentMethods,
        newCancellationPolicy, setNewCancellationPolicy,
        newChatbotContext, setNewChatbotContext,
        newBusinessHours, setNewBusinessHours,
        businessHours, setBusinessHours,
        editingInfo, setEditingInfo,
        loading,
        success,
        error, setError,
        editBusinessInfo,
        toggleSelectedMethod,
        toggleDay
    }
}