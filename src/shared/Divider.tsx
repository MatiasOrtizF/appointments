import { View } from "react-native";
import { useTheme } from "../data/provider/ThemeProvider";
import { darkColors, lightColors } from "../theme/colors";

export default function Divider() {

    const { isDarkMode } = useTheme();
    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <View style={{ height: 1, backgroundColor: colors.divider }} />
    );
}