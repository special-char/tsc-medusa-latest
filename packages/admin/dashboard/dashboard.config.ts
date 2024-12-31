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
    blogs: true,
    faqs: true,
    giftCards: true,
    giftTemplates: true,
    notifications: true,
    digitalProducts: true,
    subscriptions: true,
    // marketplace
    // restock
  },
}

export default dashboardConfig
