import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import { ServiceCard } from './ServiceCard';
import { colors } from '../../theme/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const services = [
  {
    id: 1,
    image: "https://barberiahudson.com/wp-content/uploads/2023/04/LIMPIEZA-FACIAL-PREMIUM-2-2000x2000.jpg",
    name: "limpieza facial",
    price: 7000,
    description: "The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested.",
    duration: 60,
  },
  {
    id: 2,
    image: "https://i.pinimg.com/736x/05/73/0a/05730a7765c48afffe19ab0f2b990dbd.jpg",
    name: "manicura",
    price: 4500,
    description: "This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
    duration: 45,
  },
    {
    id: 3,
    image: "https://media.gettyimages.com/id/1422731968/es/foto/joven-barbero-haciendo-corte-de-pelo-a-un-hombre-barbudo-usando-peine.jpg?s=612x612&w=gi&k=20&c=INTGXIj8Bl9QkBGXTs-HRbsqrG5W1mSw2LwcU1YeUD8=",
    name: "corte de pelo",
    price: 5500,
    description: "orem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. ",
    duration: 30,
  },
    {
    id: 4,
    image: "https://img.freepik.com/fotos-premium/cabello-color-hombre-barbudo-proceso-coloracion-cabello-hombre-peluqueria_265223-10911.jpg",
    name: "manicura",
    price: 9000,
    description: "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.",
    duration: 60,
  },
];

export const HomeScreen=() => {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{padding: 24}} 
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never" // Android
        bounces={false}        // iOS
        >
            <Text style={styles.title}>Book your next</Text>
            <Text style={styles.subTitle}>appointment</Text>

            {services.map(service => (
                <ServiceCard
                    key={service.id}
                    image={service.image}
                    name={service.name}
                    price={service.price}
                    description={service.description}
                    duration={service.duration}
                    onBook={() => console.log("Book:", service.name)}
                />
            ))}
        </ScrollView>
      </SafeAreaView>
    )
}

const styles = StyleSheet.create({
   title: {
          fontSize: 33,
          fontWeight: "700",
      },
      subTitle: {
          color: colors.textSecondary,
          fontSize: 29,
          fontWeight: "700",
          marginBottom: 24,
      },
})