import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '../../theme/colors'
import { Service } from '../../domain/models/Service'

type Props = {
  service: Service
  onBook: (serviceName: string) => void
}

export const ServiceCard: React.FC<Props> = ({
  service,
  onBook,
}) => {
  const { name, price, description, duration_min, img } = service

  return (
    <View style={styles.card}>
      <Image source={{ uri: img }} style={styles.image} />

      {/* Nombre + Precio */}
      <View style={styles.rowBetween}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.price}>{"$" + price}</Text>
      </View>

      {/* Descripción */}
      <Text style={styles.description}>{description}</Text>

      {/* Duración + Botón */}
      <View style={styles.rowBetween}>
        <View style={styles.duration}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.durationText}>{duration_min + " min"}</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => onBook(service.name)}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,

    // Android
    elevation: 4,

    // iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: '100%',
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 19,
    fontWeight: '700',
    flex: 1,
    textTransform: "capitalize"
  },

  price: {
    fontWeight: '700',
    color: colors.textPrimary,
    backgroundColor: '#e4e4e4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },

  description: {
    marginTop: 5,
    marginBottom: 10,
    color: '#666',
    fontSize: 14,
  },

  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e4e4e4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },

  durationText: {
    marginLeft: 3,
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },

  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
  },

  buttonText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
})