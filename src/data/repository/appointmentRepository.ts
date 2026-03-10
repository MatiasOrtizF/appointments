import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { Appointment } from '../../domain/models/Appointment'
import { AppointmentResponse, toDomain } from '../remote/response/AppointmentResponse';
import { db } from '../../config/Firebase';

export const getUserAppointments = async (
  uid: string
): Promise<Appointment[]> => {

  try {

    const q = query(
      collection(db, "appointment"),
      where("uid", "==", uid),
      limit(10)
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data() as AppointmentResponse
      return toDomain(doc.id, data)
    })

  } catch (error) {
    console.log("Error getting user appointments", error);
    return [];
  }
};