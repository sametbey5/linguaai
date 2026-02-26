
import { Purchases, LogLevel, type Package as RCPackage, type CustomerInfo, type Offerings } from '@revenuecat/purchases-js';

// --- SHARED TYPES ---
export interface PurchasesPackage {
    identifier: string;
    product: {
        priceString: string;
        title: string;
        description: string;
        currencyCode?: string;
    };
    rawPackage?: RCPackage; 
}

const REVENUECAT_API_KEY = (import.meta.env.VITE_REVENUECAT_PUBLIC_KEY as string) || "";

// Helper to get the instance
const getPurchases = (): Purchases => {
    try {
        return Purchases.getSharedInstance();
    } catch (e) {
        throw new Error("RevenueCat not initialized. Call initialize() first.");
    }
};

export const IAP = {
    /**
     * Initialize Payment Service
     */
    async initialize(userId: string) {
        if (!REVENUECAT_API_KEY) {
            console.warn("IAP: RevenueCat API Key missing. Skipping initialization.");
            return;
        }

        try {
            console.log("IAP: Initializing RevenueCat...");
            // Set log level for debugging
            Purchases.setLogLevel(LogLevel.Debug);
            
            // Configure RevenueCat
            Purchases.configure({
                apiKey: REVENUECAT_API_KEY,
                appUserId: userId,
            });
        } catch (error) {
            console.error("IAP: Failed to initialize RevenueCat", error);
        }
    },

    /**
     * Get available packages (products) to display in UI
     */
    async getPackages(): Promise<PurchasesPackage[]> {
        if (!REVENUECAT_API_KEY) return [];

        try {
            const purchases = getPurchases();
            const offerings: Offerings = await purchases.getOfferings();
            if (offerings.current !== null && offerings.current.availablePackages.length !== 0) {
                return offerings.current.availablePackages.map(pkg => ({
                    identifier: pkg.identifier,
                    product: {
                        priceString: pkg.webBillingProduct.currentPrice.formattedPrice,
                        title: pkg.webBillingProduct.title,
                        description: pkg.webBillingProduct.description || "",
                        currencyCode: pkg.webBillingProduct.currentPrice.currency
                    },
                    rawPackage: pkg
                }));
            }
        } catch (error) {
            console.error("IAP: Error fetching offerings", error);
        }
        return [];
    },

    /**
     * Purchase a specific package
     */
    async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
        if (!pkg.rawPackage) return false;

        try {
            const purchases = getPurchases();
            const { customerInfo } = await purchases.purchasePackage(pkg.rawPackage);
            // Check if the "premium" entitlement is active
            return customerInfo.entitlements.active.hasOwnProperty("premium");
        } catch (error: any) {
            if (error.errorCode === 1) { // UserCancelledError
                console.log("IAP: User cancelled the purchase");
            } else {
                console.error("IAP: Purchase error", error);
            }
            return false;
        }
    },

    /**
     * Check if user currently has premium access
     */
    async checkSubscriptionStatus(): Promise<boolean> {
        try {
            const purchases = getPurchases();
            const customerInfo: CustomerInfo = await purchases.getCustomerInfo();
            return customerInfo.entitlements.active.hasOwnProperty("premium");
        } catch (error) {
            console.error("IAP: Error checking subscription status", error);
            return false;
        }
    },

    /**
     * Get detailed premium info
     */
    async getPremiumDetails() {
        try {
            const purchases = getPurchases();
            const customerInfo: CustomerInfo = await purchases.getCustomerInfo();
            const premium = customerInfo.entitlements.active["premium"];
            
            if (premium) {
                return {
                    expirationDate: premium.expirationDate ? premium.expirationDate.toISOString() : undefined,
                    willRenew: premium.willRenew,
                    productIdentifier: premium.productIdentifier
                };
            }
            return null;
        } catch (error) {
            console.error("IAP: Error getting premium details", error);
            return null;
        }
    },

    /**
     * Restore Purchases
     * On Web Billing, this is effectively checking the latest customer info.
     */
    async restorePurchases(): Promise<boolean> {
        try {
            console.log("IAP: Restoring purchases...");
            const purchases = getPurchases();
            const customerInfo: CustomerInfo = await purchases.getCustomerInfo();
            return customerInfo.entitlements.active.hasOwnProperty("premium");
        } catch (error) {
            console.error("IAP: Error restoring purchases", error);
            return false;
        }
    }
};
