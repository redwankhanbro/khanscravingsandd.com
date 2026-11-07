/**
 * 👑 KHAN'S CRAVINGS - SYSTEM ENGINE & STORAGE CORE
 * Fixed key allocation array to align directly with homepage buttons
 */
(() => {
    "use strict";

    // 🌟 MUST MATCH YOUR HOMEPAGE STORAGE KEY EXACTLY!
    const STORE_KEY = "khans_cart_vault"; 
    const DRAFT_KEY = "khan_checkout_draft";


    // ---------- 🛡️ SAFE STORAGE PARSING UTILITIES ----------
    const safeParse = (raw, fallback = {}) => {
        try {
            const parsed = JSON.parse(raw || "{}");
            return (parsed && typeof parsed === "object" && !Array.isArray(parsed)) ? parsed : fallback;
        } catch {
            return fallback;
        }
    };

    const save = (data) => {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error("[KhanEngine] Failed to write to localStorage:", e);
            return false;
        }
    };

    // ---------- 🎛️ PUBLIC MAIN CORE OPERATIONS ----------
    window.KhanEngine = {

        /** Returns the full cart database object state */
        getCart() {
            return safeParse(localStorage.getItem(STORE_KEY));
        },

        /** Returns how many unique items reside inside the database ledger rows */
        getDatabaseSize() {
            const cart = this.getCart();
            const count = Object.keys(cart).length;
            console.log(`📊 [DATABASE STATUS]: Active items = ${count}`);
            return cart;
        },

        /** Fetch a single item block by its unique ID */
        getItem(id) {
            return this.getCart()[id] || null;
        },

        /** Inserts a food selection item or cleanly increments quantity loops */
        insertItem(id, name, price, qty = 1) {
            if (!id || !name) {
                console.warn("[KhanEngine] insertItem requires valid id and name params");
                return false;
            }

            const cart = this.getCart();
            const quantity = Math.max(1, parseInt(qty, 10) || 1);
            const unitPrice = parseFloat(price) || 0;

            if (cart[id]) {
                cart[id].quantity += quantity;
            } else {
                cart[id] = {
                    id: id,
                    name: String(name),
                    price: unitPrice,
                    quantity: quantity
                };
            }

            const success = save(cart);
            if (success) {
                console.log(`✅ [INSERT SUCCESS]: ${name} (ID: ${id}) updated in local storage grid.`);
            }
            return success;
        },

        /** Modifies the quantity matrix count. Setting qty to 0 invokes automatic row removal */
        updateQuantity(id, qty) {
            const cart = this.getCart();
            if (!cart[id]) return false;

            const newQty = parseInt(qty, 10);
            if (isNaN(newQty) || newQty <= 0) {
                return this.removeItem(id);
            }

            cart[id].quantity = newQty;
            return save(cart);
        },

        /** Removes a single item row from the database tracking canvas */
        removeItem(id) {
            const cart = this.getCart();
            if (!cart[id]) return false;

            delete cart[id];
            const success = save(cart);
            if (success) {
                console.log(`🗑️ [DELETE SUCCESS]: Item ID ${id} cleared from basket.`);
            }
            return success;
        },

        /** Wipes the local shopping cart register completely */
        clearCart() {
            localStorage.removeItem(STORE_KEY);
            console.log("🧹 Local cart register wiped clean.");
            return true;
        },

        /** Computes active total values, line-item quantities, and grand pricing structures */
        getTotals() {
            const cart = this.getCart();
            let itemCount = 0;
            let totalQuantity = 0;
            let totalPrice = 0;

            for (const item of Object.values(cart)) {
                itemCount += 1;
                totalQuantity += item.quantity;
                totalPrice += item.price * item.quantity;
            }

            return {
                itemCount,
                totalQuantity,
                totalPrice: Math.round(totalPrice * 100) / 100
            };
        },

        /** Structural deep cache cleanup (Mimics WordPress optimization plugins) */
        async clearSystemCache() {
            console.log("🔄 Starting deep cache purge pass...");
            const report = [];

            localStorage.removeItem(STORE_KEY);
            localStorage.removeItem(DRAFT_KEY);
            report.push("Local database + checkout draft: FLUSHED");

            if ("caches" in window) {
                try {
                    const names = await caches.keys();
                    await Promise.all(names.map(name => caches.delete(name)));
                    report.push(`Cache Storage pools (${names.length}): DELETED`);
                } catch (e) {
                    report.push("Cache Storage API: FAILED to clear");
                    console.warn(e);
                }
            }

            console.warn("💥 Cache clear complete:", report);
            return report;
        }
    };
})();
