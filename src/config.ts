const configuredProductUrl = import.meta.env.VITE_PRODUCT_URL || 'https://zelify.vercel.app'

export const PRODUCT_URL = configuredProductUrl.replace(/\/$/, '')
