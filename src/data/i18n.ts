// CMS CONTRACT — the CMS will provide dict.vi and dict.en with matching keys.
// Section components consume keys via useT() from src/lib/i18n-context.tsx.

export type Locale = "vi" | "en";
export type Dict = Record<string, string>;

export const dict: Record<Locale, Dict> = {
  vi: {
    "site.title": "Thiệp cưới của Thiện Trung & Quỳnh Trang",
    "toggle.language": "EN",

    "hero.kicker": "Em là cả thế giới của anh",
    "hero.tagline": "Bấm vào phong thư để mở thiệp",
    "hero.scrollHint": "Cuộn xuống để xem chi tiết",
    "hero.openedHint": "Cuộn xuống để xem chi tiết",
    "hero.saveTheDateLine1": "Save",
    "hero.saveTheDateLine2": "Date",

    "dateBanner.title": "2027.05.22",
    "dateBanner.tagline": "Đã lâu rồi, hẹn gặp ở đám cưới nhé!",

    "names.groomLabel": "CHÚ RỂ",
    "names.brideLabel": "CÔ DÂU",
    "names.groomParents": "Con trai ông bà Nguyễn Văn A và bà Trần Thị B",
    "names.brideParents": "Con gái ông bà Lê Văn C và bà Phạm Thị D",

    "invitationTitle.main": "THIỆP MỜI CƯỚI CỦA CHÚNG MÌNH",
    "invitationTitle.stack1": "LOVE",
    "invitationTitle.stack2": "WEDDING",
    "invitationTitle.stack3": "FALL IN",

    "welcome.body": "Chúng tôi xin trân trọng kính mời quý vị tới dự buổi lễ thành hôn của chúng tôi. Sự hiện diện của quý vị sẽ là niềm vinh hạnh và là kỷ niệm khó quên trong ngày trọng đại của hai chúng tôi.",

    "gratitudeEn.body": "Thank you, family and friends, for being part of our journey. Your love and support mean the world to us.",

    "poetry1.vi": "Anh đi tìm em qua bao mùa hoa nở\nMà chẳng hay em đã ở trong tim",
    "poetry1.en": "I searched for you through countless blooming seasons,\nnot knowing you were already in my heart.",

    "quoteThreeThings.vi": "Em yêu ba điều trên thế giới này\nMặt trời, mặt trăng và em.",
    "quoteThreeThings.en": "I love three things in this world.\nSun, moon and you.",

    "countdown.eyebrow": "the",
    "countdown.title": "Countdown",
    "countdown.subtitle": "đến ngày trọng đại đã bắt đầu",
    "countdown.days": "ngày",
    "countdown.hours": "giờ",
    "countdown.minutes": "phút",
    "countdown.seconds": "giây",

    "sentiment1.body": "Em là điều đẹp đẽ nhất mà cuộc đời này đã trao cho anh. Cảm ơn vì em đã đến và đã ở lại.",

    "poetry2.verse1.vi": "Đời người chỉ một lần yêu thật\nVà anh đã chọn em.",
    "poetry2.verse1.en": "We only truly love once in a lifetime\n— and I have chosen you.",
    "poetry2.verse2.vi": "Cảm ơn em đã đến\nĐể anh có một mái nhà.",
    "poetry2.verse2.en": "Thank you for arriving — for giving me a home.",

    "dateDetails.dayOfWeek": "Thứ bảy",
    "dateDetails.solar": "22/05/2027",
    "dateDetails.lunarPrefix": "Nhằm ngày",
    "dateDetails.timePrefix": "Vào lúc",

    "calendar.monthLabel": "Tháng 5 — May 2027",

    "closingSentiment.body": "Hãy cùng chúng tôi viết tiếp câu chuyện tình yêu — đẹp, giản dị, và mãi mãi.",

    "venue.eyebrow": "Địa điểm tổ chức",
    "venue.mapCta": "Xem bản đồ",

    "rsvp.title": "Xác nhận tham dự",
    "rsvp.deadline": "Vui lòng phản hồi trước ngày",
    "rsvp.intro": "Sự có mặt của quý vị là niềm vinh hạnh lớn nhất của chúng tôi. Xin vui lòng xác nhận tham dự qua mẫu sau.",
    "rsvp.nameLabel": "Họ và tên",
    "rsvp.namePlaceholder": "Nhập họ và tên của bạn",
    "rsvp.messageLabel": "Lời chúc",
    "rsvp.messagePlaceholder": "Để lại lời chúc cho cô dâu chú rể",
    "rsvp.submit": "Gửi xác nhận",
    "rsvp.success": "Cảm ơn bạn đã gửi lời chúc!",

    "guestInteraction.title": "Sổ lưu bút",
    "guestInteraction.heartsCta": "Bắn tim",
    "guestInteraction.heartsCount": "lượt yêu thương",

    "thankYou.eyebrow": "Cảm ơn",
    "thankYou.body": "Thank you",
    "thankYou.follow": "Thiệp mời chính thức sẽ được gửi sau.",
  },

  en: {
    "site.title": "Thiện Trung & Quỳnh Trang — Wedding Invitation",
    "toggle.language": "VI",

    "hero.kicker": "You are the love of my life",
    "hero.tagline": "Click the envelope to open",
    "hero.scrollHint": "Scroll for details",
    "hero.openedHint": "Scroll for details",
    "hero.saveTheDateLine1": "Save",
    "hero.saveTheDateLine2": "Date",

    "dateBanner.title": "2027.05.22",
    "dateBanner.tagline": "It's been a long time, see you at the wedding!",

    "names.groomLabel": "GROOM",
    "names.brideLabel": "BRIDE",
    "names.groomParents": "Son of Mr. & Mrs. Nguyễn Văn A",
    "names.brideParents": "Daughter of Mr. & Mrs. Lê Văn C",

    "invitationTitle.main": "OUR WEDDING INVITATION",
    "invitationTitle.stack1": "LOVE",
    "invitationTitle.stack2": "WEDDING",
    "invitationTitle.stack3": "FALL IN",

    "welcome.body": "We cordially invite you to share in the joy of our wedding day. Your presence would mean the world to us.",

    "gratitudeEn.body": "Thank you, family and friends, for being part of our journey. Your love and support mean the world to us.",

    "poetry1.vi": "Anh đi tìm em qua bao mùa hoa nở\nMà chẳng hay em đã ở trong tim",
    "poetry1.en": "I searched for you through countless blooming seasons,\nnot knowing you were already in my heart.",

    "quoteThreeThings.vi": "Em yêu ba điều trên thế giới này\nMặt trời, mặt trăng và em.",
    "quoteThreeThings.en": "I love three things in this world.\nSun, moon and you.",

    "countdown.eyebrow": "the",
    "countdown.title": "Countdown",
    "countdown.subtitle": "to forever has begun",
    "countdown.days": "days",
    "countdown.hours": "hours",
    "countdown.minutes": "minutes",
    "countdown.seconds": "seconds",

    "sentiment1.body": "You are the most beautiful thing this life has ever given me. Thank you for arriving — and for staying.",

    "poetry2.verse1.vi": "Đời người chỉ một lần yêu thật\nVà anh đã chọn em.",
    "poetry2.verse1.en": "We only truly love once in a lifetime\n— and I have chosen you.",
    "poetry2.verse2.vi": "Cảm ơn em đã đến\nĐể anh có một mái nhà.",
    "poetry2.verse2.en": "Thank you for arriving — for giving me a home.",

    "dateDetails.dayOfWeek": "Saturday",
    "dateDetails.solar": "May 22, 2027",
    "dateDetails.lunarPrefix": "Lunar:",
    "dateDetails.timePrefix": "At",

    "calendar.monthLabel": "May 2027",

    "closingSentiment.body": "Come write the next chapter of our love story with us — simply, beautifully, forever.",

    "venue.eyebrow": "Venue",
    "venue.mapCta": "View on map",

    "rsvp.title": "RSVP",
    "rsvp.deadline": "Please reply by",
    "rsvp.intro": "Your presence would mean the world to us. Please confirm your attendance by completing the form.",
    "rsvp.nameLabel": "Your name",
    "rsvp.namePlaceholder": "Enter your name",
    "rsvp.messageLabel": "Message",
    "rsvp.messagePlaceholder": "Leave a note for the couple",
    "rsvp.submit": "Send RSVP",
    "rsvp.success": "Thank you for your message!",

    "guestInteraction.title": "Guest book",
    "guestInteraction.heartsCta": "Send hearts",
    "guestInteraction.heartsCount": "hearts sent",

    "thankYou.eyebrow": "Thank you",
    "thankYou.body": "Cảm ơn",
    "thankYou.follow": "Formal invitation to follow.",
  },
};
