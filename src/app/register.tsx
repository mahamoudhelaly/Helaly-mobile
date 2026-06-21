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
import { registerUser } from "@/services/api";
import { colors } from "@/constants/theme";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert("بيانات ناقصة", "الاسم والإيميل والباسورد مطلوبين");
      return;
    }

    if (password.length < 6) {
      Alert.alert("باسورد قصير", "الباسورد لازم يكون 6 حروف على الأقل");
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      router.replace("/categories");
    } catch (err: any) {
      Alert.alert("تعذر إنشاء الحساب", err.message);
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
        <View style={styles.brandZone}>
          <Text style={styles.brandName}>HellyBuy</Text>
          <View style={styles.brandGlowLine} />
          <Text style={styles.brandTagline}>ابدأ رحلتك معنا</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>إنشاء حساب جديد</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>الاسم بالكامل</Text>
            <TextInput
              style={styles.input}
              placeholder="اسمك هنا"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              textAlign="right"
            />
          </View>

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
            <Text style={styles.fieldLabel}>رقم الهاتف (اختياري)</Text>
            <TextInput
              style={styles.input}
              placeholder="01xxxxxxxxx"
              placeholderTextColor={colors.textSecondary}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              textAlign="right"
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>الباسورد</Text>
            <TextInput
              style={styles.input}
              placeholder="6 حروف على الأقل"
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
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>إنشاء الحساب</Text>
            )}
          </Pressable>

          <Link href="/login" asChild>
            <Pressable style={styles.secondaryLink}>
              <Text style={styles.secondaryLinkText}>
                عندك حساب؟ <Text style={styles.secondaryLinkAccent}>سجّل دخول</Text>
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
    marginBottom: 32,
  },
  brandName: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  brandGlowLine: {
    width: 56,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 10,
    shadowColor: colors.accent,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  brandTagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 12,
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
