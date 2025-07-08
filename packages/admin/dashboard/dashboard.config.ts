type ConfigType = {
  featureFlags: {
    categorySeo?: boolean
    productSeo?: boolean
    productVariantImages?: boolean
    productAdditionalDetails?: boolean
    productCategoryDetails?: boolean
    wishlist?: boolean
    brand?: boolean
    blogs?: boolean
    faqs?: boolean
    giftCards?: boolean
    giftTemplates?: boolean
    notifications?: boolean
    digitalProducts?: boolean
    subscriptions?: boolean
    marketplace?: boolean
    restock?: boolean
    bulkBuy?: boolean
    zipcode?: boolean
    redemption?: boolean
    vendors?: boolean
    productOptionImages?: boolean
    feraReview?: Boolean
  }
}

const dashboardConfig: ConfigType = {
  featureFlags: {
    productSeo: true,
    categorySeo: true,
    productVariantImages: true,
    productAdditionalDetails: true,
    productCategoryDetails: true,
    wishlist: false,
    brand: false,
    blogs: false,
    faqs: false,
    giftCards: false,
    giftTemplates: false,
    notifications: false,
    digitalProducts: false,
    subscriptions: false,
    bulkBuy: false,
    zipcode: true,
    redemption: false,
    vendors: false,
    productOptionImages: true,
    feraReview: true,
    // marketplace
    // restock
  },
}

export default dashboardConfig
