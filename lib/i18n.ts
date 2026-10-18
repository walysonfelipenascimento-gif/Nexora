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

const profileUiMessages: Record<NexoraLanguage, Record<string, string>> = {
  "pt-BR": { editProfile: "Editar perfil", viewFollowers: "Ver seguidores", viewFollowing: "Ver quem sigo", followers: "Seguidores", following: "Seguindo", testFollowers: "Seguidores de teste" },
  "en-US": { editProfile: "Edit profile", viewFollowers: "View followers", viewFollowing: "View following", followers: "Followers", following: "Following", testFollowers: "Test followers" },
  es: { editProfile: "Editar perfil", viewFollowers: "Ver seguidores", viewFollowing: "Ver seguidos", followers: "Seguidores", following: "Siguiendo", testFollowers: "Seguidores de prueba" },
  fr: { editProfile: "Modifier le profil", viewFollowers: "Voir les abonnés", viewFollowing: "Voir les abonnements", followers: "Abonnés", following: "Abonnements", testFollowers: "Abonnés de test" },
  de: { editProfile: "Profil bearbeiten", viewFollowers: "Follower ansehen", viewFollowing: "Abonniert ansehen", followers: "Follower", following: "Folge ich", testFollowers: "Test-Follower" },
  it: { editProfile: "Modifica profilo", viewFollowers: "Vedi follower", viewFollowing: "Vedi seguiti", followers: "Follower", following: "Seguiti", testFollowers: "Follower di prova" },
  ja: { editProfile: "プロフィールを編集", viewFollowers: "フォロワーを見る", viewFollowing: "フォロー中を見る", followers: "フォロワー", following: "フォロー中", testFollowers: "テスト用フォロワー" },
  ko: { editProfile: "프로필 편집", viewFollowers: "팔로워 보기", viewFollowing: "팔로잉 보기", followers: "팔로워", following: "팔로잉", testFollowers: "테스트 팔로워" },
  "zh-CN": { editProfile: "编辑个人资料", viewFollowers: "查看粉丝", viewFollowing: "查看关注", followers: "粉丝", following: "关注中", testFollowers: "测试粉丝" },
  "zh-TW": { editProfile: "編輯個人檔案", viewFollowers: "查看追蹤者", viewFollowing: "查看追蹤中", followers: "追蹤者", following: "追蹤中", testFollowers: "測試追蹤者" },
  ar: { editProfile: "تعديل الملف الشخصي", viewFollowers: "عرض المتابعين", viewFollowing: "عرض الذين أتابعهم", followers: "المتابعون", following: "أتابع", testFollowers: "متابعون تجريبيون" },
  hi: { editProfile: "प्रोफ़ाइल संपादित करें", viewFollowers: "फ़ॉलोअर देखें", viewFollowing: "जिन्हें फ़ॉलो करते हैं देखें", followers: "फ़ॉलोअर", following: "फ़ॉलो कर रहे हैं", testFollowers: "परीक्षण फ़ॉलोअर" },
  bn: { editProfile: "প্রোফাইল সম্পাদনা", viewFollowers: "অনুসারী দেখুন", viewFollowing: "যাদের অনুসরণ করি দেখুন", followers: "অনুসারী", following: "অনুসরণ করছি", testFollowers: "পরীক্ষামূলক অনুসারী" },
  ru: { editProfile: "Редактировать профиль", viewFollowers: "Посмотреть подписчиков", viewFollowing: "Посмотреть подписки", followers: "Подписчики", following: "Подписки", testFollowers: "Тестовые подписчики" },
  tr: { editProfile: "Profili düzenle", viewFollowers: "Takipçileri gör", viewFollowing: "Takip ettiklerini gör", followers: "Takipçiler", following: "Takip edilenler", testFollowers: "Test takipçileri" },
  id: { editProfile: "Edit profil", viewFollowers: "Lihat pengikut", viewFollowing: "Lihat yang diikuti", followers: "Pengikut", following: "Mengikuti", testFollowers: "Pengikut uji coba" },
  ms: { editProfile: "Edit profil", viewFollowers: "Lihat pengikut", viewFollowing: "Lihat yang diikuti", followers: "Pengikut", following: "Mengikuti", testFollowers: "Pengikut ujian" },
  th: { editProfile: "แก้ไขโปรไฟล์", viewFollowers: "ดูผู้ติดตาม", viewFollowing: "ดูบัญชีที่ติดตาม", followers: "ผู้ติดตาม", following: "กำลังติดตาม", testFollowers: "ผู้ติดตามทดสอบ" },
  vi: { editProfile: "Chỉnh sửa hồ sơ", viewFollowers: "Xem người theo dõi", viewFollowing: "Xem đang theo dõi", followers: "Người theo dõi", following: "Đang theo dõi", testFollowers: "Người theo dõi thử nghiệm" },
  fil: { editProfile: "I-edit ang profile", viewFollowers: "Tingnan ang mga follower", viewFollowing: "Tingnan ang mga sinusundan", followers: "Mga follower", following: "Sinusundan", testFollowers: "Mga test follower" },
  nl: { editProfile: "Profiel bewerken", viewFollowers: "Volgers bekijken", viewFollowing: "Gevolgde accounts bekijken", followers: "Volgers", following: "Volgend", testFollowers: "Testvolgers" },
  pl: { editProfile: "Edytuj profil", viewFollowers: "Zobacz obserwujących", viewFollowing: "Zobacz obserwowanych", followers: "Obserwujący", following: "Obserwowani", testFollowers: "Testowi obserwujący" },
  uk: { editProfile: "Редагувати профіль", viewFollowers: "Переглянути підписників", viewFollowing: "Переглянути підписки", followers: "Підписники", following: "Підписки", testFollowers: "Тестові підписники" },
  sv: { editProfile: "Redigera profil", viewFollowers: "Visa följare", viewFollowing: "Visa följer", followers: "Följare", following: "Följer", testFollowers: "Testföljare" },
  sw: { editProfile: "Hariri wasifu", viewFollowers: "Tazama wanaokufuata", viewFollowing: "Tazama unaowafuata", followers: "Wanaokufuata", following: "Unaowafuata", testFollowers: "Wafuasi wa majaribio" },
};

export function getSavedLanguage(): NexoraLanguage {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;
  try {
    const isSupported = (value: unknown): value is NexoraLanguage =>
      typeof value === "string" &&
      NEXORA_LANGUAGES.some((language) => language.code === value);

    // Prefer the dedicated language key; keep older profile preferences compatible.
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupported(saved)) return saved;

    const rawProfile = window.localStorage.getItem("nexora-profile-v1");
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile) as {
        profile?: { selectedSettings?: { idioma?: unknown } };
        selectedSettings?: { idioma?: unknown };
      };
      const legacyChoice =
        parsed.profile?.selectedSettings?.idioma ?? parsed.selectedSettings?.idioma;

      if (isSupported(legacyChoice)) return legacyChoice;
      if (typeof legacyChoice === "string") {
        const matchingLanguage = NEXORA_LANGUAGES.find(
          (language) => language.label.toLocaleLowerCase() === legacyChoice.toLocaleLowerCase()
        );
        if (matchingLanguage) return matchingLanguage.code;
      }
    }
  } catch {
    // Corrupted or unavailable local storage must never prevent the app from loading.
  }
  return DEFAULT_LANGUAGE;
}

const settingsMessages: Record<NexoraLanguage, Record<string, string>> = {
  "pt-BR": { settingsTitle: "Configurações e atividade", settingsSubtitle: "Personalize sua experiência", settingsSearch: "Buscar nas configurações", settingsClose: "Fechar configurações", settingsDone: "Concluir", settingsBackProfile: "Voltar ao perfil", settingsBackAll: "Todas as configurações" , languageSaved: "Idioma salvo neste dispositivo." , preferenceSaved: "Preferência atualizada neste dispositivo." , languageNotice: "A tradução das demais telas será ampliada por etapas." },
  "en-US": { settingsTitle: "Settings and activity", settingsSubtitle: "Personalize your experience", settingsSearch: "Search settings", settingsClose: "Close settings", settingsDone: "Done", settingsBackProfile: "Back to profile", settingsBackAll: "All settings" , languageSaved: "Language saved on this device." , preferenceSaved: "Preference updated on this device." , languageNotice: "Translations for the remaining screens will be expanded in stages." },
  es: { settingsTitle: "Configuración y actividad", settingsSubtitle: "Personaliza tu experiencia", settingsSearch: "Buscar en configuración", settingsClose: "Cerrar configuración", settingsDone: "Listo", settingsBackProfile: "Volver al perfil", settingsBackAll: "Toda la configuración" , languageSaved: "Idioma guardado en este dispositivo." , preferenceSaved: "Preferencia actualizada en este dispositivo." , languageNotice: "Las traducciones de las demás pantallas se ampliarán por etapas." },
  fr: { settingsTitle: "Paramètres et activité", settingsSubtitle: "Personnalisez votre expérience", settingsSearch: "Rechercher dans les paramètres", settingsClose: "Fermer les paramètres", settingsDone: "Terminer", settingsBackProfile: "Retour au profil", settingsBackAll: "Tous les paramètres" , languageSaved: "Langue enregistrée sur cet appareil." , preferenceSaved: "Préférence mise à jour sur cet appareil." , languageNotice: "La traduction des autres écrans sera étendue par étapes." },
  de: { settingsTitle: "Einstellungen und Aktivitäten", settingsSubtitle: "Passe dein Erlebnis an", settingsSearch: "Einstellungen durchsuchen", settingsClose: "Einstellungen schließen", settingsDone: "Fertig", settingsBackProfile: "Zurück zum Profil", settingsBackAll: "Alle Einstellungen" , languageSaved: "Sprache auf diesem Gerät gespeichert." , preferenceSaved: "Einstellung auf diesem Gerät aktualisiert." , languageNotice: "Die Übersetzung weiterer Bildschirme wird schrittweise erweitert." },
  it: { settingsTitle: "Impostazioni e attività", settingsSubtitle: "Personalizza la tua esperienza", settingsSearch: "Cerca nelle impostazioni", settingsClose: "Chiudi impostazioni", settingsDone: "Fine", settingsBackProfile: "Torna al profilo", settingsBackAll: "Tutte le impostazioni" , languageSaved: "Lingua salvata su questo dispositivo." , preferenceSaved: "Preferenza aggiornata su questo dispositivo." , languageNotice: "La traduzione delle altre schermate sarà ampliata per fasi." },
  ja: { settingsTitle: "設定とアクティビティ", settingsSubtitle: "利用体験をカスタマイズ", settingsSearch: "設定を検索", settingsClose: "設定を閉じる", settingsDone: "完了", settingsBackProfile: "プロフィールに戻る", settingsBackAll: "すべての設定" , languageSaved: "言語をこのデバイスに保存しました。" , preferenceSaved: "このデバイスの設定を更新しました。" , languageNotice: "他の画面の翻訳は段階的に拡充されます。" },
  ko: { settingsTitle: "설정 및 활동", settingsSubtitle: "사용 환경을 맞춤 설정하세요", settingsSearch: "설정 검색", settingsClose: "설정 닫기", settingsDone: "완료", settingsBackProfile: "프로필로 돌아가기", settingsBackAll: "모든 설정" , languageSaved: "이 기기에 언어를 저장했습니다." , preferenceSaved: "이 기기의 설정을 업데이트했습니다." , languageNotice: "나머지 화면 번역은 단계적으로 확대됩니다." },
  "zh-CN": { settingsTitle: "设置与动态", settingsSubtitle: "个性化你的体验", settingsSearch: "搜索设置", settingsClose: "关闭设置", settingsDone: "完成", settingsBackProfile: "返回个人主页", settingsBackAll: "所有设置" , languageSaved: "语言已保存到此设备。" , preferenceSaved: "此设备上的偏好设置已更新。" , languageNotice: "其余页面的翻译将分阶段扩展。" },
  "zh-TW": { settingsTitle: "設定與活動", settingsSubtitle: "個人化你的體驗", settingsSearch: "搜尋設定", settingsClose: "關閉設定", settingsDone: "完成", settingsBackProfile: "返回個人檔案", settingsBackAll: "所有設定" , languageSaved: "語言已儲存至此裝置。" , preferenceSaved: "此裝置上的偏好設定已更新。" , languageNotice: "其餘頁面的翻譯將分階段擴充。" },
  ar: { settingsTitle: "الإعدادات والنشاط", settingsSubtitle: "خصص تجربتك", settingsSearch: "البحث في الإعدادات", settingsClose: "إغلاق الإعدادات", settingsDone: "تم", settingsBackProfile: "العودة إلى الملف الشخصي", settingsBackAll: "كل الإعدادات" , languageSaved: "تم حفظ اللغة على هذا الجهاز." , preferenceSaved: "تم تحديث التفضيل على هذا الجهاز." , languageNotice: "ستتم إضافة ترجمات الشاشات الأخرى على مراحل." },
  hi: { settingsTitle: "सेटिंग और गतिविधि", settingsSubtitle: "अपने अनुभव को अनुकूलित करें", settingsSearch: "सेटिंग खोजें", settingsClose: "सेटिंग बंद करें", settingsDone: "पूर्ण", settingsBackProfile: "प्रोफ़ाइल पर वापस जाएँ", settingsBackAll: "सभी सेटिंग" , languageSaved: "इस डिवाइस पर भाषा सहेजी गई।" , preferenceSaved: "इस डिवाइस पर प्राथमिकता अपडेट की गई।" , languageNotice: "अन्य स्क्रीन के अनुवाद चरणों में बढ़ाए जाएँगे।" },
  bn: { settingsTitle: "সেটিংস ও কার্যকলাপ", settingsSubtitle: "আপনার অভিজ্ঞতা ব্যক্তিগত করুন", settingsSearch: "সেটিংস খুঁজুন", settingsClose: "সেটিংস বন্ধ করুন", settingsDone: "সম্পন্ন", settingsBackProfile: "প্রোফাইলে ফিরুন", settingsBackAll: "সব সেটিংস" , languageSaved: "এই ডিভাইসে ভাষা সংরক্ষণ করা হয়েছে।" , preferenceSaved: "এই ডিভাইসে পছন্দ আপডেট করা হয়েছে।" , languageNotice: "অন্যান্য স্ক্রিনের অনুবাদ ধাপে ধাপে বাড়ানো হবে।" },
  ru: { settingsTitle: "Настройки и действия", settingsSubtitle: "Настройте свой интерфейс", settingsSearch: "Поиск в настройках", settingsClose: "Закрыть настройки", settingsDone: "Готово", settingsBackProfile: "Вернуться в профиль", settingsBackAll: "Все настройки" , languageSaved: "Язык сохранён на этом устройстве." , preferenceSaved: "Настройка обновлена на этом устройстве." , languageNotice: "Перевод остальных экранов будет расширяться поэтапно." },
  tr: { settingsTitle: "Ayarlar ve hareketler", settingsSubtitle: "Deneyimini kişiselleştir", settingsSearch: "Ayarlarda ara", settingsClose: "Ayarları kapat", settingsDone: "Tamam", settingsBackProfile: "Profile dön", settingsBackAll: "Tüm ayarlar" , languageSaved: "Dil bu cihaza kaydedildi." , preferenceSaved: "Tercih bu cihazda güncellendi." , languageNotice: "Diğer ekranların çevirileri aşamalı olarak genişletilecek." },
  id: { settingsTitle: "Pengaturan dan aktivitas", settingsSubtitle: "Sesuaikan pengalaman Anda", settingsSearch: "Cari pengaturan", settingsClose: "Tutup pengaturan", settingsDone: "Selesai", settingsBackProfile: "Kembali ke profil", settingsBackAll: "Semua pengaturan" , languageSaved: "Bahasa disimpan di perangkat ini." , preferenceSaved: "Preferensi diperbarui di perangkat ini." , languageNotice: "Terjemahan layar lainnya akan diperluas secara bertahap." },
  ms: { settingsTitle: "Tetapan dan aktiviti", settingsSubtitle: "Peribadikan pengalaman anda", settingsSearch: "Cari tetapan", settingsClose: "Tutup tetapan", settingsDone: "Selesai", settingsBackProfile: "Kembali ke profil", settingsBackAll: "Semua tetapan" , languageSaved: "Bahasa disimpan pada peranti ini." , preferenceSaved: "Keutamaan dikemas kini pada peranti ini." , languageNotice: "Terjemahan skrin lain akan diperluas secara berperingkat." },
  th: { settingsTitle: "การตั้งค่าและกิจกรรม", settingsSubtitle: "ปรับแต่งประสบการณ์ของคุณ", settingsSearch: "ค้นหาการตั้งค่า", settingsClose: "ปิดการตั้งค่า", settingsDone: "เสร็จสิ้น", settingsBackProfile: "กลับไปที่โปรไฟล์", settingsBackAll: "การตั้งค่าทั้งหมด" , languageSaved: "บันทึกภาษาไว้ในอุปกรณ์นี้แล้ว" , preferenceSaved: "อัปเดตการตั้งค่าในอุปกรณ์นี้แล้ว" , languageNotice: "การแปลหน้าจออื่นจะเพิ่มทีละขั้นตอน" },
  vi: { settingsTitle: "Cài đặt và hoạt động", settingsSubtitle: "Cá nhân hóa trải nghiệm của bạn", settingsSearch: "Tìm trong cài đặt", settingsClose: "Đóng cài đặt", settingsDone: "Hoàn tất", settingsBackProfile: "Quay lại hồ sơ", settingsBackAll: "Tất cả cài đặt" , languageSaved: "Đã lưu ngôn ngữ trên thiết bị này." , preferenceSaved: "Đã cập nhật tùy chọn trên thiết bị này." , languageNotice: "Bản dịch các màn hình còn lại sẽ được mở rộng theo từng giai đoạn." },
  fil: { settingsTitle: "Mga setting at aktibidad", settingsSubtitle: "I-personalize ang iyong karanasan", settingsSearch: "Maghanap sa mga setting", settingsClose: "Isara ang mga setting", settingsDone: "Tapos na", settingsBackProfile: "Bumalik sa profile", settingsBackAll: "Lahat ng setting" , languageSaved: "Na-save ang wika sa device na ito." , preferenceSaved: "Na-update ang preference sa device na ito." , languageNotice: "Palalawakin nang paunti-unti ang pagsasalin ng iba pang screen." },
  nl: { settingsTitle: "Instellingen en activiteit", settingsSubtitle: "Personaliseer je ervaring", settingsSearch: "Instellingen zoeken", settingsClose: "Instellingen sluiten", settingsDone: "Klaar", settingsBackProfile: "Terug naar profiel", settingsBackAll: "Alle instellingen" , languageSaved: "Taal opgeslagen op dit apparaat." , preferenceSaved: "Voorkeur bijgewerkt op dit apparaat." , languageNotice: "Vertalingen van de overige schermen worden stapsgewijs uitgebreid." },
  pl: { settingsTitle: "Ustawienia i aktywność", settingsSubtitle: "Dostosuj swoje doświadczenie", settingsSearch: "Szukaj w ustawieniach", settingsClose: "Zamknij ustawienia", settingsDone: "Gotowe", settingsBackProfile: "Wróć do profilu", settingsBackAll: "Wszystkie ustawienia" , languageSaved: "Język zapisano na tym urządzeniu." , preferenceSaved: "Zaktualizowano preferencję na tym urządzeniu." , languageNotice: "Tłumaczenia pozostałych ekranów będą rozszerzane etapami." },
  uk: { settingsTitle: "Налаштування та активність", settingsSubtitle: "Персоналізуйте свій досвід", settingsSearch: "Пошук у налаштуваннях", settingsClose: "Закрити налаштування", settingsDone: "Готово", settingsBackProfile: "Повернутися до профілю", settingsBackAll: "Усі налаштування" , languageSaved: "Мову збережено на цьому пристрої." , preferenceSaved: "Налаштування оновлено на цьому пристрої." , languageNotice: "Переклад решти екранів розширюватиметься поетапно." },
  sv: { settingsTitle: "Inställningar och aktivitet", settingsSubtitle: "Anpassa din upplevelse", settingsSearch: "Sök i inställningar", settingsClose: "Stäng inställningar", settingsDone: "Klart", settingsBackProfile: "Tillbaka till profilen", settingsBackAll: "Alla inställningar" , languageSaved: "Språket har sparats på den här enheten." , preferenceSaved: "Inställningen har uppdaterats på den här enheten." , languageNotice: "Översättningar av övriga skärmar utökas stegvis." },
  sw: { settingsTitle: "Mipangilio na shughuli", settingsSubtitle: "Badilisha matumizi yako upendavyo", settingsSearch: "Tafuta mipangilio", settingsClose: "Funga mipangilio", settingsDone: "Imekamilika", settingsBackProfile: "Rudi kwenye wasifu", settingsBackAll: "Mipangilio yote" , languageSaved: "Lugha imehifadhiwa kwenye kifaa hiki." , preferenceSaved: "Mapendeleo yamesasishwa kwenye kifaa hiki." , languageNotice: "Tafsiri za skrini nyingine zitaongezwa kwa hatua." },
};

const settingsCategoryMessages: Record<NexoraLanguage, Record<string, string>> = {
  "pt-BR": { settingsCategoryGeneral: "Geral", settingsCategoryAccount: "Conta", settingsCategoryPrivacy: "Privacidade", settingsCategoryContent: "Conteúdo", settingsCategoryCreator: "Criador", settingsCategoryAppearance: "Aparência", settingsCategoryData: "Dados" },
  "en-US": { settingsCategoryGeneral: "General", settingsCategoryAccount: "Account", settingsCategoryPrivacy: "Privacy", settingsCategoryContent: "Content", settingsCategoryCreator: "Creator", settingsCategoryAppearance: "Appearance", settingsCategoryData: "Data" },
  es: { settingsCategoryGeneral: "General", settingsCategoryAccount: "Cuenta", settingsCategoryPrivacy: "Privacidad", settingsCategoryContent: "Contenido", settingsCategoryCreator: "Creador", settingsCategoryAppearance: "Apariencia", settingsCategoryData: "Datos" },
  fr: { settingsCategoryGeneral: "Général", settingsCategoryAccount: "Compte", settingsCategoryPrivacy: "Confidentialité", settingsCategoryContent: "Contenu", settingsCategoryCreator: "Créateur", settingsCategoryAppearance: "Apparence", settingsCategoryData: "Données" },
  de: { settingsCategoryGeneral: "Allgemein", settingsCategoryAccount: "Konto", settingsCategoryPrivacy: "Datenschutz", settingsCategoryContent: "Inhalte", settingsCategoryCreator: "Creator", settingsCategoryAppearance: "Darstellung", settingsCategoryData: "Daten" },
  it: { settingsCategoryGeneral: "Generale", settingsCategoryAccount: "Account", settingsCategoryPrivacy: "Privacy", settingsCategoryContent: "Contenuti", settingsCategoryCreator: "Creator", settingsCategoryAppearance: "Aspetto", settingsCategoryData: "Dati" },
  ja: { settingsCategoryGeneral: "一般", settingsCategoryAccount: "アカウント", settingsCategoryPrivacy: "プライバシー", settingsCategoryContent: "コンテンツ", settingsCategoryCreator: "クリエイター", settingsCategoryAppearance: "外観", settingsCategoryData: "データ" },
  ko: { settingsCategoryGeneral: "일반", settingsCategoryAccount: "계정", settingsCategoryPrivacy: "개인정보", settingsCategoryContent: "콘텐츠", settingsCategoryCreator: "크리에이터", settingsCategoryAppearance: "화면", settingsCategoryData: "데이터" },
  "zh-CN": { settingsCategoryGeneral: "常规", settingsCategoryAccount: "账户", settingsCategoryPrivacy: "隐私", settingsCategoryContent: "内容", settingsCategoryCreator: "创作者", settingsCategoryAppearance: "外观", settingsCategoryData: "数据" },
  "zh-TW": { settingsCategoryGeneral: "一般", settingsCategoryAccount: "帳戶", settingsCategoryPrivacy: "隱私", settingsCategoryContent: "內容", settingsCategoryCreator: "創作者", settingsCategoryAppearance: "外觀", settingsCategoryData: "資料" },
  ar: { settingsCategoryGeneral: "عام", settingsCategoryAccount: "الحساب", settingsCategoryPrivacy: "الخصوصية", settingsCategoryContent: "المحتوى", settingsCategoryCreator: "صانع المحتوى", settingsCategoryAppearance: "المظهر", settingsCategoryData: "البيانات" },
  hi: { settingsCategoryGeneral: "सामान्य", settingsCategoryAccount: "खाता", settingsCategoryPrivacy: "गोपनीयता", settingsCategoryContent: "सामग्री", settingsCategoryCreator: "क्रिएटर", settingsCategoryAppearance: "रूप", settingsCategoryData: "डेटा" },
  bn: { settingsCategoryGeneral: "সাধারণ", settingsCategoryAccount: "অ্যাকাউন্ট", settingsCategoryPrivacy: "গোপনীয়তা", settingsCategoryContent: "বিষয়বস্তু", settingsCategoryCreator: "ক্রিয়েটর", settingsCategoryAppearance: "চেহারা", settingsCategoryData: "ডেটা" },
  ru: { settingsCategoryGeneral: "Общие", settingsCategoryAccount: "Аккаунт", settingsCategoryPrivacy: "Конфиденциальность", settingsCategoryContent: "Контент", settingsCategoryCreator: "Автор", settingsCategoryAppearance: "Внешний вид", settingsCategoryData: "Данные" },
  tr: { settingsCategoryGeneral: "Genel", settingsCategoryAccount: "Hesap", settingsCategoryPrivacy: "Gizlilik", settingsCategoryContent: "İçerik", settingsCategoryCreator: "İçerik üreticisi", settingsCategoryAppearance: "Görünüm", settingsCategoryData: "Veriler" },
  id: { settingsCategoryGeneral: "Umum", settingsCategoryAccount: "Akun", settingsCategoryPrivacy: "Privasi", settingsCategoryContent: "Konten", settingsCategoryCreator: "Kreator", settingsCategoryAppearance: "Tampilan", settingsCategoryData: "Data" },
  ms: { settingsCategoryGeneral: "Umum", settingsCategoryAccount: "Akaun", settingsCategoryPrivacy: "Privasi", settingsCategoryContent: "Kandungan", settingsCategoryCreator: "Pencipta", settingsCategoryAppearance: "Penampilan", settingsCategoryData: "Data" },
  th: { settingsCategoryGeneral: "ทั่วไป", settingsCategoryAccount: "บัญชี", settingsCategoryPrivacy: "ความเป็นส่วนตัว", settingsCategoryContent: "เนื้อหา", settingsCategoryCreator: "ครีเอเตอร์", settingsCategoryAppearance: "รูปลักษณ์", settingsCategoryData: "ข้อมูล" },
  vi: { settingsCategoryGeneral: "Chung", settingsCategoryAccount: "Tài khoản", settingsCategoryPrivacy: "Quyền riêng tư", settingsCategoryContent: "Nội dung", settingsCategoryCreator: "Nhà sáng tạo", settingsCategoryAppearance: "Giao diện", settingsCategoryData: "Dữ liệu" },
  fil: { settingsCategoryGeneral: "Pangkalahatan", settingsCategoryAccount: "Account", settingsCategoryPrivacy: "Privacy", settingsCategoryContent: "Nilalaman", settingsCategoryCreator: "Creator", settingsCategoryAppearance: "Hitsura", settingsCategoryData: "Data" },
  nl: { settingsCategoryGeneral: "Algemeen", settingsCategoryAccount: "Account", settingsCategoryPrivacy: "Privacy", settingsCategoryContent: "Inhoud", settingsCategoryCreator: "Maker", settingsCategoryAppearance: "Weergave", settingsCategoryData: "Gegevens" },
  pl: { settingsCategoryGeneral: "Ogólne", settingsCategoryAccount: "Konto", settingsCategoryPrivacy: "Prywatność", settingsCategoryContent: "Treści", settingsCategoryCreator: "Twórca", settingsCategoryAppearance: "Wygląd", settingsCategoryData: "Dane" },
  uk: { settingsCategoryGeneral: "Загальні", settingsCategoryAccount: "Обліковий запис", settingsCategoryPrivacy: "Приватність", settingsCategoryContent: "Вміст", settingsCategoryCreator: "Автор", settingsCategoryAppearance: "Вигляд", settingsCategoryData: "Дані" },
  sv: { settingsCategoryGeneral: "Allmänt", settingsCategoryAccount: "Konto", settingsCategoryPrivacy: "Integritet", settingsCategoryContent: "Innehåll", settingsCategoryCreator: "Skapare", settingsCategoryAppearance: "Utseende", settingsCategoryData: "Data" },
  sw: { settingsCategoryGeneral: "Jumla", settingsCategoryAccount: "Akaunti", settingsCategoryPrivacy: "Faragha", settingsCategoryContent: "Maudhui", settingsCategoryCreator: "Mtayarishi", settingsCategoryAppearance: "Mwonekano", settingsCategoryData: "Data" },
};


const profileSectionMessages: Partial<Record<NexoraLanguage, Record<string, string>>> = {
  "pt-BR": { highlightsTitle: "Seus destaques", highlightsSubtitle: "coleções do seu universo", notesTitle: "Notas Nexora", noteNow: "Sua nota de agora", editProfile: "Editar perfil", videoInterests: "Seus interesses em vídeos", videoInterestPrompt: "O que você gosta de assistir?" },
  "en-US": { highlightsTitle: "Your highlights", highlightsSubtitle: "collections from your world", notesTitle: "Nexora Notes", noteNow: "Your current note", editProfile: "Edit profile", videoInterests: "Your video interests", videoInterestPrompt: "What do you like to watch?" },
  es: { highlightsTitle: "Tus destacados", highlightsSubtitle: "colecciones de tu mundo", notesTitle: "Notas Nexora", noteNow: "Tu nota actual", editProfile: "Editar perfil", videoInterests: "Tus intereses en videos", videoInterestPrompt: "¿Qué te gusta ver?" },
  fr: { highlightsTitle: "À la une", highlightsSubtitle: "collections de votre univers", notesTitle: "Notes Nexora", noteNow: "Votre note actuelle", editProfile: "Modifier le profil", videoInterests: "Vos centres d’intérêt vidéo", videoInterestPrompt: "Qu’aimez-vous regarder ?" },
  de: { highlightsTitle: "Deine Highlights", highlightsSubtitle: "Sammlungen aus deiner Welt", notesTitle: "Nexora-Notizen", noteNow: "Deine aktuelle Notiz", editProfile: "Profil bearbeiten", videoInterests: "Deine Videointeressen", videoInterestPrompt: "Was schaust du gerne?" },
  it: { highlightsTitle: "I tuoi momenti in evidenza", highlightsSubtitle: "raccolte del tuo mondo", notesTitle: "Note Nexora", noteNow: "La tua nota attuale", editProfile: "Modifica profilo", videoInterests: "I tuoi interessi video", videoInterestPrompt: "Cosa ti piace guardare?" },
  nl: { highlightsTitle: "Je hoogtepunten", highlightsSubtitle: "collecties uit jouw wereld", notesTitle: "Nexora-notities", noteNow: "Je huidige notitie", editProfile: "Profiel bewerken", videoInterests: "Je video-interesses", videoInterestPrompt: "Wat kijk je graag?" },
  pl: { highlightsTitle: "Wyróżnione", highlightsSubtitle: "kolekcje z Twojego świata", notesTitle: "Notatki Nexora", noteNow: "Twoja aktualna notatka", editProfile: "Edytuj profil", videoInterests: "Twoje zainteresowania wideo", videoInterestPrompt: "Co lubisz oglądać?" },
  uk: { highlightsTitle: "Ваші добірки", highlightsSubtitle: "колекції вашого світу", notesTitle: "Нотатки Nexora", noteNow: "Ваша поточна нотатка", editProfile: "Редагувати профіль", videoInterests: "Ваші відеоінтереси", videoInterestPrompt: "Що вам подобається дивитися?" },
  sv: { highlightsTitle: "Dina höjdpunkter", highlightsSubtitle: "samlingar från din värld", notesTitle: "Nexora-anteckningar", noteNow: "Din aktuella anteckning", editProfile: "Redigera profil", videoInterests: "Dina videointressen", videoInterestPrompt: "Vad tycker du om att titta på?" },
  sw: { highlightsTitle: "Vivutio vyako", highlightsSubtitle: "makusanyo kutoka ulimwengu wako", notesTitle: "Dokezo za Nexora", noteNow: "Dokezo lako la sasa", editProfile: "Hariri wasifu", videoInterests: "Mambo unayopenda kwenye video", videoInterestPrompt: "Unapenda kutazama nini?" },
};

export function translate(language: NexoraLanguage, key: string): string {
  return messages[language]?.[key] ?? extraMessages[language]?.[key] ?? profileMessages[language]?.[key] ?? settingsMessages[language]?.[key] ?? settingsCategoryMessages[language]?.[key] ?? profileUiMessages[language]?.[key] ?? profileSectionMessages[language]?.[key] ?? profileSectionMessages[DEFAULT_LANGUAGE][key] ?? messages[DEFAULT_LANGUAGE][key] ?? extraMessages[DEFAULT_LANGUAGE]?.[key] ?? profileMessages[DEFAULT_LANGUAGE]?.[key] ?? settingsMessages[DEFAULT_LANGUAGE]?.[key] ?? settingsCategoryMessages[DEFAULT_LANGUAGE]?.[key] ?? key;
}
