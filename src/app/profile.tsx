import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { getMe, logout } from "@/services/api";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  loyaltyPoints: number;
}

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError(null);
    try {
      const data = await getMe();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message || "حصل خطأ في تحميل بيانات الحساب");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    Alert.alert("تسجيل الخروج", "هل أنت متأكد من تسجيل الخروج؟", [
      { text: "إلغاء", style: "cancel" },
      {
        text: "خروج",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <BrandHeader title="حسابي" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </View>
    );
  }

  if (error || !user) {
    return (
      <View style={styles.screen}>
        <BrandHeader title="حسابي" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error || "تعذر تحميل البيانات"}</Text>
          <Pressable style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <BrandHeader title="حسابي" />

      <View style={styles.content}>
        {/* بطاقة بيانات المستخدم */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.loyaltyBadge}>
            <Text style={styles.loyaltyText}>
              {user.loyaltyPoints} نقطة ولاء
            </Text>
          </View>
        </View>

        {/* قسم تفاصيل الحساب */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>{user.phone || "غير محدد"}</Text>
            <Text style={styles.infoLabel}>رقم الهاتف</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoValue}>
              {user.role === "admin" ? "مدير" : "عميل"}
            </Text>
            <Text style={styles.infoLabel}>نوع الحساب</Text>
          </View>
        </View>

        {/* قائمة الإجراءات */}
        <View style={styles.actionsCard}>
          <Pressable
            style={styles.actionRow}
            onPress={() => router.push("/orders")}
          >
            <Text style={styles.actionArrow}>‹</Text>
            <Text style={styles.actionText}>📦 طلباتي</Text>
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={styles.actionRow}
            onPress={() => router.push("/wishlist")}
          >
            <Text style={styles.actionArrow}>‹</Text>
            <Text style={styles.actionText}>❤️ المفضلة</Text>
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>تسجيل الخروج</Text>
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
  content: {
    padding: spacing.md,
  },
  profileCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  userName: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  userEmail: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  loyaltyBadge: {
    backgroundColor: colors.accentMuted,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginTop: spacing.sm,
  },
  loyaltyText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceBorder,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  actionRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  actionArrow: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  logoutButton: {
    backgroundColor: "#3A1A1A",
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: "700",
  },
});
