import { supabase } from "../../config/Supabase";
import { DatabaseError, handleDatabaseError } from "../../errors/databaseError";
import { Result } from "../../shared/types/result";

export class ChatBotRepository {
    async getChatBot(message: string): Promise<Result<string, DatabaseError>> {
        try {
            const { data, error } = await supabase.functions.invoke(
                "chatbot",
                {
                    body: {
                        message: message
                    }
                }
            );

            if(error) {
                return handleDatabaseError(error);
            }

            console.log("el error es: ", error)
            console.log("la respuesta es: ", data)

            return {
                ok: true,
                data: data.answer
            };
        } catch (error) {
            return handleDatabaseError(error);
        }
    }
}

export const chatBotRepository = new ChatBotRepository();