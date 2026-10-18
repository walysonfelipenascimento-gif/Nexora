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

const extraMessages: Partial<Record<NexoraLanguage, Record<string, string>>> = {
  "pt-BR": { search: "Pesquisar", notifications: "Notificações", moreOptions: "Mais opções", stories: "Stories", socialFeed: "Feed social", like: "Curtir", comment: "Comentar", share: "Compartilhar", save: "Salvar", viewComments: "Ver comentários", officialLanguageNotice: "Atualmente, a Nexora oferece 25 opções de idioma. A tradução completa da interface está sendo implementada gradualmente." },
  "en-US": { search: "Search", notifications: "Notifications", moreOptions: "More options", stories: "Stories", socialFeed: "Social feed", like: "Like", comment: "Comment", share: "Share", save: "Save", viewComments: "View comments", officialLanguageNotice: "Nexora currently offers 25 language options. Full interface translation is being implemented gradually." },
  es: { search: "Buscar", notifications: "Notificaciones", moreOptions: "Más opciones", stories: "Historias", socialFeed: "Feed social", like: "Me gusta", comment: "Comentar", share: "Compartir", save: "Guardar", viewComments: "Ver comentarios", officialLanguageNotice: "Nexora ofrece actualmente 25 opciones de idioma. La traducción completa de la interfaz se está implementando gradualmente." },
  fr: { search: "Rechercher", notifications: "Notifications", moreOptions: "Plus d’options", stories: "Stories", socialFeed: "Fil social", like: "J’aime", comment: "Commenter", share: "Partager", save: "Enregistrer", viewComments: "Voir les commentaires", officialLanguageNotice: "Nexora propose actuellement 25 langues. La traduction complète de l’interface est en cours de déploiement." },
  de: { search: "Suchen", notifications: "Benachrichtigungen", moreOptions: "Weitere Optionen", stories: "Stories", socialFeed: "Social Feed", like: "Gefällt mir", comment: "Kommentieren", share: "Teilen", save: "Speichern", viewComments: "Kommentare ansehen", officialLanguageNotice: "Nexora bietet derzeit 25 Sprachoptionen. Die vollständige Übersetzung der Oberfläche wird schrittweise umgesetzt." },
  it: { search: "Cerca", notifications: "Notifiche", moreOptions: "Altre opzioni", stories: "Storie", socialFeed: "Feed social", like: "Mi piace", comment: "Commenta", share: "Condividi", save: "Salva", viewComments: "Visualizza commenti", officialLanguageNotice: "Nexora offre attualmente 25 lingue. La traduzione completa dell’interfaccia viene implementata gradualmente." },
  ja: { search: "検索", notifications: "通知", moreOptions: "その他のオプション", stories: "ストーリー", socialFeed: "ソーシャルフィード", like: "いいね", comment: "コメント", share: "共有", save: "保存", viewComments: "コメントを見る", officialLanguageNotice: "Nexoraでは現在25言語を選択できます。インターフェース全体の翻訳を段階的に進めています。" },
  ko: { search: "검색", notifications: "알림", moreOptions: "더 보기", stories: "스토리", socialFeed: "소셜 피드", like: "좋아요", comment: "댓글", share: "공유", save: "저장", viewComments: "댓글 보기", officialLanguageNotice: "Nexora는 현재 25개 언어 옵션을 제공합니다. 전체 인터페이스 번역을 단계적으로 적용하고 있습니다." },
  "zh-CN": { search: "搜索", notifications: "通知", moreOptions: "更多选项", stories: "快拍", socialFeed: "动态", like: "点赞", comment: "评论", share: "分享", save: "收藏", viewComments: "查看评论", officialLanguageNotice: "Nexora目前提供25种语言选项，完整界面翻译正在逐步实施。" },
  "zh-TW": { search: "搜尋", notifications: "通知", moreOptions: "更多選項", stories: "限時動態", socialFeed: "社群動態", like: "讚", comment: "留言", share: "分享", save: "儲存", viewComments: "查看留言", officialLanguageNotice: "Nexora目前提供25種語言選項，完整介面翻譯正在逐步推出。" },
  ar: { search: "بحث", notifications: "الإشعارات", moreOptions: "خيارات أخرى", stories: "القصص", socialFeed: "الموجز الاجتماعي", like: "إعجاب", comment: "تعليق", share: "مشاركة", save: "حفظ", viewComments: "عرض التعليقات", officialLanguageNotice: "توفّر Nexora حاليًا 25 خيارًا للغة. يجري تنفيذ الترجمة الكاملة للواجهة تدريجيًا." },
  hi: { search: "खोजें", notifications: "सूचनाएँ", moreOptions: "अन्य विकल्प", stories: "स्टोरीज़", socialFeed: "सोशल फ़ीड", like: "पसंद", comment: "टिप्पणी", share: "साझा करें", save: "सहेजें", viewComments: "टिप्पणियाँ देखें", officialLanguageNotice: "Nexora में वर्तमान में 25 भाषा विकल्प हैं। पूरे इंटरफ़ेस का अनुवाद चरणों में लागू किया जा रहा है।" },
  bn: { search: "অনুসন্ধান", notifications: "বিজ্ঞপ্তি", moreOptions: "আরও বিকল্প", stories: "স্টোরি", socialFeed: "সামাজিক ফিড", like: "লাইক", comment: "মন্তব্য", share: "শেয়ার", save: "সংরক্ষণ", viewComments: "মন্তব্য দেখুন", officialLanguageNotice: "Nexora-তে বর্তমানে ২৫টি ভাষার বিকল্প রয়েছে। সম্পূর্ণ ইন্টারফেস অনুবাদ ধাপে ধাপে চালু করা হচ্ছে।" },
  ru: { search: "Поиск", notifications: "Уведомления", moreOptions: "Другие параметры", stories: "Истории", socialFeed: "Лента", like: "Нравится", comment: "Комментировать", share: "Поделиться", save: "Сохранить", viewComments: "Посмотреть комментарии", officialLanguageNotice: "Сейчас Nexora предлагает 25 языков. Полный перевод интерфейса внедряется поэтапно." },
  tr: { search: "Ara", notifications: "Bildirimler", moreOptions: "Diğer seçenekler", stories: "Hikâyeler", socialFeed: "Sosyal akış", like: "Beğen", comment: "Yorum yap", share: "Paylaş", save: "Kaydet", viewComments: "Yorumları gör", officialLanguageNotice: "Nexora şu anda 25 dil seçeneği sunuyor. Arayüzün tamamının çevirisi aşamalı olarak uygulanıyor." },
  id: { search: "Cari", notifications: "Notifikasi", moreOptions: "Opsi lainnya", stories: "Cerita", socialFeed: "Feed sosial", like: "Suka", comment: "Komentar", share: "Bagikan", save: "Simpan", viewComments: "Lihat komentar", officialLanguageNotice: "Nexora saat ini menyediakan 25 pilihan bahasa. Terjemahan seluruh antarmuka diterapkan secara bertahap." },
  ms: { search: "Cari", notifications: "Pemberitahuan", moreOptions: "Pilihan lain", stories: "Cerita", socialFeed: "Suapan sosial", like: "Suka", comment: "Komen", share: "Kongsi", save: "Simpan", viewComments: "Lihat komen", officialLanguageNotice: "Nexora kini menawarkan 25 pilihan bahasa. Terjemahan penuh antara muka dilaksanakan secara berperingkat." },
  th: { search: "ค้นหา", notifications: "การแจ้งเตือน", moreOptions: "ตัวเลือกเพิ่มเติม", stories: "สตอรี่", socialFeed: "ฟีดโซเชียล", like: "ถูกใจ", comment: "แสดงความคิดเห็น", share: "แชร์", save: "บันทึก", viewComments: "ดูความคิดเห็น", officialLanguageNotice: "ขณะนี้ Nexora มีตัวเลือกภาษา 25 ภาษา และกำลังทยอยแปลอินเทอร์เฟซทั้งหมด" },
  vi: { search: "Tìm kiếm", notifications: "Thông báo", moreOptions: "Tùy chọn khác", stories: "Tin", socialFeed: "Bảng tin", like: "Thích", comment: "Bình luận", share: "Chia sẻ", save: "Lưu", viewComments: "Xem bình luận", officialLanguageNotice: "Nexora hiện có 25 tùy chọn ngôn ngữ. Bản dịch toàn bộ giao diện đang được triển khai từng bước." },
  fil: { search: "Maghanap", notifications: "Mga notification", moreOptions: "Iba pang opsyon", stories: "Stories", socialFeed: "Social feed", like: "Like", comment: "Magkomento", share: "Ibahagi", save: "I-save", viewComments: "Tingnan ang mga komento", officialLanguageNotice: "May 25 pagpipilian ng wika ang Nexora sa ngayon. Unti-unting ipinapatupad ang buong pagsasalin ng interface." },
  nl: { search: "Zoeken", notifications: "Meldingen", moreOptions: "Meer opties", stories: "Verhalen", socialFeed: "Sociale feed", like: "Vind ik leuk", comment: "Reageren", share: "Delen", save: "Opslaan", viewComments: "Reacties bekijken", officialLanguageNotice: "Nexora biedt momenteel 25 taalopties. De volledige vertaling van de interface wordt stapsgewijs ingevoerd." },
  pl: { search: "Szukaj", notifications: "Powiadomienia", moreOptions: "Więcej opcji", stories: "Relacje", socialFeed: "Aktualności", like: "Lubię to", comment: "Skomentuj", share: "Udostępnij", save: "Zapisz", viewComments: "Zobacz komentarze", officialLanguageNotice: "Nexora oferuje obecnie 25 języków. Pełne tłumaczenie interfejsu jest wdrażane etapami." },
  uk: { search: "Пошук", notifications: "Сповіщення", moreOptions: "Інші параметри", stories: "Історії", socialFeed: "Стрічка", like: "Подобається", comment: "Коментувати", share: "Поширити", save: "Зберегти", viewComments: "Переглянути коментарі", officialLanguageNotice: "Наразі Nexora пропонує 25 мов. Повний переклад інтерфейсу впроваджується поступово." },
  sv: { search: "Sök", notifications: "Aviseringar", moreOptions: "Fler alternativ", stories: "Stories", socialFeed: "Socialt flöde", like: "Gilla", comment: "Kommentera", share: "Dela", save: "Spara", viewComments: "Visa kommentarer", officialLanguageNotice: "Nexora erbjuder för närvarande 25 språkval. Fullständig översättning av gränssnittet införs stegvis." },
  sw: { search: "Tafuta", notifications: "Arifa", moreOptions: "Chaguo zaidi", stories: "Hadithi", socialFeed: "Mlisho wa kijamii", like: "Penda", comment: "Toa maoni", share: "Shiriki", save: "Hifadhi", viewComments: "Tazama maoni", officialLanguageNotice: "Kwa sasa Nexora ina chaguo 25 za lugha. Tafsiri kamili ya kiolesura inawekwa hatua kwa hatua." },
};

const profileMessages: Record<NexoraLanguage, Record<string, string>> = {
  "pt-BR": { send: "Enviar", profilePosts: "Publicações", profileReels: "Reels", profilePreferences: "Preferências", profileReposts: "Republicados", repost: "Republicar", reposted: "Republicado", comments: "Comentários" },
  "en-US": { send: "Send", profilePosts: "Posts", profileReels: "Reels", profilePreferences: "Preferences", profileReposts: "Reposts", repost: "Repost", reposted: "Reposted", comments: "Comments" },
  es: { send: "Enviar", profilePosts: "Publicaciones", profileReels: "Reels", profilePreferences: "Preferencias", profileReposts: "Republicaciones", repost: "Republicar", reposted: "Republicado", comments: "Comentarios" },
  fr: { send: "Envoyer", profilePosts: "Publications", profileReels: "Reels", profilePreferences: "Préférences", profileReposts: "Republications", repost: "Republier", reposted: "Republicé", comments: "Commentaires" },
  de: { send: "Senden", profilePosts: "Beiträge", profileReels: "Reels", profilePreferences: "Einstellungen", profileReposts: "Reposts", repost: "Erneut posten", reposted: "Erneut gepostet", comments: "Kommentare" },
  it: { send: "Invia", profilePosts: "Post", profileReels: "Reels", profilePreferences: "Preferenze", profileReposts: "Ripubblicati", repost: "Ripubblica", reposted: "Ripubblicato", comments: "Commenti" },
  ja: { send: "送信", profilePosts: "投稿", profileReels: "リール", profilePreferences: "設定", profileReposts: "再投稿", repost: "再投稿", reposted: "再投稿済み", comments: "コメント" },
  ko: { send: "보내기", profilePosts: "게시물", profileReels: "릴스", profilePreferences: "환경설정", profileReposts: "재게시", repost: "다시 게시", reposted: "다시 게시됨", comments: "댓글" },
  "zh-CN": { send: "发送", profilePosts: "帖子", profileReels: "短视频", profilePreferences: "偏好设置", profileReposts: "转发", repost: "转发", reposted: "已转发", comments: "评论" },
  "zh-TW": { send: "傳送", profilePosts: "貼文", profileReels: "短片", profilePreferences: "偏好設定", profileReposts: "轉發", repost: "轉發", reposted: "已轉發", comments: "留言" },
  ar: { send: "إرسال", profilePosts: "المنشورات", profileReels: "ريلز", profilePreferences: "التفضيلات", profileReposts: "إعادة النشر", repost: "إعادة النشر", reposted: "تمت إعادة النشر", comments: "التعليقات" },
  hi: { send: "भेजें", profilePosts: "पोस्ट", profileReels: "रील्स", profilePreferences: "प्राथमिकताएँ", profileReposts: "रीपोस्ट", repost: "रीपोस्ट", reposted: "रीपोस्ट किया गया", comments: "टिप्पणियाँ" },
  bn: { send: "পাঠান", profilePosts: "পোস্ট", profileReels: "রিলস", profilePreferences: "পছন্দসমূহ", profileReposts: "পুনঃপ্রকাশ", repost: "পুনঃপ্রকাশ", reposted: "পুনঃপ্রকাশিত", comments: "মন্তব্য" },
  ru: { send: "Отправить", profilePosts: "Публикации", profileReels: "Reels", profilePreferences: "Настройки", profileReposts: "Репосты", repost: "Репост", reposted: "Опубликовано повторно", comments: "Комментарии" },
  tr: { send: "Gönder", profilePosts: "Gönderiler", profileReels: "Reels", profilePreferences: "Tercihler", profileReposts: "Yeniden paylaşımlar", repost: "Yeniden paylaş", reposted: "Yeniden paylaşıldı", comments: "Yorumlar" },
  id: { send: "Kirim", profilePosts: "Postingan", profileReels: "Reels", profilePreferences: "Preferensi", profileReposts: "Posting ulang", repost: "Posting ulang", reposted: "Diposting ulang", comments: "Komentar" },
  ms: { send: "Hantar", profilePosts: "Siaran", profileReels: "Reels", profilePreferences: "Keutamaan", profileReposts: "Siaran semula", repost: "Siar semula", reposted: "Disiarkan semula", comments: "Komen" },
  th: { send: "ส่ง", profilePosts: "โพสต์", profileReels: "รีลส์", profilePreferences: "การตั้งค่า", profileReposts: "รีโพสต์", repost: "รีโพสต์", reposted: "รีโพสต์แล้ว", comments: "ความคิดเห็น" },
  vi: { send: "Gửi", profilePosts: "Bài viết", profileReels: "Reels", profilePreferences: "Tùy chọn", profileReposts: "Đăng lại", repost: "Đăng lại", reposted: "Đã đăng lại", comments: "Bình luận" },
  fil: { send: "Ipadala", profilePosts: "Mga post", profileReels: "Reels", profilePreferences: "Mga kagustuhan", profileReposts: "Mga repost", repost: "I-repost", reposted: "Na-repost", comments: "Mga komento" },
  nl: { send: "Verzenden", profilePosts: "Berichten", profileReels: "Reels", profilePreferences: "Voorkeuren", profileReposts: "Reposts", repost: "Opnieuw plaatsen", reposted: "Opnieuw geplaatst", comments: "Reacties" },
  pl: { send: "Wyślij", profilePosts: "Posty", profileReels: "Reels", profilePreferences: "Preferencje", profileReposts: "Udostępnione ponownie", repost: "Udostępnij ponownie", reposted: "Udostępniono ponownie", comments: "Komentarze" },
  uk: { send: "Надіслати", profilePosts: "Публікації", profileReels: "Reels", profilePreferences: "Налаштування", profileReposts: "Репости", repost: "Репост", reposted: "Поширено повторно", comments: "Коментарі" },
  sv: { send: "Skicka", profilePosts: "Inlägg", profileReels: "Reels", profilePreferences: "Inställningar", profileReposts: "Återpublicerat", repost: "Återpublicera", reposted: "Återpublicerat", comments: "Kommentarer" },
  sw: { send: "Tuma", profilePosts: "Machapisho", profileReels: "Reels", profilePreferences: "Mapendeleo", profileReposts: "Machapisho yaliyoshirikiwa tena", repost: "Shiriki tena", reposted: "Imeshirikiwa tena", comments: "Maoni" },
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
  return messages[language]?.[key] ?? extraMessages[language]?.[key] ?? profileMessages[language]?.[key] ?? messages[DEFAULT_LANGUAGE][key] ?? extraMessages[DEFAULT_LANGUAGE]?.[key] ?? profileMessages[DEFAULT_LANGUAGE]?.[key] ?? key;
}
