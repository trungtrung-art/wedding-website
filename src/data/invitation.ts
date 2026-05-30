// CMS CONTRACT — when the CMS lands, replace this file with:
//   export async function getInvitation(): Promise<Invitation> { /* fetch */ }
// The exported `Invitation` type stays identical; components consume it unchanged.

export type Invitation = {
  couple: {
    groom: { name: string };
    bride: { name: string };
    initials: string;
  };
  ceremony: {
    solarDate: string; // ISO "2027-05-22"
    lunarDate: string; // "Thứ bảy, 02/04 Âm lịch"
    time: string;      // "12:00"
    venue: { name: string; address: string; mapUrl: string };
  };
  rsvp: { deadline: string };
  photos: {
    hero: string;
    portrait: string;
    groomPortrait: string;
    bridePortrait: string;
    gallery: string[];
  };
};

export const invitation: Invitation = {
  couple: {
    groom: { name: "Thiện Trung" },
    bride: { name: "Quỳnh Trang" },
    initials: "T&Q",
  },
  ceremony: {
    solarDate: "2027-05-22",
    lunarDate: "Thứ bảy, 02/04 Âm lịch năm Đinh Mùi",
    time: "12:00",
    venue: {
      name: "Trung tâm tiệc cưới Cinelove",
      address: "123 Đường Hoa Hồng, Quận 1, TP. Hồ Chí Minh",
      mapUrl: "https://maps.google.com/?q=Cinelove+wedding",
    },
  },
  rsvp: { deadline: "2027-05-01" },
  // Placeholder SVGs ship with the repo so every image slot is visible during
  // layout/design work. Swap each URL for a real photo when ready (the future
  // CMS will fill these in per invitation).
  photos: {
    hero: "/wedding-assets/placeholder-hero.svg",
    portrait: "/wedding-assets/placeholder-portrait.svg",
    groomPortrait: "/wedding-assets/placeholder-groom.svg",
    bridePortrait: "/wedding-assets/placeholder-bride.svg",
    gallery: [
      "/wedding-assets/placeholder-gallery-1.svg",
      "/wedding-assets/placeholder-gallery-2.svg",
      "/wedding-assets/placeholder-gallery-3.svg",
    ],
  },
};
