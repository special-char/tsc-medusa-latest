const separator = "+"

// Function to create a layered email
export const toLayeredEmail = (
    email: string,
    salesChannelId: string
): string => {
    if (!isValidEmail(email)) {
        throw new Error("Invalid email format")
    }
    return `${salesChannelId}${separator}${email}`
}

// Function to extract the original email and sales_channel_id from a layered email
export const fromLayeredEmail = (
    layeredEmail: string
): { email: string; salesChannelId: string } => {
    const [salesChannelId, email] = layeredEmail.split(separator)
    if (!isValidEmail(email)) {
        return { email, salesChannelId: "" }
    }
    return { email, salesChannelId }
}

// Utility function to validate an email
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}
