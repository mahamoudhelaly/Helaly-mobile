import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getWishlist, removeFromWishlist } from "@/services/api";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";

interface WishlistItem {
  wishlistId: number;
  productId: number;
  name: string;
  slug: string;
  price: string;
  imageUrl: string | null;
}

export default function WishlistScreen() {
  const router = useRouter();

  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWishlist();
  }, []);

  async function loadWishlist() {
    setLoading(true);
    setError(null);
    try {
      const data = await getWishlist();
      setItems(data.wishlist);
    } catch (err: any) {
      setError(err.message || "حصل خطأ في تحميل المفضلة");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(productId: number) {
    try {
      await removeFromWishlist(productId);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
    } catch (err: any) {
      // فشل الحذف نادر الحدوث هنا، نتجاهله بصمت ونترك العنصر كما هو
    }
  }

  return (
    <View style={styles.screen}>
      <BrandHeader title="المفضلة" />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadWishlist}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyText}>لا توجد منتجات في المفضلة</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.wishlistId)}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/product/[slug]",
                  params: { slug: item.slug },
                })
              }
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]} />
              )}

              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemove(item.productId)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </Pressable>

              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardPrice}>{item.price} ج.م</Text>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContainer: {
    padding: spacing.sm,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: "hidden",
    paddingBottom: spacing.sm,
  },
  cardImage: {
    width: "100%",
    height: 120,
    backgroundColor: colors.surfaceBorder,
  },
  cardImagePlaceholder: {},
  removeButton: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(11, 14, 20, 0.75)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: spacing.sm,
    marginHorizontal: spacing.sm,
    textAlign: "right",
    color: colors.textPrimary,
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
    marginHorizontal: spacing.sm,
    textAlign: "right",
    color: colors.success,
  },
});
