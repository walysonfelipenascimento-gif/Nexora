export const NEXORA_LANGUAGES = [
  { label: "Português (Brasil)", code: "pt-BR" },
  { label: "English (United States)", code: "en-US" },
  { label: "Español", code: "es" },
  { label: "Français", code: "fr" },
  { label: "Deutsch", code: "de" },
  { label: "Italiano", code: "it" },
  { label: "日本語", code: "ja" },
  { label: "한국어", code: "ko" },
  { label: "中文（简体）", code: "zh-CN" },
  { label: "中文（繁體）", code: "zh-TW" },
  { label: "العربية", code: "ar" },
  { label: "हिन्दी", code: "hi" },
  { label: "বাংলা", code: "bn" },
  { label: "Русский", code: "ru" },
  { label: "Türkçe", code: "tr" },
  { label: "Bahasa Indonesia", code: "id" },
  { label: "Bahasa Melayu", code: "ms" },
  { label: "ไทย", code: "th" },
  { label: "Tiếng Việt", code: "vi" },
  { label: "Filipino", code: "fil" },
  { label: "Nederlands", code: "nl" },
  { label: "Polski", code: "pl" },
  { label: "Українська", code: "uk" },
  { label: "Svenska", code: "sv" },
  { label: "Kiswahili", code: "sw" },
] as const;

export type NexoraLanguage = typeof NEXORA_LANGUAGES[number]["code"];
export const DEFAULT_LANGUAGE: NexoraLanguage = "pt-BR";
export const LANGUAGE_STORAGE_KEY = "nexora-language-v1";

const messages: Record<NexoraLanguage, Record<string, string>> = {
  "pt-BR": { home: "Início", reels: "Reels", create: "Criar", messages: "Mensagens", store: "Loja", profile: "Perfil", mainNavigation: "Navegação principal" },
  "en-US": { home: "Home", reels: "Reels", create: "Create", messages: "Messages", store: "Store", profile: "Profile", mainNavigation: "Main navigation" },
  es: { home: "Inicio", reels: "Reels", create: "Crear", messages: "Mensajes", store: "Tienda", profile: "Perfil", mainNavigation: "Navegación principal" },
  fr: { home: "Accueil", reels: "Reels", create: "Créer", messages: "Messages", store: "Boutique", profile: "Profil", mainNavigation: "Navigation principale" },
  de: { home: "Start", reels: "Reels", create: "Erstellen", messages: "Nachrichten", store: "Shop", profile: "Profil", mainNavigation: "Hauptnavigation" },
  it: { home: "Home", reels: "Reels", create: "Crea", messages: "Messaggi", store: "Negozio", profile: "Profilo", mainNavigation: "Navigazione principale" },
  ja: { home: "ホーム", reels: "リール", create: "作成", messages: "メッセージ", store: "ショップ", profile: "プロフィール", mainNavigation: "メインナビゲーション" },
  ko: { home: "홈", reels: "릴스", create: "만들기", messages: "메시지", store: "스토어", profile: "프로필", mainNavigation: "주요 메뉴" },
  "zh-CN": { home: "首页", reels: "短视频", create: "创建", messages: "消息", store: "商店", profile: "个人主页", mainNavigation: "主导航" },
  "zh-TW": { home: "首頁", reels: "短片", create: "建立", messages: "訊息", store: "商店", profile: "個人檔案", mainNavigation: "主導覽" },
  ar: { home: "الرئيسية", reels: "ريلز", create: "إنشاء", messages: "الرسائل", store: "المتجر", profile: "الملف الشخصي", mainNavigation: "التنقل الرئيسي" },
  hi: { home: "होम", reels: "रील्स", create: "बनाएँ", messages: "संदेश", store: "स्टोर", profile: "प्रोफ़ाइल", mainNavigation: "मुख्य नेविगेशन" },
  bn: { home: "হোম", reels: "রিলস", create: "তৈরি করুন", messages: "বার্তা", store: "দোকান", profile: "প্রোফাইল", mainNavigation: "প্রধান নেভিগেশন" },
  ru: { home: "Главная", reels: "Reels", create: "Создать", messages: "Сообщения", store: "Магазин", profile: "Профиль", mainNavigation: "Главная навигация" },
  tr: { home: "Ana sayfa", reels: "Reels", create: "Oluştur", messages: "Mesajlar", store: "Mağaza", profile: "Profil", mainNavigation: "Ana gezinme" },
  id: { home: "Beranda", reels: "Reels", create: "Buat", messages: "Pesan", store: "Toko", profile: "Profil", mainNavigation: "Navigasi utama" },
  ms: { home: "Laman utama", reels: "Reels", create: "Cipta", messages: "Mesej", store: "Kedai", profile: "Profil", mainNavigation: "Navigasi utama" },
  th: { home: "หน้าหลัก", reels: "รีลส์", create: "สร้าง", messages: "ข้อความ", store: "ร้านค้า", profile: "โปรไฟล์", mainNavigation: "เมนูหลัก" },
  vi: { home: "Trang chủ", reels: "Reels", create: "Tạo", messages: "Tin nhắn", store: "Cửa hàng", profile: "Hồ sơ", mainNavigation: "Điều hướng chính" },
  fil: { home: "Home", reels: "Reels", create: "Gumawa", messages: "Mga mensahe", store: "Tindahan", profile: "Profile", mainNavigation: "Pangunahing nabigasyon" },
  nl: { home: "Home", reels: "Reels", create: "Maken", messages: "Berichten", store: "Winkel", profile: "Profiel", mainNavigation: "Hoofdnavigatie" },
  pl: { home: "Strona główna", reels: "Reels", create: "Utwórz", messages: "Wiadomości", store: "Sklep", profile: "Profil", mainNavigation: "Nawigacja główna" },
  uk: { home: "Головна", reels: "Reels", create: "Створити", messages: "Повідомлення", store: "Крамниця", profile: "Профіль", mainNavigation: "Головна навігація" },
  sv: { home: "Hem", reels: "Reels", create: "Skapa", messages: "Meddelanden", store: "Butik", profile: "Profil", mainNavigation: "Huvudnavigering" },
  sw: { home: "Nyumbani", reels: "Reels", create: "Unda", messages: "Ujumbe", store: "Duka", profile: "Wasifu", mainNavigation: "Urambazaji mkuu" },
};

export function getSavedLanguage(): NexoraLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return NEXORA_LANGUAGES.some((language) => language.code === saved)
      ? (saved as NexoraLanguage)
      : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function translate(language: NexoraLanguage, key: string): string {
  return messages[language]?.[key] ?? messages[DEFAULT_LANGUAGE][key] ?? key;
}
