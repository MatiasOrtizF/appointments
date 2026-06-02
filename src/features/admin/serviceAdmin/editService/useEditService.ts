import { useEffect, useState } from "react";
import { getUserInfoUsecase } from "../../../../domain/usecase/admin/getUserInfoUsecase";
import { mapUserErrorToMessage } from "../../../../errors/userError";
import { Day, Service } from "../../../../domain/models/Service";
import { mapServiceErrorToMessage } from "../../../../errors/serviceErrors";
import { mapEmployeeErrorToMessage } from "../../../../errors/employeeError";
import { editServiceUsecase } from "../../../../domain/usecase/admin/editServiceUsecase";
import { EditServiceRequest } from "../../../../domain/models/EditServiceRequest";
import { getEmployeesUsecase } from "../../../../domain/usecase/admin/employee/getEmployeesUsecase";
import { employeeRepository } from "../../../../data/repository/EmployeeRepository";
import { serviceRepository } from "../../../../data/repository/ServiceRepository";

export const useEditService = () => {
    const [previewService, setPreviewService] = useState<Service>()
    const [serviceId, setServiceId] = useState<Service["id"]>("")
    const [image, setImage] = useState<Service["img"]>("")
    const [title, setTitle] = useState<Service["name"]>("")
    const [description, setDescription] = useState<Service["description"]>("")
    const [price, setPrice] = useState<Service["price"] | null>(null)
    const [duration, setDuration] = useState<Service["duration_min"] | null>(null)
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
    const [days, setDays] = useState<Service["days"]>([])
    const [hourStart, setHourStart] = useState<string | null>(null)
    const [hourEnd, setHourEnd] = useState<string | null>(null)

    const [employees, setEmployees] = useState<Service["employees"]>([])
    const [previewVisibility, setPreviewVisiblity] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editingService, setEditingService] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        try {
            const result = await employeeRepository.getEmployees()

            if (result.ok) {
                console.log(result.data)
                setEmployees(result.data)
            } else {
                setError(mapEmployeeErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const editService = async () => {
        console.log("se pulso")
        setEditingService(true)
        setError(null)

        if (hourEnd != null && hourStart != null && isFormValid()) {
            const serviceInput: EditServiceRequest = {
                id: serviceId,
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
            try {
                const result = await serviceRepository.editServices(serviceInput)

                if (result.ok) {
                    setSuccess(true)
                } else {
                    setError(mapServiceErrorToMessage(result.error))
                    setEditingService(false)
                }
            } finally {
                setEditingService(false)
            }
        } else {
            setError("debes completar todos los campos")
            setEditingService(false)
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
        fetchEmployees()
        //fetchUpcomingAdminAppointments()
    }, [])

     const toggleSelectedDay  = (day: Day) => {
        setDays(prevList =>
            prevList.includes(day)
                ? prevList.filter(item => item !== day) // lo saco
                : [...prevList, day] // lo agrego
        )
    }

        const toggleSelectedEmployee = (employeeId: number) => {
        setSelectedEmployees(prevList =>
            prevList.includes(employeeId)
                ? prevList.filter(item => item !== employeeId) // lo saco
                : [...prevList, employeeId] // lo agrego
        )
    }

    return {
        previewService,
        setServiceId,
        image, setImage,
        title, setTitle,
        description, setDescription,
        price, setPrice,
        duration, setDuration,
        selectedEmployees, setSelectedEmployees,
        days, setDays,
        hourStart, setHourStart,
        hourEnd, setHourEnd,
        employees, setEmployees,
        previewVisibility, setPreviewVisiblity,
        isAdmin,
        loading,
        editingService,
        success,
        error,
        editService,
        toggleSelectedDay,
        toggleSelectedEmployee
    }
}