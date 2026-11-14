/**
 * 👑 KHAN'S CRAVINGS - SYSTEM ENGINE & STORAGE CORE
 * Array-unified storage matching see your-cart.html
 */
(() => {
    "use strict";

    const STORE_KEY = "khans_cart_vault";
    const DRAFT_KEY = "khan_checkout_draft";

    // Safely parse as Array (auto-converts legacy Object format if present)
    const safeParse = (raw) => {
        try {
            const parsed = JSON.parse(raw || "[]");
            if (Array.isArray(parsed)) return parsed;
            if (parsed && typeof parsed === "object") {
                return Object.values(parsed).filter(item => item && item.name);
            }
            return [];
        } catch {
            return [];
        }
    };

    const save = (data) => {
        try {
            const arr = Array.isArray(data) ? data : [];
            localStorage.setItem(STORE_KEY, JSON.stringify(arr));
            return true;
        } catch (e) {
            console.error("[KhanEngine] Failed to write to localStorage:", e);
            return false;
        }
    };

    window.KhanEngine = {
        getCart() {
            return safeParse(localStorage.getItem(STORE_KEY));
        },

        getDatabaseSize() {
            const cart = this.getCart();
            console.log(`📊 [DATABASE STATUS]: Active items = ${cart.length}`);
            return cart;
        },

        getItem(id) {
            return this.getCart().find(item => String(item.id) === String(id)) || null;
        },

        insertItem(id, name, price, qty = 1) {
            if (!id || !name) {
                console.warn("[KhanEngine] insertItem requires valid id and name params");
                return false;
            }
            const cart = this.getCart();
            const quantity = Math.max(1, parseInt(qty, 10) || 1);
            const unitPrice = parseFloat(price) || 0;
            const existing = cart.find(item => String(item.id) === String(id));

            if (existing) {
                existing.quantity = (parseInt(existing.quantity, 10) || 1) + quantity;
            } else {
                cart.push({
                    id: String(id),
                    name: String(name),
                    price: unitPrice,
                    quantity: quantity
                });
            }

            const success = save(cart);
            if (success) {
                console.log(`✅ [INSERT SUCCESS]: ${name} (ID: ${id}) updated in cart.`);
            }
            return success;
        },

        updateQuantity(id, qty) {
            const cart = this.getCart();
            const item = cart.find(i => String(i.id) === String(id));
            if (!item) return false;

            const newQty = parseInt(qty, 10);
            if (isNaN(newQty) || newQty <= 0) {
                return this.removeItem(id);
            }
            item.quantity = newQty;
            return save(cart);
        },

        removeItem(id) {
            const cart = this.getCart();
            const next = cart.filter(i => String(i.id) !== String(id));
            if (next.length === cart.length) return false;
            const success = save(next);
            if (success) {
                console.log(`🗑️ [DELETE SUCCESS]: Item ID ${id} cleared from basket.`);
            }
            return success;
        },

        clearCart() {
            localStorage.removeItem(STORE_KEY);
            console.log("🧹 Local cart register wiped clean.");
            return true;
        },

        getTotals() {
            const cart = this.getCart();
            let itemCount = cart.length;
            let totalQuantity = 0;
            let totalPrice = 0;

            for (const item of cart) {
                const q = parseInt(item.quantity, 10) || 1;
                const p = parseFloat(item.price) || 0;
                totalQuantity += q;
                totalPrice += p * q;
            }

            return {
                itemCount,
                totalQuantity,
                totalPrice: Math.round(totalPrice * 100) / 100
            };
        },

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
