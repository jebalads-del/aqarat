import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useFavorites } from "@/context/FavoritesContext";
import { useColors } from "@/hooks/useColors";
import type { Property } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
  onPress: () => void;
}

export function PropertyCard({ property, onPress }: PropertyCardProps) {
  const colors = useColors();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(property.id);

  const handleFav = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleFavorite(property.id);
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.imageArea, { backgroundColor: property.color }]}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{property.type}</Text>
        </View>
        <TouchableOpacity style={styles.favBtn} onPress={handleFav}>
          <Feather name={fav ? "heart" : "heart"} size={20} color={fav ? "#e74c3c" : "#fff"} />
        </TouchableOpacity>
        <Feather name="home" size={48} color="rgba(255,255,255,0.3)" style={styles.homeIcon} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={1}>
          {property.title}
        </Text>
        <View style={styles.locationRow}>
          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
          <Text style={[styles.location, { color: colors.mutedForeground }]} numberOfLines={1}>
            {" "}{property.location}
          </Text>
        </View>
        <View style={styles.details}>
          {property.bedrooms > 0 && (
            <View style={styles.detailItem}>
              <Feather name="moon" size={12} color={colors.mutedForeground} />
              <Text style={[styles.detailText, { color: colors.mutedForeground }]}> {property.bedrooms}</Text>
            </View>
          )}
          {property.bathrooms > 0 && (
            <View style={styles.detailItem}>
              <Feather name="droplet" size={12} color={colors.mutedForeground} />
              <Text style={[styles.detailText, { color: colors.mutedForeground }]}> {property.bathrooms}</Text>
            </View>
          )}
          <View style={styles.detailItem}>
            <Feather name="maximize" size={12} color={colors.mutedForeground} />
            <Text style={[styles.detailText, { color: colors.mutedForeground }]}> {property.area} م²</Text>
          </View>
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>{property.price}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageArea: {
    height: 160,
    justifyContent: "center",
    alignItems: "center",
  },
  homeIcon: {
    position: "absolute",
  },
  typeBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  typeText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 12,
    width: 36,
    height: 36,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    padding: 14,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  details: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  price: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginTop: 4,
  },
});
