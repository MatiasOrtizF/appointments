import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    View,
    Text,
    FlatList,
    StyleSheet,
    Dimensions,
    Pressable,
    ListRenderItem,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from "react-native";

type TimePickerModalProps = {
    selectedHourDefault: string,
    selectedMinuteDefault: string,
    visible: boolean;
    onClose: () => void;
    onConfirm: (time: string) => void;
};

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const hours = Array.from({ length: 24 }, (_, i) =>
    i.toString().padStart(2, "0")
);

const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
);

export default function TimePickerModal({ selectedHourDefault, selectedMinuteDefault, visible, onClose, onConfirm }: TimePickerModalProps) {
    const [selectedHour, setSelectedHour] = useState<string>(selectedHourDefault);
    const [selectedMinute, setSelectedMinute] = useState<string>(selectedMinuteDefault);

    const hourRef = useRef<FlatList>(null);
    const minuteRef = useRef<FlatList>(null);

    useEffect(() => {
        if (visible) {
            const hourIndex = hours.indexOf(selectedHourDefault ?? "00");
            const minuteIndex = minutes.indexOf(selectedMinuteDefault ?? "00");

            if (hourIndex >= 0) {
                hourRef.current?.scrollToIndex({
                    index: hourIndex,
                    animated: false,
                });
                setSelectedHour(hours[hourIndex]);
            }

            if (minuteIndex >= 0) {
                minuteRef.current?.scrollToIndex({
                    index: minuteIndex,
                    animated: false,
                });
                setSelectedMinute(minutes[minuteIndex]);
            }
        }
    }, [visible]);


    const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>,
        type: "hour" | "minute") => {
        const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);

        if (type === "hour") {
            setSelectedHour(hours[index]);
        } else {
            setSelectedMinute(minutes[index]);
        }
    };

    const renderItem = (selectedValue: string): ListRenderItem<string> =>
        ({ item }) => {
            const isSelected = item === selectedValue;

            return (
                <View style={styles.item}>
                    <Text style={[styles.text, isSelected && styles.selectedText]}>
                        {item}
                    </Text>
                </View>
            );
        };

    const commonProps = {
        showsVerticalScrollIndicator: false,
        snapToInterval: ITEM_HEIGHT,
        decelerationRate: "fast" as const,
        getItemLayout: (_: any, index: number) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
        }),
        contentContainerStyle: {
            paddingVertical: ITEM_HEIGHT, // 🔥 esto centra el item del medio
        },
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* PICKERS */}
                    <View style={styles.pickersContainer}>
                        {/* HOURS */}
                        <FlatList
                            ref={hourRef}
                            data={hours}
                            keyExtractor={(item) => item}
                            {...commonProps}
                            onMomentumScrollEnd={(e) => handleScrollEnd(e, "hour")}
                            renderItem={renderItem(selectedHour)}
                        />

                        <View style={{ justifyContent: "center"}}>
                            <Text style={styles.selectedText}>:</Text>
                        </View>

                        {/* MINUTES */}
                        <FlatList
                            ref={minuteRef}
                            data={minutes}
                            keyExtractor={(item) => item}
                            {...commonProps}
                            onMomentumScrollEnd={(e) => handleScrollEnd(e, "minute")}
                            renderItem={renderItem(selectedMinute)}
                        />
                    </View>

                    {/* BOTONES */}
                    <View style={styles.actions}>
                        <Pressable onPress={onClose}>
                            <Text style={styles.cancel}>Cancelar</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => onConfirm(`${selectedHour}:${selectedMinute}`)}
                        >
                            <Text style={styles.confirm}>Confirmar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    container: {
        backgroundColor: "#1e1e1e",
        marginHorizontal: 20,
        borderRadius: 16,
        paddingVertical: 20,
    },
    pickersContainer: {
        flexDirection: "row",
        height: PICKER_HEIGHT,
    },
    item: {
        height: ITEM_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 20,
        color: "#888",
    },
    selectedText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    centerLine: {
        position: "absolute",
        top: "50%",
        left: 20,
        right: 20,
        height: 2,
        backgroundColor: "#fff",
        marginTop: -1,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingHorizontal: 40,
    },
    cancel: {
        color: "#aaa",
    },
    confirm: {
        color: "#4CAF50",
        fontWeight: "bold",
    },
});