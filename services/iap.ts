
import { Capacitor } from '@capacitor/core';

// --- SHARED TYPES ---
export interface PurchasesPackage {
    identifier: string;
    product: {
        priceString: string;
        title: string;
        description: string;
        currencyCode?: string;
    };
    rawPackage?: any; 
}

// MUST match the Product ID created in Google Play Console -> Monetize -> Subscriptions
const GOOGLE_PLAY_PRODUCT_ID = 'linguist_ai_premium_monthly';

export const IAP = {
    /**
     * Initialize Payment Service
     */
    async initialize(userId?: string) {
        console.log("IAP: Initializing Service...");
        // Native billing import removed for Netlify web deployment compatibility.
        // In a real Capacitor project, uncomment the import and logic below.
        if (Capacitor.isNativePlatform()) {
             console.log("IAP: Native platform detected, but billing plugin disabled for web build.");
        }
    },

    /**
     * Get available packages (products) to display in UI
     */
    async getPackages(): Promise<PurchasesPackage[]> {
        // WEB SIMULATION (Default for this demo)
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            {
                identifier: GOOGLE_PLAY_PRODUCT_ID,
                product: {
                    priceString: '$9.99',
                    title: 'Super Pass (Monthly)',
                    description: 'Unlock all characters & features.'
                }
            }
        ];
    },

    /**
     * Purchase a specific package
     */
    async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
        // WEB SIMULATION
        const confirmed = window.confirm(
            `Google Play Billing (Test)\n\nItem: ${pkg.product.title}\nPrice: ${pkg.product.priceString}\n\nConfirm purchase?`
        );
        if (confirmed) {
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            return true;
        }
        return false;
    },

    /**
     * Check if user currently has premium access
     */
    async checkSubscriptionStatus(): Promise<boolean> {
        return false; // Web default
    },

    /**
     * Restore Purchases
     */
    async restorePurchases(): Promise<boolean> {
        // Web Simulation
        console.log("IAP: Restoring purchases...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true; 
    }
};
