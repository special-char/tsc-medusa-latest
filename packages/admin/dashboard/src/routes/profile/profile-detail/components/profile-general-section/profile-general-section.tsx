import { PencilSquare } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"
import { languages } from "../../../../../i18n/languages"

type ProfileGeneralSectionProps = {
  user: HttpTypes.AdminUser
}

export const ProfileGeneralSection = ({ user }: ProfileGeneralSectionProps) => {
  const { i18n, t } = useTranslation()
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
  const isVendor = !!user.vendor_id

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>{t("profile.domain")}</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            {t("profile.manageYourProfileDetails")}
          </Text>
        </div>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("actions.edit"),
                  to: "edit",
                  icon: <PencilSquare />,
                },
              ],
            },
          ]}
        />
      </div>
      <div className="text-ui-fg-subtle grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.name")}
        </Text>
        <Text size="small" leading="compact">
          {name || "-"}
        </Text>
      </div>
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("fields.email")}
        </Text>
        <Text size="small" leading="compact">
          {user.email}
        </Text>
      </div>
      {isVendor && user.vendor && (
        <>
          <div className="grid grid-cols-2 items-center px-6 py-4">
            <Text size="small" leading="compact" weight="plus">
              {"Company Name"}
            </Text>
            <Text size="small" leading="compact">
              {user.vendor.vendor.name}
            </Text>
          </div>
          <div className="grid grid-cols-2 items-center px-6 py-4">
            <Text size="small" leading="compact" weight="plus">
              {"category"}
            </Text>
            <Text size="small" leading="compact">
              {user.vendor.vendor.category}
            </Text>
          </div>
          <div className="grid grid-cols-2 items-center px-6 py-4">
            <Text size="small" leading="compact" weight="plus">
              {"commission"}
            </Text>
            <Text size="small" leading="compact">
              {user.vendor.vendor.commission}%
            </Text>
          </div>
          <div className="grid grid-cols-2 items-center px-6 py-4">
            <Text size="small" leading="compact" weight="plus">
              {"location"}
            </Text>
            <Text size="small" leading="compact">
              {[
                user.vendor.vendor.address,
                user.vendor.vendor.city,
                user.vendor.vendor.state,
                user.vendor.vendor.country,
                user.vendor.vendor.postal_code,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </div>
          {user.vendor.vendor.logo && (
            <div className="grid grid-cols-2 items-center px-6 py-4">
              <Text size="small" leading="compact" weight="plus">
                {"logo"}
              </Text>
              <div className="h-12 w-12 overflow-hidden rounded-md">
                <img
                  src={user.vendor.vendor.logo}
                  alt={`${user.vendor.vendor.name} logo`}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          {user.vendor.vendor.description && (
            <div className="grid grid-cols-2 items-center px-6 py-4">
              <Text size="small" leading="compact" weight="plus">
                {"description"}
              </Text>
              <Text size="small" leading="compact">
                {user.vendor.vendor.description}
              </Text>
            </div>
          )}
          {user.vendor.region && (
            <div className="grid grid-cols-2 items-center px-6 py-4">
              <Text size="small" leading="compact" weight="plus">
                {"Region"}
              </Text>
              <Text size="small" leading="compact">
                {user.vendor.region
                  .map((e) => e.region_details.name)
                  .join(", ")}
              </Text>
            </div>
          )}
        </>
      )}
      <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("profile.fields.languageLabel")}
        </Text>
        <Text size="small" leading="compact">
          {languages.find((lang) => lang.code === i18n.language)
            ?.display_name || "-"}
        </Text>
      </div>
      {/* TODO: Do we want to implement usage insights in V2? */}
      {/* <div className="grid grid-cols-2 items-center px-6 py-4">
        <Text size="small" leading="compact" weight="plus">
          {t("profile.fields.usageInsightsLabel")}
        </Text>
        <StatusBadge color="red" className="w-fit">
          {t("general.disabled")}
        </StatusBadge>
      </div> */}
      {/* // Vendor detail page 
      //category, */}
      {/* address,
		postal_code,
		city,
		country,
		state,
		commission,
		description, */}
    </Container>
  )
}
