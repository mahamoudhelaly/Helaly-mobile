import { Redirect } from "expo-router";

export default function Index() {
  // أول ما يفتح التطبيق، نوجّه المستخدم مباشرة لصفحة تسجيل الدخول
  return <Redirect href="/login" />;
}
