type ConfigType = {
  featureFlags: {
    banner?: boolean
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
    productHighlights?: boolean
    createOrder?: boolean
  }
}

const dashboardConfig: ConfigType = {
  featureFlags: {
    banner: true,
    productSeo: true,
    categorySeo: true,
    productVariantImages: true,
    productAdditionalDetails: true,
    productCategoryDetails: true,
    wishlist: true,
    brand: true,
    blogs: true,
    faqs: false,
    giftCards: true,
    giftTemplates: true,
    notifications: true,
    digitalProducts: true,
    subscriptions: true,
    bulkBuy: true,
    zipcode: false,
    redemption: true,
    vendors: true,
    productOptionImages: true,
    productHighlights: true,
    createOrder: true,
    // marketplace
    // restock
  },
}

export default dashboardConfig
