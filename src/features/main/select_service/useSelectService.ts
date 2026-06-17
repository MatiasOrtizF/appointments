import { useEffect, useState } from "react"
import { Service } from "../../../domain/models/service/Service"
import { serviceRepository } from "../../../data/repository/ServiceRepository"
import { mapDatabaseErrorToMessage } from "../../../errors/databaseErrorMessages"
import { chatBotRepository } from "../../../data/repository/ChatBotRepository"
import { Sender } from "../../../shared/types/sender"

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  type Message = {
    id: string;
    sender: "user" | "bot";
    text: string;
  };

  const MOCK_MESSAGES: Message[] = [
    {
      id: "1",
      sender: "user",
      text: "¿Cuál es el horario de atención?",
    },
    {
      id: "2",
      sender: "bot",
      text: "Atendemos de lunes a viernes de 9:00 a 20:00.",
    },
    {
      id: "3",
      sender: "user",
      text: "¿Cómo puedo cancelar un turno?",
    },
    {
      id: "4",
      sender: "bot",
      text: "Podés cancelarlo desde la sección Mis Turnos hasta 24 horas antes.",
    },
    {
      id: "5",
      sender: "user",
      text: "¿Aceptan tarjeta?",
    },
    {
      id: "6",
      sender: "bot",
      text: "Sí, aceptamos efectivo, débito y crédito.",
    },
  ];

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchServices();

    setRefreshing(false);
  };


  const fetchServices = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await serviceRepository.getServices()

      if (result.ok) {
        setServices(result.data)
      } else {
        setError(mapDatabaseErrorToMessage(result.error))
      }

    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    addMessage("user", message)
    try {
      const result = await chatBotRepository.getChatBot(message)
      if (result.ok) {
        addMessage("bot", result.data)
      } else {
        console.log("error 2 ", result.error)
      }
    } finally {

    }
  }

  const addMessage = (sender: Sender, messageSender: string) => {
      if (!message.trim()) return;

        const newMessage = {
          id: Date.now().toString()+Math.random(),
          sender: sender,
          text: messageSender,
        };

        setMessages(prev => [...prev, newMessage]);

        setMessage("");
  }

  useEffect(() => {
    fetchServices()
  }, [])

  return {
    services,
    message, setMessage,
    messages,
    loading,
    error,
    refreshing,
    onRefresh,
    sendMessage
  }
}