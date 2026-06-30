import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";

export default function FavoritesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { favorites } = useFavorites();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const favProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>المفضلة</Text>
        <Text style={[styles.headerSub, { color: colors.mutedForeground }]}>
          {favProperties.length > 0 ? `${favProperties.length} عقارات محفوظة` : "لا توجد عقارات محفوظة"}
        </Text>
      </View>
      <FlatList
        data={favProperties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push(`/property/${item.id}` as any)}
          />
        )}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: Platform.OS === "web" ? 100 : insets.bottom + 100 },
        ]}
        scrollEnabled={!!favProperties.length}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="heart" size={56} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>لا توجد مفضلة</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              اضغط على أيقونة القلب لحفظ العقارات
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "right",
  },
  headerSub: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "right",
  },
  list: { padding: 16 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
