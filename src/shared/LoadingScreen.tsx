import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../theme/colors";

export default function LoadingScreen() {
      const { isDarkMode } = useTheme();
        const colors = isDarkMode ? darkColors : lightColors
      
          
      return (
          <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.secondary} />
          </View>
        );
}