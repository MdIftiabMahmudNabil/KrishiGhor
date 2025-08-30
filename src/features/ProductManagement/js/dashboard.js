import { CURRENT_USER_ID, supabase } from "./supabase.js";

const tbody = document.getElementById("products-tbody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const loadingEl = document.getElementById("loading");
const noticeEl = document.getElementById("notice");
const userMenuBtn = document.getElementById("userMenuBtn");
const userMenu = document.getElementById("userMenu");

let allProducts = [];

function showNotice(message, type = "info") {
    if (!noticeEl) return;
    noticeEl.textContent = message || "";
    noticeEl.style.color = type === "error" ? "#b91c1c" : "#6b7280";
    if (message) setTimeout(() => (noticeEl.textContent = ""), 2500);
}

function formatCurrency(value) {
    const number = Number(value || 0);
    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "BDT",
        currencyDisplay: "narrowSymbol",
        maximumFractionDigits: 2,
    }).format(number);
}

function statusClass(status) {
    return `status status--${status}`;
}

function productRow(product) {
    const tr = document.createElement("tr");
    tr.dataset.id = product.id;

    const imgTd = document.createElement("td");
    if (product.image_url) {
        const img = document.createElement("img");
        img.src = product.image_url;
        img.alt = product.name;
        img.className = "thumb";
        imgTd.appendChild(img);
    } else {
        const ph = document.createElement("div");
        ph.className = "placeholder";
        ph.textContent = "—";
        imgTd.appendChild(ph);
    }

    const nameTd = document.createElement("td");
    nameTd.textContent = product.name;

    const priceTd = document.createElement("td");
    priceTd.textContent = `${formatCurrency(product.price_per_unit)} / ${
        product.unit
    }`;

    const qtyTd = document.createElement("td");
    qtyTd.textContent = `${product.quantity ?? 0}`;

    const locTd = document.createElement("td");
    locTd.textContent = product.location || "";

    const statusTd = document.createElement("td");
    const st = document.createElement("span");
    st.className = statusClass(product.status);
    st.textContent = product.status.replace("_", " ");
    statusTd.appendChild(st);

    const actionsTd = document.createElement("td");
    actionsTd.className = "actions";
    const editA = document.createElement("a");
    editA.className = "btn";
    editA.href = `product-form.html?id=${encodeURIComponent(product.id)}`;
    editA.textContent = "Edit";
    const delBtn = document.createElement("button");
    delBtn.className = "btn btn--danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => handleDelete(product.id));
    actionsTd.append(editA, delBtn);

    tr.append(imgTd, nameTd, priceTd, qtyTd, locTd, statusTd, actionsTd);
    return tr;
}

function render(products) {
    tbody.innerHTML = "";
    if (!products.length) {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 7;
        td.style.color = "#6b7280";
        td.style.textAlign = "center";
        td.style.padding = "20px 12px";
        td.innerHTML =
            'No products yet. <a class="link" href="product-form.html">Add your first product</a>.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    products.forEach((p) => tbody.appendChild(productRow(p)));
}

function applyFilters() {
    const q = (searchInput.value || "").toLowerCase().trim();
    const status = statusFilter.value;
    const list = allProducts.filter((p) => {
        const matchesText = !q || p.name.toLowerCase().includes(q);
        const matchesStatus = status === "all" || p.status === status;
        return matchesText && matchesStatus;
    });
    render(list);
}

async function loadProducts() {
    loadingEl.style.display = "block";
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("owner_id", CURRENT_USER_ID)
        .order("updated_at", { ascending: false });
    loadingEl.style.display = "none";
    if (error) {
        showNotice(error.message, "error");
        return;
    }
    allProducts = data || [];
    applyFilters();
}

async function handleDelete(id) {
    const confirmed = window.confirm(
        "Delete this product? This cannot be undone."
    );
    if (!confirmed) return;
    const row = tbody.querySelector(`tr[data-id="${id}"]`);
    const prevHTML = row?.innerHTML;
    if (row) {
        row.style.opacity = "0.6";
    }
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
        if (row) {
            row.style.opacity = "1";
            row.innerHTML = prevHTML;
        }
        showNotice(error.message, "error");
        return;
    }
    allProducts = allProducts.filter((p) => p.id !== id);
    if (row) row.remove();
    showNotice("Product deleted.");
}

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);

loadProducts();

if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = userMenu.classList.toggle("open");
        userMenuBtn.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", () => {
        if (userMenu.classList.contains("open")) {
            userMenu.classList.remove("open");
            userMenuBtn.setAttribute("aria-expanded", "false");
        }
    });
    const settings = document.getElementById("settingsLink");
    const signout = document.getElementById("signOutLink");
    settings?.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Settings is not implemented yet.");
    });
    signout?.addEventListener("click", (e) => {
        e.preventDefault();
        alert("Sign out is not implemented in this demo.");
    });
}
