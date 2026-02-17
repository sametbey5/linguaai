
import { Capacitor } from '@capacitor/core';
// Note: You must run `npm install @capacitor-community/billing` for this to work on a device
import { GoogleBilling } from '@capacitor-community/billing';

// --- SHARED TYPES ---
export interface PurchasesPackage {
    identifier: string;
    product: {
        priceString: string;
        title: string;
        description: string;
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
        if (Capacitor.isNativePlatform()) {
            try {
                // 1. Connect to the Google Play Billing Bridge
                await GoogleBilling.closeConnection(); // Safety reset
                await GoogleBilling.connect();
                console.log('IAP: Connected to Google Play Billing');
            } catch (err) {
                console.error('IAP: Connection Failed', err);
            }
        } else {
            console.log("IAP: Running in Web Mode (Simulating Google Play)");
        }
    },

    /**
     * Get available packages (products) to display in UI
     */
    async getPackages(): Promise<PurchasesPackage[]> {
        if (Capacitor.isNativePlatform()) {
            try {
                // 2. Query specific product details from the store
                const response = await GoogleBilling.querySkuDetails({
                    skuType: 'subs', // 'subs' for subscriptions, 'inapp' for one-time
                    skus: [GOOGLE_PLAY_PRODUCT_ID]
                });

                if (response.value && response.value.length > 0) {
                    return response.value.map((sku: any) => ({
                        identifier: sku.sku,
                        product: {
                            priceString: sku.price,
                            title: sku.title.replace(/\s*\(.*?\)\s*/g, ''), // Clean up "(App Name)" from title
                            description: sku.description
                        },
                        rawPackage: sku
                    }));
                }
            } catch (err) {
                console.error('IAP: Failed to load products', err);
            }
            return [];
        } else {
            // WEB SIMULATION (For testing UI without a device)
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
        }
    },

    /**
     * Purchase a specific package
     */
    async purchasePackage(pkg: PurchasesPackage): Promise<boolean> {
        try {
            if (Capacitor.isNativePlatform()) {
                // 3. Launch the native bottom sheet
                const response = await GoogleBilling.launchBillingFlow({
                    sku: pkg.identifier,
                    skuType: 'subs'
                });

                // 4. Checking the local result (In production, validate token with backend!)
                // GoogleBilling returns the purchase object if successful
                if (response) {
                    console.log('IAP: Purchase Successful', response);
                    return true;
                }
            } else {
                // WEB SIMULATION
                const confirmed = window.confirm(
                    `Google Play Billing (Test)\n\nItem: ${pkg.product.title}\nPrice: ${pkg.product.priceString}\n\nConfirm purchase?`
                );
                if (confirmed) {
                    await new Promise(resolve => setTimeout(resolve, 1500)); 
                    return true;
                }
            }
        } catch (error: any) {
            console.error("IAP Purchase Error:", error);
        }
        return false;
    },

    /**
     * Check if user currently has premium access
     */
    async checkSubscriptionStatus(): Promise<boolean> {
        if (Capacitor.isNativePlatform()) {
            try {
                // Check if the user has purchased this product before
                const purchases = await GoogleBilling.getPurchases({ skuType: 'subs' });
                const hasActiveSub = purchases.value.some((p: any) => p.sku === GOOGLE_PLAY_PRODUCT_ID && p.isAcknowledged);
                return hasActiveSub;
            } catch (err) {
                return false;
            }
        }
        return false; // Web default
    },

    /**
     * Restore Purchases
     */
    async restorePurchases(): Promise<boolean> {
        if (Capacitor.isNativePlatform()) {
            return this.checkSubscriptionStatus();
        } else {
            // Web Simulation
            console.log("IAP: Restoring purchases...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            return true; 
        }
    }
};
