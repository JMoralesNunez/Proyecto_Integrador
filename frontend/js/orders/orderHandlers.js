let currentOrderId = null;
let totalOrder = 0;
let tempItems = [];

export const orderHandlers = {
  async openOrderModal() {
    await this.loadProducts();
    document.getElementById("productsSection").style.display = "none";
  },

  async loadProducts() {
    try {
      const res = await fetch("http://localhost:3001/products");
      const products = await res.json();

      const productSelect = document.getElementById("productSelect");
      productSelect.innerHTML = "";

      products.forEach(product => {
        const opt = document.createElement("option");
        opt.value = product.id_product;
        opt.textContent = `${product.name_product} - $${product.price}`;
        opt.dataset.price = product.price;
        productSelect.appendChild(opt);
      });
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("No se pudieron cargar los productos.");
    }
  },

  async createOrder() {
    const status = document.getElementById("orderStatus").value;
    const id_table = document.getElementById("orderTable").value || null;
    const id_client = document.getElementById("orderClient").value || null;

    if (!id_table || isNaN(id_table) || Number(id_table) <= 0) {
      alert("Número de Mesa es obligatorio.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:3001/rest_tables/${id_table}`);
      if (!res.ok) {
        alert("La mesa seleccionada no existe.");
        return;
      }

      const table = await res.json();
      if (table.availability !== "available") {
        alert(`La mesa ${id_table} está "${table.availability}". Elige otra mesa.`);
        return;
      }
    } catch (error) {
      console.error("Error al verificar la mesa:", error);
      alert("No se pudo verificar la disponibilidad de la mesa.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, id_table, id_client })
      });

      const order = await res.json();
      currentOrderId = order.id_order;

      tempItems = [];
      totalOrder = 0;
      document.getElementById("orderItemsTable").innerHTML = "";
      document.getElementById("orderTotal").textContent = totalOrder;

      document.getElementById("productsSection").style.display = "block";

      if (id_table) {
        await fetch(`http://localhost:3001/rest_tables/${id_table}/occupy`, { method: "PUT" });
      }
    } catch (error) {
      console.error("Error al crear orden:", error);
      alert("No se pudo crear la orden.");
    }
  },

  addProductTemp() {
    const id_product = document.getElementById("productSelect").value;
    const quantity = parseInt(document.getElementById("productQuantity").value);

    const selectedOption = document.querySelector(`#productSelect option[value="${id_product}"]`);
    const name_product = selectedOption.textContent.split(" - $")[0];
    const price = parseFloat(selectedOption.dataset.price);
    const subtotal = price * quantity;

    const item = { id_product, name_product, quantity, price, subtotal };
    tempItems.push(item);

    this.renderTempItems();
  },

  renderTempItems() {
  const tbody = document.getElementById("orderItemsTable");
  tbody.innerHTML = "";
  totalOrder = 0;

  tempItems.forEach((item, index) => {
    totalOrder += item.subtotal;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.name_product}</td>
      <td>${item.quantity}</td>
      <td>$${item.subtotal}</td>
      <td><button class="btn btn-sm btn-danger">❌</button></td>
    `;

    // aquí capturo el botón y le pongo el evento
    row.querySelector("button").addEventListener("click", () => {
      this.removeTempItem(index);
    });

    tbody.appendChild(row);
  });

  document.getElementById("orderTotal").textContent = totalOrder;
},


  removeTempItem(index) {
    tempItems.splice(index, 1);
    this.renderTempItems();
  },

  async saveOrder() {
    try {
      for (let item of tempItems) {
        await fetch("http://localhost:3001/order_items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_order: currentOrderId,
            id_product: item.id_product,
            quantity: item.quantity
          })
        });
      }

      await fetch(`http://localhost:3001/orders/${currentOrderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total_price: totalOrder })
      });

      alert("Orden guardada con éxito");

      const modalEl = document.getElementById("orderModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      currentOrderId = null;
      tempItems = [];
      totalOrder = 0;
    } catch (error) {
      console.error("Error al guardar orden:", error);
      alert("No se pudo guardar la orden.");
    }
  },

  async cancelOrder() {
    if (!currentOrderId) return;

    try {
      const res = await fetch(`http://localhost:3001/orders/${currentOrderId}`);
      if (!res.ok) {
        throw new Error("No se pudo obtener la orden.");
      }
      const order = await res.json();
      const id_table = order.id_table;

      await fetch(`http://localhost:3001/orders/${currentOrderId}`, { method: "DELETE" });

      if (id_table) {
        await fetch(`http://localhost:3001/rest_tables/${id_table}/free`, { method: "PUT" });
      }

      alert("Orden cancelada");

      currentOrderId = null;
      tempItems = [];
      totalOrder = 0;
      document.getElementById("orderItemsTable").innerHTML = "";
      document.getElementById("orderTotal").textContent = 0;

      const modalEl = document.getElementById("orderModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();
    } catch (error) {
      console.error("Error al cancelar orden:", error);
      alert("No se pudo cancelar la orden.");
    }
  }
};


