import { View, Text, StyleSheet, FlatList, Image, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";
import { useCart } from "@/context/CartContext";

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <View style={styles.screen}>
        <BrandHeader title="السلة" hideCart />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyText}>سلتك فاضية حالياً</Text>
          <Pressable
            style={styles.shopButton}
            onPress={() => router.push("/categories")}
          >
            <Text style={styles.shopButtonText}>تصفح المنتجات</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <BrandHeader title="السلة" hideCart />

      <FlatList
        data={items}
        keyExtractor={(item) => String(item.productId)}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.cartRow}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
            ) : (
              <View style={[styles.itemImage, styles.itemImagePlaceholder]} />
            )}

            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.itemPrice}>{item.price} ج.م</Text>

              <View style={styles.quantityRow}>
                <View style={styles.quantityControl}>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                  <Text style={styles.quantityValue}>{item.quantity}</Text>
                  <Pressable
                    style={styles.quantityButton}
                    onPress={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>
                </View>

                <Pressable onPress={() => removeItem(item.productId)}>
                  <Text style={styles.removeText}>حذف</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      {/* ملخص السعر وزر الانتقال للدفع */}
      <View style={styles.summaryFooter}>
        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>{totalPrice.toFixed(2)} ج.م</Text>
          <Text style={styles.totalLabel}>الإجمالي</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.checkoutButton,
            pressed && styles.checkoutButtonPressed,
          ]}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutButtonText}>إتمام الطلب</Text>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  shopButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 140,
  },
  cartRow: {
    flexDirection: "row-reverse",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceBorder,
  },
  itemImagePlaceholder: {},
  itemInfo: {
    flex: 1,
    marginRight: spacing.sm,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.success,
    textAlign: "right",
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.sm,
  },
  quantityButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  quantityButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.accent,
  },
  quantityValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
    minWidth: 22,
    textAlign: "center",
  },
  removeText: {
    fontSize: 12,
    color: colors.danger,
    fontWeight: "600",
  },
  summaryFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    padding: spacing.md,
  },
  totalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  checkoutButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  checkoutButtonPressed: {
    opacity: 0.85,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
