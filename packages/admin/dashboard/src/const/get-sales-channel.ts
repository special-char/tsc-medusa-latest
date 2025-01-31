import { decodeToken } from "react-jwt"

export const getSalesChannelIds = (): string[] => {
    const storageKey = "medusa_auth_token"
    const token = window.localStorage.getItem(storageKey)
    const decodedData: any = decodeToken(token as string)
    if (decodedData.role == "vendor") {
        const salesChannelIds = decodedData?.app_metadata?.sales_channels
            ?.filter((channel: any) => channel.id)
            .map((channel: any) => channel.id)
        return salesChannelIds.length == 0 ? [""] : salesChannelIds
    }
    return []
}

export const isVendor = (): boolean => {
    const storageKey = "medusa_auth_token"
    const token = window.localStorage.getItem(storageKey)
    const decodedData: any = decodeToken(token as string)
    return decodedData.role == "vendor" ? true : false
}

export const getVendorId = (): string => {
    const storageKey = "medusa_auth_token"
    const token = window.localStorage.getItem(storageKey)
    const decodedData: any = decodeToken(token as string)
    return decodedData.app_metadata.vendor_id
}
