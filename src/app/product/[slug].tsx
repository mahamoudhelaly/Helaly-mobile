import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getProductBySlug } from "@/services/api";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";
import { useCart } from "@/context/CartContext";

interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  images: string[];
}

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { addItem } = useCart();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductBySlug(slug);
      setProduct(data.product);
    } catch (err: any) {
      setError(err.message || "حصل خطأ في تحميل المنتج");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <BrandHeader />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.screen}>
        <BrandHeader />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || "المنتج غير موجود"}</Text>
          <Pressable style={styles.retryButton} onPress={loadProduct}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const isOutOfStock = product.stock === 0;

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.images[0] ?? null,
        stock: product.stock,
      },
      quantity
    );
    Alert.alert("تمت الإضافة", `تمت إضافة ${quantity} × ${product.name} للسلة`, [
      { text: "متابعة التسوق", style: "cancel" },
      { text: "اذهب للسلة", onPress: () => router.push("/cart") },
    ]);
  }

  return (
    <View style={styles.screen}>
      <BrandHeader title={product.name} />

      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* معرض الصور */}
        <FlatList
          data={product.images.length > 0 ? product.images : [null]}
          keyExtractor={(_, index) => String(index)}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) =>
            item ? (
              <Image
                source={{ uri: item }}
                style={[styles.image, { width }]}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[styles.image, styles.imagePlaceholder, { width }]}
              />
            )
          }
        />

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.price}>{product.price} ج.م</Text>

          {isOutOfStock && (
            <Text style={styles.outOfStockBanner}>
              غير متوفر حالياً في المخزون
            </Text>
          )}

          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}

          {!isOutOfStock && (
            <View style={styles.quantitySection}>
              <Text style={styles.quantityLabel}>الكمية</Text>
              <View style={styles.quantityControl}>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </Pressable>
                <Text style={styles.quantityValue}>{quantity}</Text>
                <Pressable
                  style={styles.quantityButton}
                  onPress={() => setQuantity((q) => Math.max(q - 1, 1))}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* زر الشراء ثابت أسفل الشاشة */}
      <View style={styles.stickyFooter}>
        <Pressable
          style={({ pressed }) => [
            styles.addToCartButton,
            pressed && styles.addToCartButtonPressed,
            isOutOfStock && styles.addToCartButtonDisabled,
          ]}
          disabled={isOutOfStock}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>
            {isOutOfStock ? "غير متوفر" : "إضافة للسلة"}
          </Text>
        </Pressable>
      </View>
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
  image: {
    height: 320,
    backgroundColor: colors.surface,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 21,
    fontWeight: "800",
    textAlign: "right",
    color: colors.textPrimary,
  },
  price: {
    fontSize: 19,
    fontWeight: "800",
    color: colors.success,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  outOfStockBanner: {
    fontSize: 13,
    color: colors.danger,
    backgroundColor: "#3A1A1A",
    padding: spacing.sm,
    borderRadius: radius.sm,
    textAlign: "center",
    marginTop: spacing.md,
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: spacing.md,
  },
  quantitySection: {
    marginTop: spacing.lg,
    alignItems: "flex-end",
  },
  quantityLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.md,
  },
  quantityButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.accent,
  },
  quantityValue: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    minWidth: 30,
    textAlign: "center",
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
  },
  addToCartButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  addToCartButtonPressed: {
    opacity: 0.85,
  },
  addToCartButtonDisabled: {
    backgroundColor: colors.surfaceBorder,
  },
  addToCartText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
