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
  }
}

const dashboardConfig: ConfigType = {
  featureFlags: {
    productSeo: true,
    categorySeo: false,
    productVariantImages: true,
    productAdditionalDetails: true,
    productCategoryDetails: true,
    wishlist: true,
    brand: true,
    blogs: true,
    faqs: true,
    giftCards: false,
    giftTemplates: false,
    notifications: true,
    digitalProducts: false,
    subscriptions: true,
    bulkBuy: false,
    zipcode: false,
    redemption: false,
    vendors: false,
    productOptionImages: true,
    // marketplace
    // restock
  },
}

export default dashboardConfig
