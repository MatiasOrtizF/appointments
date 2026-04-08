import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { lightColors, darkColors } from '../../theme/colors'
import { Service } from '../../domain/models/Service'
import { useTheme } from '../../data/provider/ThemeProvider'

type Props = {
  service: Service
  onBook: (serviceName: string) => void
}

export const ServiceCard: React.FC<Props> = ({
  service,
  onBook,
}) => {
  const { name, price, description, duration_min, img } = service

  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <View style={[styles.card, { backgroundColor: colors.bgCard }]}>
      <Image source={{ uri: img }} style={styles.image} />

      {/* Nombre + Precio */}
      <View style={styles.rowBetween}>
        <Text style={[styles.name, { color: colors.textPrimary }]}>{name}</Text>
        <Text style={[styles.price, { color: colors.textPrimary, backgroundColor: colors.bgSecondary }]}>{"$" + price}</Text>
      </View>

      {/* Descripción */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>{description}</Text>

      {/* Duración + Botón */}
      <View style={styles.rowBetween}>
        <View style={[{backgroundColor: colors.bgSecondary }, styles.duration]}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={[styles.durationText, { color: colors.textSecondary }]}>{duration_min + " min"}</Text>
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => onBook(service.name)}>
          <Text style={styles.buttonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
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
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },

  description: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 14,
  },

  duration: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 50,
  },

  durationText: {
    marginLeft: 3,
    fontSize: 13,
    fontWeight: '600',
  },

  button: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 50,
  },

  buttonText: {
    fontWeight: '600',
  },
})