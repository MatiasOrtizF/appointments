import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ChangePasswordScreen from '../features/setting/changePassword/ChangePasswordScreen'
import { SettingsScreen } from '../features/setting/SettingScreen'
import { SettingsStackParamList } from './types'

const Stack = createNativeStackNavigator<SettingsStackParamList>()

export default function SettingNavigation() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="SettingsHome" component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: "Actualizar contraseña" }} />
        </Stack.Navigator>
    )
}