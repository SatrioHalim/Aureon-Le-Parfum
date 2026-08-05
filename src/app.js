document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      {
        id: 1,
        name: "Auréon Noctis",
        img: "Auréon Noctis.jpeg",
        price: 100000,
      },
      {
        id: 2,
        name: "Auréon Imperium",
        img: "Auréon Imperium.jpg",
        price: 130000,
      },
      {
        id: 3,
        name: "Auréon Obsidian",
        img: "Auréon Obsidian.jpg",
        price: 200000,
      },
      {
        id: 4,
        name: "Auréon Solstice",
        img: "Auréon Solstice.jpg",
        price: 85000,
      },
      {
        id: 5,
        name: "Auréon Valour",
        img: "Auréon Valour.jpg",
        price: 170000,
      },
      {
        id: 6,
        name: "Auréon Veyron",
        img: "Auréon Veyron.jpg",
        price: 170000,
      },
    ],
  }));
  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada barang yg sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // Jika belum ada / cart masih kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // Jika barang udah ada, cek apakah barang beda atau sama dengan yg ada di cart
        this.items = this.items.map((item) => {
          // jika barang beda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sama, maka tambah quantity & total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      // ambil item yg mau di remove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      // Jika item > 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yg di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // Jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
