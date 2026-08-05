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
  Alpine.store('cart',{
    items:[],
    total:0,
    quantity:0,
    add(newItem){
      this.items.push(newItem);
      this.quantity++;
      this.total += newItem.price;
      console.log(this.items);
      console.log(this.total);
    }
  });
});

// Konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits:0
  }).format(number);
}