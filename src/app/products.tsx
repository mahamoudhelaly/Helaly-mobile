import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getProducts } from "@/services/api";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  stock: number;
  imageUrl: string | null;
}

export default function ProductsScreen() {
  const router = useRouter();
  const { categoryId, categoryName } = useLocalSearchParams<{
    categoryId: string;
    categoryName: string;
  }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [categoryId]);

  async function loadProducts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(Number(categoryId));
      setProducts(data.products);
    } catch (err: any) {
      setError(err.message || "حصل خطأ في تحميل المنتجات");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <BrandHeader title={categoryName || "المنتجات"} />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadProducts}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>لا توجد منتجات في هذه الفئة حالياً</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() =>
                router.push({
                  pathname: "/product/[slug]",
                  params: { slug: item.slug },
                })
              }
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]} />
              )}
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardPrice}>{item.price} ج.م</Text>
              {item.stock === 0 && (
                <Text style={styles.outOfStock}>غير متوفر حالياً</Text>
              )}
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
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
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
  cardPressed: {
    opacity: 0.8,
  },
  cardImage: {
    width: "100%",
    height: 130,
    backgroundColor: colors.surfaceBorder,
  },
  cardImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
    marginHorizontal: spacing.sm,
    textAlign: "right",
    color: colors.success,
  },
  outOfStock: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
    marginHorizontal: spacing.sm,
    textAlign: "right",
  },
});
