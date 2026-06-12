import { useEffect, useState } from "react";
import { Day, Service } from "../../../../../domain/models/service/Service";
import { employeeRepository } from "../../../../../data/repository/EmployeeRepository";
import { EditServiceInput } from "../../../../../domain/models/service/EditServiceInput";
import { editServiceUsecase } from "../../../../../domain/usecase/service/editserviceUsecase";
import { mapDatabaseErrorToMessage } from "../../../../../errors/databaseErrorMessages";

export const useEditService = () => {
    const [previewService, setPreviewService] = useState<Service>()
    const [serviceId, setServiceId] = useState<Service["id"]>("")
    const [image, setImage] = useState<Service["img"]>("")
    const [newImage, setNewImage] = useState<string>("")
    const [title, setTitle] = useState<Service["name"]>("")
    const [initialTitle, setInitialTitle] = useState<Service["name"]>("")
    const [description, setDescription] = useState<Service["description"]>("")
    const [initialDescription, setInitialDescription] = useState<Service["description"]>("")
    const [price, setPrice] = useState<Service["price"] | null>(null)
    const [initialPrice, setInitialPrice] = useState<Service["price"] | null>(null)
    const [duration, setDuration] = useState<Service["duration_min"] | null>(null)
    const [initialDuration, setInitialDuration] = useState<Service["duration_min"] | null>(null)
    const [selectedEmployees, setSelectedEmployees] = useState<number[]>([])
    const [initialSelectedEmployees, setInitialSelectedEmployees] = useState<number[]>([])
    const [days, setDays] = useState<Service["days"]>([])
    const [initialDays, setInitialDays] = useState<Service["days"]>([])
    const [hourStart, setHourStart] = useState<Service["hourStart"] | null>(null)
    const [initialHourStart, setInitialHourStart] = useState<Service["hourStart"] | null>(null)
    const [hourEnd, setHourEnd] = useState<Service["hourEnd"] | null>(null)
    const [initialHourEnd, setInitialHourEnd] = useState<Service["hourEnd"] | null>(null)

    const [employees, setEmployees] = useState<Service["employees"]>([])
    const [previewVisibility, setPreviewVisiblity] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editingService, setEditingService] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        console.log("se llama a empleados")
        try {
            const result = await employeeRepository.getEmployees()

            if (result.ok) {
                console.log("empleados: ", result.data)
                setEmployees(result.data)
            } else {
                setError(mapDatabaseErrorToMessage(result.error))
            }

        } finally {
            setLoading(false)
        }
    }

    const editService = async () => {
        setEditingService(true)
        setError(null)

        if (isChanged()) {
            if (hourEnd != null && hourStart != null && isFormValid()) {
                const serviceInput: EditServiceInput = {
                    id: serviceId,
                    name: title,
                    description,
                    price: price ?? 0,
                    duration: duration ?? 0,
                    employees: selectedEmployees,
                    days: days,
                    hourStart: hourStart,
                    hourEnd: hourEnd,
                    newImage: newImage,
                    oldImageUrl: image,
                    imageChanged: newImage.trim().length > 0
                };
                try {
                    const result = await editServiceUsecase(serviceInput)

                    if (result.ok) {
                        setSuccess(true)
                    } else {
                        setError(mapDatabaseErrorToMessage(result.error))
                        setEditingService(false)
                    }
                } finally {
                    setEditingService(false)
                }
            } else {
                setError("debes completar todos los campos")
                setEditingService(false)
            }
        } else {
            setError("Debes realizar almenos un cambio")
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

    const isChanged = () => {
        return (
            newImage.trim().length > 0 ||
            title != initialTitle ||
            description != initialDescription ||
            price != initialPrice ||
            duration != initialDuration ||
            hourStart != initialHourStart ||
            hourEnd != initialHourEnd ||
            selectedEmployees != initialSelectedEmployees ||
            days.length !== initialDays.length ||
            !days.every(day => initialDays.includes(day))
        )
    }

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
                    img: newImage ? newImage : image,
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
    }, [])

    const toggleSelectedDay = (day: Day) => {
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
        newImage, setNewImage,
        title, setTitle,
        setInitialTitle,
        description, setDescription,
        setInitialDescription,
        price, setPrice,
        setInitialPrice,
        duration, setDuration,
        setInitialDuration,
        selectedEmployees, setSelectedEmployees,
        setInitialSelectedEmployees,
        days, setDays,
        setInitialDays,
        hourStart, setHourStart,
        setInitialHourStart,
        hourEnd, setHourEnd,
        setInitialHourEnd,
        employees, setEmployees,
        previewVisibility, setPreviewVisiblity,
        isAdmin,
        loading,
        editingService,
        success,
        error, setError,
        editService,
        toggleSelectedDay,
        toggleSelectedEmployee
    }
}