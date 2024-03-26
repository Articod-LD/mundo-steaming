import { Settings } from "@/types";

export const settingsData: Settings = {
  id: "",
  options: {
    seo: {
      ogTitle: "",
      metaTags: "",
      metaTitle: "",
      canonicalUrl: "",
      ogDescription: "",
      twitterHandle: "",
      metaDescription: "",
      twitterCardType: "",
      ogImage: {
        id: "",
        original: "",
        thumbnail: "",
      },
    },
    logo: {
      id: "",
      original: "",
      thumbnail: "",
    },
    siteTitle: "Mundo Streaming",
    siteSubtitle: "",
    currency: "COP",
    useOtp: false,
    contactDetails: {
      contact: "",
      website: "",
      socials: [
        {
          icon: "",
          url: "",
        },
      ],
      location: {
        lat: 0,
        lng: 0,
        zip: "",
        city: "",
        country: "",
        state: "",
        formattedAddress: "",
      },
    },
  },
};
