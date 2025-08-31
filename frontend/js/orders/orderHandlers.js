let currentOrderId = null;
let totalOrder = 0;
let tempItems = [];

export const orderHandlers = {
  async openOrderModal() {
    await this.loadProducts();
    await this.loadTables();
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los productos.",
      });
    }
  },

  async loadTables() {
    try {
      const res = await fetch("http://localhost:3001/rest_tables");
      const tables = await res.json();

      const tableSelect = document.getElementById("orderTable");
      tableSelect.innerHTML = '<option value=""> Sin mesa </option>';

      tables.forEach(table => {
        const opt = document.createElement("option");
        opt.value = table.id_table;
        opt.textContent = `Mesa ${table.id_table} (Cap: ${table.capacity}) - ${table.availability}`;
        tableSelect.appendChild(opt);
      });
    } catch (error) {
      console.error("Error al cargar mesas:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar las mesas.",
      });
    }
  },

  async createOrder() {
    const status = document.getElementById("orderStatus").value;
    const id_table_input = document.getElementById("orderTable").value;

    const id_table = id_table_input === "" ? null : Number(id_table_input);

    if (id_table !== null && (isNaN(id_table) || id_table < 0)) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Número de mesa inválido.",
      });
      return;
    }

    if (id_table !== null) {
      try {
        const res = await fetch(`http://localhost:3001/rest_tables/${id_table}`);
        if (!res.ok) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "La mesa seleccionada no existe.",
          });
          return;
        }

        const table = await res.json();
        if (table.availability !== "available") {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: `La mesa ${id_table} está "${table.availability}". Elige otra mesa.`,
          });
          return;
        }
      } catch (error) {
        console.error("Error al verificar la mesa:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo verificar la disponibilidad de la mesa."
        });
        return;
      }
    }

    try {
      const res = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, id_table })
      });

      const order = await res.json();
      currentOrderId = order.id_order;

      tempItems = [];
      totalOrder = 0;
      document.getElementById("orderItemsTable").innerHTML = "";
      document.getElementById("orderTotal").textContent = totalOrder;

      document.getElementById("productsSection").style.display = "block";

      if (id_table !== null) {
        await fetch(`http://localhost:3001/rest_tables/${id_table}/occupy`, { method: "PUT" });
      }
    } catch (error) {
      console.error("Error al crear orden:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo crear la orden.",
      });
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
      Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Orden creada con éxito.",
    });


      const modalEl = document.getElementById("orderModal");
      const modal = bootstrap.Modal.getInstance(modalEl);
      modal.hide();

      currentOrderId = null;
      tempItems = [];
      totalOrder = 0;
    } catch (error) {
      console.error("Error al guardar orden:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo guardar la orden.",
      });
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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Orden cancelada",
      });

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
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cancelar la orden.",
      });
    }
  }
};
