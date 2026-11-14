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

 // ===================================================================
// 📱 KHAN'S UNIVERSAL MOBILE ENGINE (Auto-Initializes Mobile Topbar & Drawer)
// ===================================================================
(function initKhanUniversalMobile() {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    function applyMobileSetup() {
        // 1. Ensure correct viewport (fixes width=width-device-width typo)
        let vp = document.querySelector('meta[name="viewport"]');
        if (!vp) {
            vp = document.createElement('meta');
            vp.name = 'viewport';
            document.head.appendChild(vp);
        }
        vp.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0';

        // 2. Automatically link mobile.css if not already in head
        if (!document.getElementById('khan-mobile-stylesheet')) {
            const link = document.createElement('link');
            link.id = 'khan-mobile-stylesheet';
            link.rel = 'stylesheet';
            link.href = 'mobile.css';
            document.head.appendChild(link);
        }

        // 3. Automatically inject Mobile Top Header Bar if missing
        if (!document.querySelector('.mobile-top-nav-bar')) {
            const header = document.createElement('header');
            header.className = 'mobile-top-nav-bar';
            header.innerHTML = `
                <a href="index.html" class="mobile-brand-title">👑 Khan's Cravings</a>
                <button type="button" class="mobile-menu-btn" onclick="window.KhanMobileNav.toggle()">☰ Menu</button>
            `;
            document.body.insertBefore(header, document.body.firstChild);
        }

        // 4. Automatically inject Backdrop for tap-to-close
        if (!document.getElementById('mobile-nav-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.id = 'mobile-nav-backdrop';
            backdrop.onclick = () => window.KhanMobileNav.close();
            document.body.appendChild(backdrop);
        }

        // 5. Global Mobile Drawer Controller
        window.KhanMobileNav = {
            open() {
                document.querySelector('.sidebar')?.classList.add('mobile-open');
                const b = document.getElementById('mobile-nav-backdrop');
                if (b) b.style.display = 'block';
            },
            close() {
                document.querySelector('.sidebar')?.classList.remove('mobile-open');
                const b = document.getElementById('mobile-nav-backdrop');
                if (b) b.style.display = 'none';
            },
            toggle() {
                const s = document.querySelector('.sidebar');
                if (s && s.classList.contains('mobile-open')) this.close();
                else this.open();
            }
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyMobileSetup);
    } else {
        applyMobileSetup();
    }
})();       
