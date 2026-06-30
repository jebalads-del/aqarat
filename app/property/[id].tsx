import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { properties } from "@/data/properties";
import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";

export default function PropertyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const property = properties.find((p) => p.id === id);
  if (!property) return null;

  const fav = isFavorite(property.id);
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const botPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavorite(property.id);
  };

  const handleContact = () => {
    Alert.alert("تواصل مع المالك", "سيتم تحويلك للتواصل مع المالك", [
      { text: "إلغاء", style: "cancel" },
      { text: "اتصال", onPress: () => {} },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.imageArea, { backgroundColor: property.color, paddingTop: topPad }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-right" size={22} color="#fff" />
        </TouchableOpacity>
        <Feather name="home" size={80} color="rgba(255,255,255,0.25)" />
        <TouchableOpacity style={styles.favBtn} onPress={handleFav}>
          <Feather name="heart" size={22} color={fav ? "#e74c3c" : "#fff"} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: botPad + 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.typeBadge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.typeText, { color: colors.primary }]}>{property.type}</Text>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>{property.title}</Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={14} color={colors.mutedForeground} />
          <Text style={[styles.location, { color: colors.mutedForeground }]}> {property.location}</Text>
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>{property.price}</Text>

        <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {property.bedrooms > 0 && (
            <View style={styles.stat}>
              <Feather name="moon" size={20} color={colors.primary} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{property.bedrooms}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>غرف</Text>
            </View>
          )}
          {property.bathrooms > 0 && (
            <View style={styles.stat}>
              <Feather name="droplet" size={20} color={colors.primary} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{property.bathrooms}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>حمامات</Text>
            </View>
          )}
          <View style={styles.stat}>
            <Feather name="maximize" size={20} color={colors.primary} />
            <Text style={[styles.statVal, { color: colors.foreground }]}>{property.area}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>م²</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>الوصف</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]}>{property.description}</Text>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: botPad + 12 }]}>
        <TouchableOpacity
          style={[styles.contactBtn, { backgroundColor: colors.primary }]}
          onPress={handleContact}
          activeOpacity={0.85}
        >
          <Feather name="phone" size={18} color="#fff" />
          <Text style={styles.contactText}>تواصل مع المالك</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageArea: {
    height: 260,
    justifyContent: "center",
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    top: 12,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  favBtn: {
    position: "absolute",
    top: 12,
    left: 16,
    width: 40,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  content: { padding: 20, gap: 12 },
  typeBadge: {
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  typeText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "right" },
  locationRow: { flexDirection: "row-reverse", alignItems: "center" },
  location: { fontSize: 14, fontFamily: "Inter_400Regular" },
  price: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "right" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
  stat: { alignItems: "center", gap: 4 },
  statVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 12, fontFamily: "Inter_400Regular" },
  sectionTitle: { fontSize: 18, fontFamily: "Inter_600SemiBold", textAlign: "right", marginTop: 8 },
  description: { fontSize: 15, fontFamily: "Inter_400Regular", textAlign: "right", lineHeight: 24 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    padding: 16,
  },
  contactBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  contactText: { color: "#fff", fontSize: 16, fontFamily: "Inter_600SemiBold" },
});
