import { Outlet, RouteObject, UIMatch } from "react-router-dom"
import { ErrorBoundary } from "../../components/utilities/error-boundary"
import { t } from "i18next"
import { HttpTypes } from "@medusajs/types"
import dashboardConfig from "../../../dashboard.config"
import { lazy } from "react"

export const customProtectedRoutes: RouteObject[] = [
  ...(dashboardConfig?.featureFlags?.digitalProducts
    ? [
        {
          path: "/digital-products",
          errorElement: <ErrorBoundary />,
          handle: {
            breadcrumb: () => "Digital Products",
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/digital-products"),
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.giftCards
    ? [
        {
          path: "/gift-cards",
          errorElement: <ErrorBoundary />,
          handle: {
            breadcrumb: () => t("giftCards.domain"),
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/giftcards/giftcard-lists"),
              children: [
                {
                  path: "create",
                  lazy: () => import("../../routes/giftcards/giftcard-create"),
                },
              ],
            },
            {
              path: ":id",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/giftcards/giftcard-detail"),
              children: [
                {
                  children: [
                    {
                      path: "add-denomination",
                      lazy: () =>
                        import(
                          "../../routes/giftcards/giftcard-detail/common/component/AddDenominationModal"
                        ),
                    },
                    {
                      path: "prices",
                      lazy: () =>
                        import("../../routes/products/product-prices"),
                    },
                    {
                      path: "edit-denomination",
                      lazy: () =>
                        import(
                          "../../routes/giftcards/giftcard-detail/common/component/EditDenominationModal"
                        ),
                    },
                    {
                      path: "edit",
                      lazy: () => import("../../routes/products/product-edit"),
                    },
                    {
                      path: "sales-channels",
                      lazy: () =>
                        import("../../routes/products/product-sales-channels"),
                    },
                    {
                      path: "media",
                      lazy: () => import("../../routes/products/product-media"),
                    },
                    {
                      path: "metadata/edit",
                      lazy: () =>
                        import("../../routes/products/product-metadata"),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.bulkBuy
    ? [
        {
          path: "/bulk-buy",
          errorElement: <ErrorBoundary />,
          handle: {
            breadcrumb: () => t("categories.domain"),
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/giftcards/bulk-buy"),
              children: [
                {
                  path: "import",
                  lazy: () => import("../../routes/giftcards/giftcard-import"),
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.giftTemplates
    ? [
        {
          path: "/gift-templates",
          errorElement: <ErrorBoundary />,
          children: [
            {
              path: "",
              lazy: () =>
                import("../../routes/gift-templates/gift-templates-list"),
              children: [
                {
                  path: "create",
                  lazy: () =>
                    import("../../routes/gift-templates/gift-templates-create"),
                },
                {
                  path: "edit",
                  lazy: () =>
                    import("../../routes/gift-templates/gift-templates-edit"),
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.redemption
    ? [
        {
          path: "/redemption",
          errorElement: <ErrorBoundary />,
          children: [
            {
              path: "",
              lazy: () => import("../../routes/redemption/redemption-detail"),
              // children: [
              //   {
              //     path: "detail",
              //     lazy: () =>
              //       import("../../routes/redemption/redemption-detail"),
              //   },
              // ],
            },
            {
              path: ":id",
              lazy: () => import("../../routes/redemption/redemption-detail"),
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.vendors
    ? [
        {
          path: "/vendors",
          errorElement: <ErrorBoundary />,
          children: [
            {
              path: "",
              lazy: () => import("../../routes/vendors/vendor-list"),
              children: [
                {
                  path: "create",
                  lazy: () => import("../../routes/vendors/vendor-create"),
                },
              ],
            },
            {
              path: ":id",
              lazy: () => import("../../routes/redemption/redemption-detail"),
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.notifications
    ? [
        {
          path: "/notification",
          errorElement: <ErrorBoundary />,
          handle: {
            breadcrumb: () => t("notification.domain"),
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/notification/notification-list"),
              children: [
                {
                  path: "create",
                  lazy: () =>
                    import("../../routes/notification/notification-create"),
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.blogs
    ? [
        {
          path: "/blogs",
          errorElement: <ErrorBoundary />,
          handle: {
            breadcrumb: () => "Blogs",
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/blogs/blog-list"),
              children: [
                {
                  path: "create",
                  lazy: () => import("../../routes/blogs/blog-create"),
                },
              ],
            },
            {
              path: ":id",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/blogs/blog-edit"),
              children: [
                {
                  children: [
                    {
                      path: "blog-edit",
                      lazy: () => import("../../routes/blogs/blog-edit"),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.faqs
    ? [
        {
          path: "/faqs",
          errorElement: <ErrorBoundary />,
          handle: {
            breadcrumb: () => "Faqs",
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/faqs/faq-list"),
              children: [
                {
                  path: "create",
                  lazy: () => import("../../routes/faqs/faq-create"),
                },
              ],
            },
            {
              path: ":id",
              errorElement: <ErrorBoundary />,
              lazy: () => import("../../routes/faqs/faq-edit"),
              children: [
                {
                  children: [
                    {
                      path: "faq-edit",
                      lazy: () => import("../../routes/faqs/faq-edit"),
                    },
                  ],
                },
              ],
            },
          ],
        },
      ]
    : []),
]

export const customPublicRoutes: RouteObject[] = []

export const customProtectedSettingsRoutes: RouteObject[] = [
  ...(dashboardConfig?.featureFlags?.brand
    ? [
        {
          path: "brand",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => "Brand",
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/brand/brand-list"),
              children: [
                {
                  path: "create",
                  lazy: () => import("../../routes/brand/brand-create"),
                },
              ],
            },
            {
              path: ":id",
              lazy: async () => {
                const { Component, Breadcrumb, loader } = await import(
                  "../../routes/brand/brand-detail"
                )

                return {
                  Component,
                  loader,
                  handle: {
                    breadcrumb: (
                      match: UIMatch<HttpTypes.AdminProductTypeResponse>
                    ) => <Breadcrumb {...match} />,
                  },
                }
              },
              children: [
                {
                  path: "edit",
                  lazy: () => import("../../routes/brand/brand-edit"),
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.subscriptions
    ? [
        {
          path: "subscription",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => "Subscription",
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/subscription/subscription-list"),
            },
            {
              path: ":id",
              lazy: async () => {
                const { Component } = await import(
                  "../../routes/subscription/subscription-detail"
                )

                return {
                  Component,
                }
              },
              // ! Need to verify this route
              children: [
                {
                  path: "edit",
                  lazy: () => import("../../routes/brand/brand-edit"),
                },
              ],
            },
          ],
        },
      ]
    : []),
  ...(dashboardConfig?.featureFlags?.zipcode
    ? [
        {
          path: "zipcode",
          errorElement: <ErrorBoundary />,
          element: <Outlet />,
          handle: {
            breadcrumb: () => "Zipcode",
          },
          children: [
            {
              path: "",
              lazy: () => import("../../routes/custom/zipcode/zipcode-list"),
            },
          ],
        },
      ]
    : []),
]
