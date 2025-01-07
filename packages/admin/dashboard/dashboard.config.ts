type ConfigType = {
  featureFlags: {
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
  }
}

const dashboardConfig: ConfigType = {
  featureFlags: {
    productSeo: true,
    productVariantImages: true,
    productAdditionalDetails: true,
    productCategoryDetails: true,
    wishlist: true,
    brand: true,
    blogs: false,
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
    // marketplace
    // restock
  },
}

export default dashboardConfig
