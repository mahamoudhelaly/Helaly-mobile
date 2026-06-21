import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "@/constants/theme";
import { BrandHeader } from "@/components/BrandHeader";
import { useCart } from "@/context/CartContext";
import { createAddress, createOrder } from "@/services/api";

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  // بيانات العنوان
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");

  // بيانات البطاقة (شكل Stripe بصري فقط، بدون معالجة دفع فعلية)
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [loading, setLoading] = useState(false);

  // تنسيق رقم الكارت بمسافات كل 4 أرقام، شكل بصري شائع في نماذج الدفع
  function formatCardNumber(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }

  async function handleConfirmOrder() {
    if (!fullName.trim() || !phone.trim() || !city.trim() || !street.trim()) {
      Alert.alert("بيانات ناقصة", "أدخل بيانات العنوان بالكامل");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16 || !expiry || cvv.length < 3) {
      Alert.alert("بيانات البطاقة ناقصة", "أدخل بيانات البطاقة بالكامل");
      return;
    }

    setLoading(true);
    try {
      // 1) إنشاء العنوان فعلياً في الـ Backend
      const addressData = await createAddress({
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        street: street.trim(),
      });

      // 2) إنشاء الطلب فعلياً، مرتبط بالعنوان والمنتجات الموجودة في السلة
      await createOrder({
        addressId: addressData.address.id,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // 3) تفريغ السلة وإظهار رسالة نجاح
      clearCart();
      Alert.alert("تم تأكيد طلبك 🎉", "سيتم التواصل معك لتأكيد التوصيل", [
        { text: "تم", onPress: () => router.replace("/categories") },
      ]);
    } catch (err: any) {
      Alert.alert("تعذر إتمام الطلب", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <BrandHeader title="إتمام الطلب" hideCart />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* قسم العنوان */}
        <Text style={styles.sectionTitle}>عنوان التوصيل</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="الاسم بالكامل"
            placeholderTextColor={colors.textSecondary}
            value={fullName}
            onChangeText={setFullName}
            textAlign="right"
          />
          <TextInput
            style={styles.input}
            placeholder="رقم الهاتف"
            placeholderTextColor={colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            textAlign="right"
          />
          <TextInput
            style={styles.input}
            placeholder="المدينة"
            placeholderTextColor={colors.textSecondary}
            value={city}
            onChangeText={setCity}
            textAlign="right"
          />
          <TextInput
            style={[styles.input, { marginBottom: 0 }]}
            placeholder="الشارع وتفاصيل العنوان"
            placeholderTextColor={colors.textSecondary}
            value={street}
            onChangeText={setStreet}
            textAlign="right"
          />
        </View>

        {/* قسم بيانات البطاقة (شكل بصري فقط) */}
        <Text style={styles.sectionTitle}>بيانات الدفع</Text>
        <View style={styles.card}>
          <View style={styles.cardBrandRow}>
            <Text style={styles.cardBrandText}>💳 بطاقة بنكية</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="0000 0000 0000 0000"
            placeholderTextColor={colors.textSecondary}
            value={cardNumber}
            onChangeText={(v) => setCardNumber(formatCardNumber(v))}
            keyboardType="number-pad"
            textAlign="left"
          />

          <View style={styles.cardRow}>
            <TextInput
              style={[styles.input, styles.halfInput, { marginBottom: 0 }]}
              placeholder="MM/YY"
              placeholderTextColor={colors.textSecondary}
              value={expiry}
              onChangeText={(v) => setExpiry(formatExpiry(v))}
              keyboardType="number-pad"
              textAlign="left"
              maxLength={5}
            />
            <TextInput
              style={[styles.input, styles.halfInput, { marginBottom: 0 }]}
              placeholder="CVV"
              placeholderTextColor={colors.textSecondary}
              value={cvv}
              onChangeText={(v) => setCvv(v.replace(/\D/g, "").slice(0, 3))}
              keyboardType="number-pad"
              secureTextEntry
              textAlign="left"
              maxLength={3}
            />
          </View>
        </View>
      </ScrollView>

      {/* ملخص وزر التأكيد */}
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalValue}>{totalPrice.toFixed(2)} ج.م</Text>
          <Text style={styles.totalLabel}>الإجمالي المطلوب دفعه</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.confirmButton,
            pressed && styles.confirmButtonPressed,
            loading && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>تأكيد الطلب والدفع</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  cardBrandRow: {
    marginBottom: spacing.sm,
  },
  cardBrandText: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "right",
  },
  cardRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  halfInput: {
    flex: 1,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceBorder,
    backgroundColor: colors.bg,
  },
  totalRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  totalLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  confirmButton: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  confirmButtonPressed: {
    opacity: 0.85,
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
