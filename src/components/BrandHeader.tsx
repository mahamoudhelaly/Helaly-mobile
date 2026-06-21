import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/theme";
import { useCart } from "@/context/CartContext";

interface BrandHeaderProps {
  /** عنوان الصفحة الحالية، يظهر بجانب الشعار */
  title?: string;
  /** إخفاء أيقونة السلة (تُستخدم في صفحة السلة نفسها مثلاً) */
  hideCart?: boolean;
  /** إخفاء أيقونة الحساب (تُستخدم في صفحة الحساب نفسها مثلاً) */
  hideProfile?: boolean;
}

/**
 * هيدر مصغّر يظهر اسم HellyBuy في زاوية بشكل احترافي وثابت
 * مع زر السلة (وعداد العناصر) وزر الوصول للملف الشخصي
 * يُستخدم داخل كل صفحة بعد صفحة تسجيل الدخول
 */
export function BrandHeader({ title, hideCart, hideProfile }: BrandHeaderProps) {
  const router = useRouter();
  const { totalItems } = useCart();

  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <Text style={styles.brandMark}>H</Text>
        <Text style={styles.brandName}>ellyBuy</Text>
      </View>

      <View style={styles.rightSection}>
        {title && <Text style={styles.pageTitle}>{title}</Text>}

        {!hideProfile && (
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.icon}>👤</Text>
          </Pressable>
        )}

        {!hideCart && (
          <Pressable
            style={styles.iconButton}
            onPress={() => router.push("/cart")}
          >
            <Text style={styles.icon}>🛒</Text>
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {totalItems > 9 ? "9+" : totalItems}
                </Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceBorder,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  brandMark: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.accent,
  },
  brandName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  rightSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  pageTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  iconButton: {
    position: "relative",
    padding: 4,
  },
  icon: {
    fontSize: 18,
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    left: -4,
    backgroundColor: colors.accent,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});
