import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { getOrders } from "@/services/api";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";

interface Order {
  id: number;
  status: string;
  totalPrice: string;
  createdAt: string;
}

// تحويل حالة الطلب التقنية لنص عربي واضح + لون مناسب
const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "قيد الانتظار", color: "#E0A938" },
  received: { label: "تم الاستلام", color: "#5B6CFF" },
  processing: { label: "جاري التجهيز", color: "#5B6CFF" },
  shipped: { label: "تم الشحن", color: "#3DDC97" },
  delivered: { label: "تم التوصيل", color: "#3DDC97" },
  cancelled: { label: "ملغي", color: "#FF6B6B" },
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || "حصل خطأ في تحميل الطلبات");
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <View style={styles.screen}>
      <BrandHeader title="طلباتي" />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadOrders}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>لا توجد طلبات سابقة</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const status = statusMap[item.status] ?? {
              label: item.status,
              color: colors.textSecondary,
            };
            return (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.color + "22" },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                  <Text style={styles.orderNumber}>طلب #{item.id}</Text>
                </View>

                <View style={styles.orderFooter}>
                  <Text style={styles.orderPrice}>{item.totalPrice} ج.م</Text>
                  <Text style={styles.orderDate}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
              </View>
            );
          }}
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
  listContent: {
    padding: spacing.md,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  orderHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  orderFooter: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.success,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
