import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
    label: string;
    value: string | null;
    onPress: () => void;
    colors: any;
};

export default function TimeSelector({
    label,
    value,
    onPress,
    colors,
}: Props) {

    const styles = createStyles(colors);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>
                {label}
            </Text>

            <Pressable onPress={onPress}>
                <View style={styles.timeButton}>
                    <Text style={styles.timeText}>
                        {value ?? "--:--"}
                    </Text>

                    <Ionicons
                        name="time"
                        size={15}
                        color={colors.textSecondary}
                    />
                </View>
            </Pressable>
        </View>
    );
}

const createStyles = (colors: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },

        label: {
            fontWeight: "700",
            color: colors.textSecondary,
            textTransform: "uppercase",
            marginBottom: 10,
        },

        timeButton: {
            flexDirection: "row",
            backgroundColor: colors.background,
            borderRadius: 50,
            height: 50,
            paddingHorizontal: 20,
            gap: 17,
            justifyContent: "center",
            alignItems: "center",
        },

        timeText: {
            fontWeight: "500",
        },
    });