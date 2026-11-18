// ---------- Helpers ----------

// Konversi ke rupiah
const rupiah = (number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);

// Aturan validasi (dipakai form checkout & form contact)
const validators = {
  name(v) {
    v = v.trim();
    if (!v) return "Nama wajib diisi.";
    if (v.length < 3) return "Nama minimal 3 karakter.";
    if (!/^[\p{L}\s.'-]+$/u.test(v)) return "Nama hanya boleh berisi huruf.";
    return "";
  },
  email(v) {
    v = v.trim();
    if (!v) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v))
      return "Format email tidak valid. Contoh: nama@email.com";
    return "";
  },
  phone(v) {
    const digits = v.replace(/[\s-]/g, "");
    if (!digits) return "Nomor HP wajib diisi.";
    // 08xx / 628xx / +628xx, total 10-13 digit
    if (!/^(?:\+62|62|0)8\d{8,11}$/.test(digits))
      return "Nomor HP tidak valid. Contoh: 0812 3456 7890";
    return "";
  },
  message(v) {
    v = v.trim();
    if (!v) return "Pesan wajib diisi.";
    if (v.length < 10) return "Pesan minimal 10 karakter.";
    return "";
  },
};

document.addEventListener("alpine:init", () => {
  // ---------- Reusable form + validasi ----------
  Alpine.data("validatedForm", (fields) => ({
    values: Object.fromEntries(fields.map((f) => [f, ""])),
    errors: {},
    touched: {},

    validateField(f) {
      this.errors[f] = validators[f](this.values[f]);
      return !this.errors[f];
    },
    // validasi saat keluar dari field
    blur(f) {
      this.touched[f] = true;
      this.validateField(f);
    },
    // setelah pernah disentuh, error hilang real-time saat user memperbaiki
    input(f) {
      if (this.touched[f]) this.validateField(f);
    },
    cleanPhone() {
      this.values.phone = this.values.phone.replace(/[^\d+\s-]/g, "");
    },
    validate() {
      let firstInvalid = null;
      fields.forEach((f) => {
        this.touched[f] = true;
        if (!this.validateField(f) && !firstInvalid) firstInvalid = f;
      });
      if (firstInvalid) {
        const el = this.$root.querySelector(`[name="${firstInvalid}"]`);
        if (el) el.focus();
        return false;
      }
      return true;
    },
    reset() {
      fields.forEach((f) => (this.values[f] = ""));
      this.errors = {};
      this.touched = {};
    },
  }));

  // ---------- Produk ----------
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Auréon Noctis",
        img: "Auréon Noctis.jpeg",
        price: 100000,
        desc: "Aroma hangat untuk malam hari. Amber yang pekat berpadu manis vanila, meninggalkan jejak lembut yang bertahan hingga larut.",
        notes: { top: "Bergamot, kapulaga", heart: "Amber, kayu cendana", base: "Vanila, musk" },
      },
      {
        id: 2,
        name: "Auréon Imperium",
        img: "Auréon Imperium.jpg",
        price: 130000,
        desc: "Aroma percaya diri dengan sentuhan floral yang bersih. Dibuat untuk pria yang ingin hadir dengan tenang tapi berkesan.",
        notes: { top: "Jeruk bergamot, lada pink", heart: "Mawar, geranium", base: "Amber, cedar" },
      },
      {
        id: 3,
        name: "Auréon Obsidian",
        img: "Auréon Obsidian.jpg",
        price: 200000,
        desc: "Gelap, dalam, dan berkarakter. Oud berpadu kulit dan rempah hangat untuk kesan yang sulit dilupakan.",
        notes: { top: "Safron, lada hitam", heart: "Oud, kulit", base: "Patchouli, resin" },
      },
      {
        id: 4,
        name: "Auréon Solstice",
        img: "Auréon Solstice.jpg",
        price: 85000,
        desc: "Segar seperti pagi di titik balik matahari. Citrus cerah dengan dasar musk bersih, cocok untuk dipakai sehari-hari.",
        notes: { top: "Lemon, jeruk mandarin", heart: "Neroli, melati", base: "Musk putih" },
      },
      {
        id: 5,
        name: "Auréon Valour",
        img: "Auréon Valour.jpg",
        price: 170000,
        desc: "Klasik yang tegas. Rempah hangat dan kayu kering berpadu tembakau manis, mewakili keberanian yang elegan.",
        notes: { top: "Kapulaga, jahe", heart: "Tembakau, kayu cedar", base: "Tonka, amber" },
      },
      {
        id: 6,
        name: "Auréon Veyron",
        img: "Auréon Veyron.jpg",
        price: 170000,
        desc: "Dingin, tajam, dan modern. Sentuhan aquatic dan mint dengan dasar kayu yang bersih dan maskulin.",
        notes: { top: "Mint, apel hijau", heart: "Aquatic, lavender", base: "Ambergris, vetiver" },
      },
    ],
    // hasil filter dari kotak search di navbar
    get filtered() {
      const q = Alpine.store("ui").query.trim().toLowerCase();
      return q ? this.items.filter((i) => i.name.toLowerCase().includes(q)) : this.items;
    },
  }));

  // ---------- Cart ----------
  Alpine.store("cart", {
    items: [],

    get quantity() {
      return this.items.reduce((sum, i) => sum + i.quantity, 0);
    },
    get total() {
      return this.items.reduce((sum, i) => sum + i.total, 0);
    },

    add(newItem, notify = true) {
      const cartItem = this.items.find((item) => item.id === newItem.id);
      if (!cartItem) {
        this.items.push({
          id: newItem.id,
          name: newItem.name,
          img: newItem.img,
          price: newItem.price,
          quantity: 1,
          total: newItem.price,
        });
      } else {
        cartItem.quantity++;
        cartItem.total = cartItem.price * cartItem.quantity;
      }
      if (notify) Alpine.store("ui").showToast(`${newItem.name} ditambahkan ke keranjang`);
    },
    // kurangi 1; kalau sisa 1 maka item dihapus
    remove(id) {
      const cartItem = this.items.find((item) => item.id === id);
      if (!cartItem) return;
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
        cartItem.total = cartItem.price * cartItem.quantity;
      } else {
        this.delete(id);
      }
    },
    // hapus item sekaligus
    delete(id) {
      this.items = this.items.filter((item) => item.id !== id);
    },
    clear() {
      this.items = [];
    },
  });

  // ---------- UI state (drawer, modal, toast, search) ----------
  Alpine.store("ui", {
    cartOpen: false,
    searchOpen: false,
    menuOpen: false,
    query: "",
    detail: null, // produk yang lagi dibuka di modal detail
    confirmOpen: false,
    placing: false,
    order: null, // { customer } selama modal konfirmasi
    success: null, // { title, text, ref? }
    toastMsg: "",
    _toastTimer: null,

    get locked() {
      return this.cartOpen || !!this.detail || this.confirmOpen || !!this.success;
    },

    openCart() {
      this.cartOpen = true;
      this.searchOpen = false;
      this.menuOpen = false;
    },
    toggleSearch() {
      this.searchOpen = !this.searchOpen;
      this.menuOpen = false;
      if (this.searchOpen) {
        setTimeout(() => document.querySelector("#search-box")?.focus(), 50);
      }
    },
    jumpToProducts() {
      if (this.query.trim()) {
        document.querySelector("#product")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    openDetail(item) {
      this.detail = item;
    },

    // Step 1: tombol Checkout (form valid) -> modal konfirmasi
    requestConfirm(customer) {
      this.order = { customer };
      this.confirmOpen = true;
    },
    // Step 2: "Ya, pesan sekarang" -> modal sukses
    placeOrder() {
      this.placing = true;
      setTimeout(() => {
        const ref = "AUR-" + Date.now().toString().slice(-6);
        const name = this.order.customer.name.trim();
        const email = this.order.customer.email.trim();

        Alpine.store("cart").clear();
        window.dispatchEvent(new CustomEvent("order-placed")); // reset form checkout
        this.placing = false;
        this.confirmOpen = false;
        this.order = null;
        this.cartOpen = false;
        this.success = {
          title: "Pesanan berhasil dipesan",
          text: `Terima kasih, ${name}. Pesanan Anda sedang kami siapkan`,
          ref,
        };
      }, 700);
    },
    showSuccess(payload) {
      this.success = payload;
    },
    showToast(msg) {
      this.toastMsg = msg;
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => (this.toastMsg = ""), 2200);
    },
    closeAll() {
      if (this.placing) return;
      this.success = null;
      this.confirmOpen = false;
      this.detail = null;
      this.cartOpen = false;
      this.searchOpen = false;
      this.menuOpen = false;
    },
  });

  // kunci scroll body kalau ada drawer / modal yang kebuka
  Alpine.effect(() => {
    document.body.classList.toggle("locked", Alpine.store("ui").locked);
  });

  // Esc nutup apa pun yang lagi kebuka
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") Alpine.store("ui").closeAll();
  });

  // klik di luar menu mobile -> tutup
  document.addEventListener("click", (e) => {
    const ui = Alpine.store("ui");
    if (ui.menuOpen && !e.target.closest(".navbar")) ui.menuOpen = false;
  });
});
