import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { loginUser } from "@/services/api";
import { colors } from "@/constants/theme";

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("بيانات ناقصة", "أدخل الإيميل والباسورد للمتابعة");
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email: email.trim(), password });
      router.replace("/categories");
    } catch (err: any) {
      Alert.alert("تعذر تسجيل الدخول", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* منطقة الهوية العلوية */}
        <View style={styles.brandZone}>
          <Text style={styles.brandName}>HellyBuy</Text>
          <View style={styles.brandGlowLine} />
          <Text style={styles.brandTagline}>إلكترونياتك، من مكان واحد</Text>
        </View>

        {/* بطاقة النموذج */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>تسجيل الدخول</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>الإيميل</Text>
            <TextInput
              style={styles.input}
              placeholder="example@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textAlign="right"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>الباسورد</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              loading && styles.primaryButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.bg} />
            ) : (
              <Text style={styles.primaryButtonText}>تسجيل الدخول</Text>
            )}
          </Pressable>

          <Link href="/register" asChild>
            <Pressable style={styles.secondaryLink}>
              <Text style={styles.secondaryLinkText}>
                مستخدم جديد؟ <Text style={styles.secondaryLinkAccent}>اعمل حساب</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  brandZone: {
    alignItems: "center",
    marginBottom: 40,
  },
  brandName: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  brandGlowLine: {
    width: 64,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 12,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  brandTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 14,
    letterSpacing: 0.3,
  },
  formCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    padding: 24,
  },
  formTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
    marginBottom: 22,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  primaryButtonPressed: {
    opacity: 0.85,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryLink: {
    marginTop: 18,
    alignItems: "center",
  },
  secondaryLinkText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  secondaryLinkAccent: {
    color: colors.accent,
    fontWeight: "700",
  },
});
