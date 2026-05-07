import { useEffect, useState } from "react";
import { getUserInfoUsecase } from "../../../../domain/usecase/admin/getUserInfoUsecase";
import { mapUserErrorToMessage } from "../../../../errors/userError";
import { Service } from "../../../../domain/models/Service";
import { addServiceUsecase } from "../../../../domain/usecase/admin/addServiceUseCase";
import { CreateServiceRequest } from "../../../../domain/models/CreateServiceRequest";
import { mapServiceErrorToMessage } from "../../../../errors/serviceErrors";
import { getEmployeesUsecase } from "../../../../domain/usecase/admin/getEmployeesUsecase";
import { mapEmployeeErrorToMessage } from "../../../../errors/employeeError";

export const useAddService = () => {
    const [previewService, setPreviewService] = useState<Service>()
    const [image, setImage] = useState<Service["img"]>("")
    const [title, setTitle] = useState<Service["name"]>("")
    const [description, setDescription] = useState<Service["description"]>("")
    const [price, setPrice] = useState<Service["price"] | null>(null)
    const [duration, setDuration] = useState<Service["duration_min"] | null>(null)
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
    const [days, setDays] = useState<Service["days"]>([])
    const [hourStart, setHourStart] = useState<string | null>(null)
    const [hourEnd, setHourEnd] = useState<string | null>(null)

    const [employees, setEmployees] = useState<Service["employees"]>([])
    const [previewVisibility, setPreviewVisiblity] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [creatingService, setCreatingService] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const getUserInfo = async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await getUserInfoUsecase()

            if (result.ok) {
                const isAdmin = result.data.role === "admin"
                setIsAdmin(isAdmin)
                if (isAdmin) {
                    fetchEmployees()
                }
            } else {
                setError(mapUserErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const fetchEmployees = async () => {
        try {
            const result = await getEmployeesUsecase()

            if (result.ok) {
                setEmployees(result.data)
            } else {
                setError(mapEmployeeErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const addService = async () => {
        console.log("apretop")
        setCreatingService(true)
        setError(null)

        if (hourEnd != null && hourStart != null && isFormValid()) {
            const serviceInput: CreateServiceRequest = {
                name: title,
                description,
                price: price ?? 0,
                duration_min: duration ?? 0,
                img: image,
                employees: selectedEmployees,
                days,
                hourStart: hourStart,
                hourEnd: hourEnd
            };
            console.log("create este servicio: " + serviceInput)
            try {
                const result = await addServiceUsecase(serviceInput)

                if (result.ok) {
                    setSuccess(true)
                } else {
                    setError(mapServiceErrorToMessage(result.error))
                    setCreatingService(false)
                }
            } finally {
                setCreatingService(false)
            }
        } else {
            setError("debes completar todos los campos")
            setCreatingService(false)
        }
    }

    const isFormValid = () => {
        return (
            image.trim() !== "" &&
            title.trim().length >= 3 &&
            description.trim().length >= 5 &&
            price !== null &&
            price > 0 &&
            duration != null &&
            duration > 0 &&
            selectedEmployees.length > 0 &&
            days.length > 0 &&
            hourStart !== null &&
            hourEnd !== null &&
            hourStart < hourEnd //no se si esto esta bien.
        );
    };

    useEffect(() => {
        console.log("mostra?: " + isFormValid())
        setPreviewVisiblity(isFormValid())
        if (isFormValid()) {
            if (hourEnd != null && hourStart != null) {
                const previewServiceInput: Service = {
                    id: "preview",
                    name: title,
                    description,
                    price: price ?? 0,
                    duration_min: duration ?? 0,
                    img: image,
                    employees: [],
                    days,
                    hourStart: hourStart,
                    hourEnd: hourEnd
                };
                setPreviewService(previewServiceInput)
            }
        }
    }, [title, description, price, duration, image, selectedEmployees, days, hourStart, hourEnd])

    useEffect(() => {
        getUserInfo()
        //fetchUpcomingAdminAppointments()
    }, [])

    const getHourString = (date: Date) => {
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${hours}:${minutes}`;
    };

    return {
        previewService,
        image, setImage,
        title, setTitle,
        description, setDescription,
        price, setPrice,
        duration, setDuration,
        selectedEmployees, setSelectedEmployees,
        days, setDays,
        hourStart, setHourStart,
        hourEnd, setHourEnd,
        employees,
        previewVisibility, setPreviewVisiblity,
        isAdmin,
        loading,
        creatingService,
        success,
        error,
        addService,
        getHourString
    }
}