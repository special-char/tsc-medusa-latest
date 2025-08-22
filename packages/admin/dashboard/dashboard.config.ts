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
    variantWarrantySection?: boolean
    invoiceConfig?: boolean
  }
}

const dashboardConfig: ConfigType = {
  featureFlags: {
    invoiceConfig: true,
    banner: true,
    productSeo: true,
    categorySeo: true,
    productVariantImages: true,
    productAdditionalDetails: true,
    productCategoryDetails: true,
    wishlist: true,
    brand: true,
    blogs: false,
    faqs: false,
    giftCards: false,
    giftTemplates: false,
    notifications: false,
    digitalProducts: false,
    subscriptions: false,
    bulkBuy: false,
    zipcode: false,
    redemption: false,
    vendors: false,
    productOptionImages: true,
    productHighlights: true,
    createOrder: true,
    variantWarrantySection: true,
    // marketplace
    // restock
  },
}

export default dashboardConfig
