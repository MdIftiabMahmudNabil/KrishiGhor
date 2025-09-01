// import { CURRENT_USER_ID, supabase } from "./supabase.js";

// const tbody = document.getElementById("products-tbody");
// const searchInput = document.getElementById("searchInput");
// const statusFilter = document.getElementById("statusFilter");
// const loadingEl = document.getElementById("loading");
// const noticeEl = document.getElementById("notice");
// const userMenuBtn = document.getElementById("userMenuBtn");
// const userMenu = document.getElementById("userMenu");

// let allProducts = [];

// function showNotice(message, type = "info") {
//     if (!noticeEl) return;
//     noticeEl.textContent = message || "";
//     noticeEl.style.color = type === "error" ? "#b91c1c" : "#6b7280";
//     if (message) setTimeout(() => (noticeEl.textContent = ""), 2500);
// }

// function formatCurrency(value) {
//     const number = Number(value || 0);
//     return new Intl.NumberFormat(undefined, {
//         style: "currency",
//         currency: "BDT",
//         currencyDisplay: "narrowSymbol",
//         maximumFractionDigits: 2,
//     }).format(number);
// }

// function statusClass(status) {
//     return `status status--${status}`;
// }

// function productRow(product) {
//     const tr = document.createElement("tr");
//     tr.dataset.id = product.id;

//     const imgTd = document.createElement("td");
//     if (product.image_url) {
//         const img = document.createElement("img");
//         img.src = product.image_url;
//         img.alt = product.name;
//         img.className = "thumb";
//         imgTd.appendChild(img);
//     } else {
//         const ph = document.createElement("div");
//         ph.className = "placeholder";
//         ph.textContent = "—";
//         imgTd.appendChild(ph);
//     }

//     const nameTd = document.createElement("td");
//     nameTd.textContent = product.name;

//     const priceTd = document.createElement("td");
//     priceTd.textContent = `${formatCurrency(product.price_per_unit)} / ${
//         product.unit
//     }`;

//     const qtyTd = document.createElement("td");
//     qtyTd.textContent = `${product.quantity ?? 0}`;

//     const locTd = document.createElement("td");
//     locTd.textContent = product.location || "";

//     const statusTd = document.createElement("td");
//     const st = document.createElement("span");
//     st.className = statusClass(product.status);
//     st.textContent = product.status.replace("_", " ");
//     statusTd.appendChild(st);

//     const actionsTd = document.createElement("td");
//     actionsTd.className = "actions";
//     const editA = document.createElement("a");
//     editA.className = "btn";
//     editA.href = `product-form.html?id=${encodeURIComponent(product.id)}`;
//     editA.textContent = "Edit";
//     const delBtn = document.createElement("button");
//     delBtn.className = "btn btn--danger";
//     delBtn.textContent = "Delete";
//     delBtn.addEventListener("click", () => handleDelete(product.id));
//     actionsTd.append(editA, delBtn);

//     tr.append(imgTd, nameTd, priceTd, qtyTd, locTd, statusTd, actionsTd);
//     return tr;
// }

// function render(products) {
//     tbody.innerHTML = "";
//     if (!products.length) {
//         const tr = document.createElement("tr");
//         const td = document.createElement("td");
//         td.colSpan = 7;
//         td.style.color = "#6b7280";
//         td.style.textAlign = "center";
//         td.style.padding = "20px 12px";
//         td.innerHTML =
//             'No products yet. <a class="link" href="product-form.html">Add your first product</a>.';
//         tr.appendChild(td);
//         tbody.appendChild(tr);
//         return;
//     }
//     products.forEach((p) => tbody.appendChild(productRow(p)));
// }

// function applyFilters() {
//     const q = (searchInput.value || "").toLowerCase().trim();
//     const status = statusFilter.value;
//     const list = allProducts.filter((p) => {
//         const matchesText = !q || p.name.toLowerCase().includes(q);
//         const matchesStatus = status === "all" || p.status === status;
//         return matchesText && matchesStatus;
//     });
//     render(list);
// }

// async function loadProducts() {
//     loadingEl.style.display = "block";
//     const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("owner_id", CURRENT_USER_ID)
//         .order("updated_at", { ascending: false });
//     loadingEl.style.display = "none";
//     if (error) {
//         showNotice(error.message, "error");
//         return;
//     }
//     allProducts = data || [];
//     applyFilters();
// }

// async function handleDelete(id) {
//     const confirmed = window.confirm(
//         "Delete this product? This cannot be undone."
//     );
//     if (!confirmed) return;
//     const row = tbody.querySelector(`tr[data-id="${id}"]`);
//     const prevHTML = row?.innerHTML;
//     if (row) {
//         row.style.opacity = "0.6";
//     }
//     const { error } = await supabase.from("products").delete().eq("id", id);
//     if (error) {
//         if (row) {
//             row.style.opacity = "1";
//             row.innerHTML = prevHTML;
//         }
//         showNotice(error.message, "error");
//         return;
//     }
//     allProducts = allProducts.filter((p) => p.id !== id);
//     if (row) row.remove();
//     showNotice("Product deleted.");
// }

// searchInput.addEventListener("input", applyFilters);
// statusFilter.addEventListener("change", applyFilters);

// loadProducts();

// if (userMenuBtn && userMenu) {
//     userMenuBtn.addEventListener("click", (e) => {
//         e.stopPropagation();
//         const isOpen = userMenu.classList.toggle("open");
//         userMenuBtn.setAttribute("aria-expanded", String(isOpen));
//     });
//     document.addEventListener("click", () => {
//         if (userMenu.classList.contains("open")) {
//             userMenu.classList.remove("open");
//             userMenuBtn.setAttribute("aria-expanded", "false");
//         }
//     });
//     const settings = document.getElementById("settingsLink");
//     const signout = document.getElementById("signOutLink");
//     settings?.addEventListener("click", (e) => {
//         e.preventDefault();
//         alert("Settings is not implemented yet.");
//     });
//     signout?.addEventListener("click", (e) => {
//         e.preventDefault();
//         alert("Sign out is not implemented in this demo.");
//     });
// }

//before

// import { CURRENT_USER_ID, supabase } from "./supabase.js";

// const tbody = document.getElementById("products-tbody");
// const searchInput = document.getElementById("searchInput");
// const statusFilter = document.getElementById("statusFilter");
// const loadingEl = document.getElementById("loading");
// const noticeEl = document.getElementById("notice");
// const userMenuBtn = document.getElementById("userMenuBtn");
// const userMenu = document.getElementById("userMenu");

// const dummySalesLastMonth = [
//     { category: "vegetables", qty: 150 },
//     { category: "vegetables", qty: 90 },
//     { category: "fruits", qty: 70 },
//     { category: "grains", qty: 55 },
//     { category: "dairy", qty: 120 },
// ];

// let allProducts = [];
// let pieChart = null;
// let barChart = null;

// function showNotice(message, type = "info") {
//     if (!noticeEl) return;
//     noticeEl.textContent = message || "";
//     noticeEl.style.color = type === "error" ? "#b91c1c" : "#6b7280";
//     if (message) setTimeout(() => (noticeEl.textContent = ""), 2500);
// }
// function formatCurrency(value) {
//     const number = Number(value || 0);
//     return new Intl.NumberFormat(undefined, {
//         style: "currency",
//         currency: "BDT",
//         currencyDisplay: "narrowSymbol",
//         maximumFractionDigits: 2,
//     }).format(number);
// }
// const statusClass = (s) => `status status--${s}`;

// function productRow(product) {
//     const tr = document.createElement("tr");
//     tr.dataset.id = product.id;

//     const imgTd = document.createElement("td");
//     if (product.image_url) {
//         const img = document.createElement("img");
//         img.src = product.image_url;
//         img.alt = product.name;
//         img.className = "thumb";
//         imgTd.appendChild(img);
//     } else {
//         const ph = document.createElement("div");
//         ph.className = "placeholder";
//         ph.textContent = "—";
//         imgTd.appendChild(ph);
//     }

//     const nameTd = document.createElement("td");
//     nameTd.textContent = product.name;

//     const priceTd = document.createElement("td");
//     priceTd.textContent = `${formatCurrency(product.price_per_unit)} / ${
//         product.unit
//     }`;

//     const qtyTd = document.createElement("td");
//     qtyTd.textContent = `${product.quantity ?? 0}`;

//     const locTd = document.createElement("td");
//     locTd.textContent = product.location || "";

//     const statusTd = document.createElement("td");
//     const st = document.createElement("span");
//     st.className = statusClass(product.status);
//     st.textContent = product.status.replace("_", " ");
//     statusTd.appendChild(st);

//     const actionsTd = document.createElement("td");
//     actionsTd.className = "actions";
//     const editA = document.createElement("a");
//     editA.className = "btn";
//     editA.href = `product-form.html?id=${encodeURIComponent(product.id)}`;
//     editA.textContent = "Edit";
//     const delBtn = document.createElement("button");
//     delBtn.className = "btn btn--danger";
//     delBtn.textContent = "Delete";
//     delBtn.addEventListener("click", () => handleDelete(product.id));
//     actionsTd.append(editA, delBtn);

//     tr.append(imgTd, nameTd, priceTd, qtyTd, locTd, statusTd, actionsTd);
//     return tr;
// }

// function render(products) {
//     tbody.innerHTML = "";
//     if (!products.length) {
//         const tr = document.createElement("tr");
//         const td = document.createElement("td");
//         td.colSpan = 7;
//         td.style.color = "#6b7280";
//         td.style.textAlign = "center";
//         td.style.padding = "20px 12px";
//         td.innerHTML =
//             'No products yet. <a class="link" href="product-form.html">Add your first product</a>.';
//         tr.appendChild(td);
//         tbody.appendChild(tr);
//         return;
//     }
//     products.forEach((p) => tbody.appendChild(productRow(p)));
// }

// function applyFilters() {
//     const q = (searchInput.value || "").toLowerCase().trim();
//     const status = statusFilter.value;
//     const list = allProducts.filter((p) => {
//         const matchesText = !q || p.name.toLowerCase().includes(q);
//         const matchesStatus = status === "all" || p.status === status;
//         return matchesText && matchesStatus;
//     });
//     render(list);
//     updateCharts(list);
// }

// async function loadProducts() {
//     loadingEl.style.display = "block";
//     const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("owner_id", CURRENT_USER_ID)
//         .order("updated_at", { ascending: false });
//     loadingEl.style.display = "none";
//     if (error) {
//         showNotice(error.message, "error");
//         return;
//     }
//     allProducts = data || [];
//     applyFilters();
// }

// async function handleDelete(id) {
//     const confirmed = window.confirm(
//         "Delete this product? This cannot be undone."
//     );
//     if (!confirmed) return;
//     const row = tbody.querySelector(`tr[data-id="${id}"]`);
//     const prevHTML = row?.innerHTML;
//     if (row) row.style.opacity = "0.6";
//     const { error } = await supabase.from("products").delete().eq("id", id);
//     if (error) {
//         if (row) {
//             row.style.opacity = "1";
//             row.innerHTML = prevHTML;
//         }
//         showNotice(error.message, "error");
//         return;
//     }
//     allProducts = allProducts.filter((p) => p.id !== id);
//     if (row) row.remove();
//     showNotice("Product deleted.");
//     applyFilters();
// }

// function getLastMonthRange() {
//     const now = new Date();
//     const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const end = new Date(firstOfThisMonth.getTime() - 1);
//     const start = new Date(end.getFullYear(), end.getMonth(), 1);
//     return { start, end };
// }

// function computeLastMonthCategoryTotals(products) {
//     const { start, end } = getLastMonthRange();
//     const buckets = {};
//     let hadAnyLastMonth = false;

//     for (const p of products) {
//         const cat = (p.category || "unknown").toLowerCase();
//         const when = p.sold_at || p.updated_at || p.created_at || null;
//         const dt = when ? new Date(when) : null;

//         const isLastMonth = dt && dt >= start && dt <= end;
//         if (isLastMonth) {
//             hadAnyLastMonth = true;
//             const qty = Number(p.sold_qty ?? p.quantity ?? 0);
//             buckets[cat] = (buckets[cat] || 0) + qty;
//         }
//     }

//     if (!hadAnyLastMonth) {
//         const myCats = new Set(
//             products.map((p) => (p.category || "unknown").toLowerCase())
//         );
//         for (const s of dummySalesLastMonth) {
//             const cat = (s.category || "unknown").toLowerCase();
//             if (myCats.has(cat)) {
//                 buckets[cat] = (buckets[cat] || 0) + Number(s.qty || 0);
//             }
//         }
//     }

//     const labels = Object.keys(buckets).map(
//         (c) => c[0].toUpperCase() + c.slice(1)
//     );
//     const values = Object.values(buckets);
//     return { labels, values };
// }

// function makePalette(n) {
//     const base = [
//         "#81c784",
//         "#aed581",
//         "#66bb6a",
//         "#cfd8dc",
//         "#a5d6a7",
//         "#b0bec5",
//         "#9ccc65",
//     ];
//     return Array.from({ length: n }, (_, i) => base[i % base.length]);
// }

// function renderPie(labels, values) {
//     const el = document.getElementById("pieByCategory");
//     if (!el) return;
//     if (pieChart) pieChart.destroy();
//     pieChart = new Chart(el, {
//         type: "pie",
//         data: {
//             labels,
//             datasets: [
//                 {
//                     data: values,
//                     borderWidth: 1,
//                     backgroundColor: makePalette(labels.length),
//                 },
//             ],
//         },
//         options: {
//             plugins: {
//                 legend: { position: "bottom" },
//                 tooltip: {
//                     callbacks: { label: (c) => `${c.label}: ${c.raw}` },
//                 },
//             },
//         },
//     });
// }

// function renderBar(labels, values) {
//     const el = document.getElementById("barByCategory");
//     if (!el) return;
//     if (barChart) barChart.destroy();
//     barChart = new Chart(el, {
//         type: "bar",
//         data: {
//             labels,
//             datasets: [
//                 {
//                     label: "Qty sold (last month)",
//                     data: values,
//                     borderWidth: 1,
//                     backgroundColor: makePalette(labels.length),
//                 },
//             ],
//         },
//         options: {
//             scales: { y: { beginAtZero: true } },
//             plugins: { legend: { display: false } },
//         },
//     });
// }

// function updateCharts(visibleProducts) {
//     const { labels, values } = computeLastMonthCategoryTotals(visibleProducts);
//     renderPie(labels, values);
//     renderBar(labels, values);
// }

// searchInput.addEventListener("input", applyFilters);
// statusFilter.addEventListener("change", applyFilters);

// loadProducts();

// if (userMenuBtn && userMenu) {
//     userMenuBtn.addEventListener("click", (e) => {
//         e.stopPropagation();
//         const isOpen = userMenu.classList.toggle("open");
//         userMenuBtn.setAttribute("aria-expanded", String(isOpen));
//     });
//     document.addEventListener("click", () => {
//         if (userMenu.classList.contains("open")) {
//             userMenu.classList.remove("open");
//             userMenuBtn.setAttribute("aria-expanded", "false");
//         }
//     });
//     const settings = document.getElementById("settingsLink");
//     const signout = document.getElementById("signOutLink");
//     settings?.addEventListener("click", (e) => {
//         e.preventDefault();
//         alert("Settings is not implemented yet.");
//     });
//     signout?.addEventListener("click", (e) => {
//         e.preventDefault();
//         alert("Sign out is not implemented in this demo.");
//     });
// }

//after

import { CURRENT_USER_ID, supabase } from "./supabase.js";

const tbody = document.getElementById("products-tbody");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const loadingEl = document.getElementById("loading");
const noticeEl = document.getElementById("notice");
const userMenuBtn = document.getElementById("userMenuBtn");
const userMenu = document.getElementById("userMenu");

const dummyProducts = [
    {
        id: "1",
        name: "Fresh Tomatoes",
        price_per_unit: 80,
        unit: "kg",
        quantity: 150,
        location: "Bogura",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=200",
        category: "vegetables",
        created_at: "2024-01-15T10:00:00Z",
    },
    {
        id: "2",
        name: "Organic Potatoes",
        price_per_unit: 45,
        unit: "kg",
        quantity: 200,
        location: "Bogura",
        status: "paused",
        image_url:
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200",
        category: "vegetables",
        created_at: "2024-01-14T09:30:00Z",
    },
    {
        id: "3",
        name: "Sweet Mangoes",
        price_per_unit: 120,
        unit: "kg",
        quantity: 75,
        location: "Dhaka",
        status: "sold_out",
        image_url:
            "https://images.unsplash.com/photo-1669207334420-66d0e3450283?w=200",
        category: "fruits",
        created_at: "2024-01-13T14:20:00Z",
    },
];

const dummySalesLastMonth = [
    { category: "vegetables", qty: 150 },
    { category: "vegetables", qty: 90 },
    { category: "fruits", qty: 70 },
    { category: "grains", qty: 55 },
    { category: "dairy", qty: 120 },
];

let allProducts = [];
let pieChart = null;
let barChart = null;

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

const statusClass = (s) => `status status--${s}`;

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

function normalize(s) {
    return String(s || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/\s+/g, " ")
        .trim();
}

function applyFilters() {
    const q = normalize(searchInput.value);
    const status = statusFilter.value;
    const list = allProducts.filter((p) => {
        const haystack = [
            p.name,
            p.variety,
            p.description,
            p.location,
            p.unit,
            p.category,
        ]
            .map(normalize)
            .join(" | ");
        const matchesText = !q || haystack.includes(q);
        const matchesStatus = status === "all" || p.status === status;
        return matchesText && matchesStatus;
    });
    render(list);
    updateCharts(list);
}

async function loadProducts() {
    loadingEl.style.display = "block";
    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("owner_id", CURRENT_USER_ID)
            .order("updated_at", { ascending: false });
        loadingEl.style.display = "none";

        if (error) {
            showNotice(error.message, "error");
            allProducts = dummyProducts;
            applyFilters();
            return;
        }

        allProducts = data && data.length ? data : dummyProducts;
        applyFilters();
    } catch (e) {
        loadingEl.style.display = "none";
        allProducts = dummyProducts;
        applyFilters();
    }
}

async function handleDelete(id) {
    const confirmed = window.confirm(
        "Delete this product? This cannot be undone."
    );
    if (!confirmed) return;
    const row = tbody.querySelector(`tr[data-id="${id}"]`);
    const prevHTML = row?.innerHTML;
    if (row) row.style.opacity = "0.6";
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
    applyFilters();
}

function getLastMonthRange() {
    const now = new Date();
    const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(firstOfThisMonth.getTime() - 1);
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    return { start, end };
}

function computeLastMonthCategoryTotals(products) {
    const { start, end } = getLastMonthRange();
    const buckets = {};
    let hadAnyLastMonth = false;
    for (const p of products) {
        const cat = (p.category || "unknown").toLowerCase();
        const when = p.sold_at || p.updated_at || p.created_at || null;
        const dt = when ? new Date(when) : null;
        const isLastMonth = dt && dt >= start && dt <= end;
        if (isLastMonth) {
            hadAnyLastMonth = true;
            const qty = Number(p.sold_qty ?? p.quantity ?? 0);
            buckets[cat] = (buckets[cat] || 0) + qty;
        }
    }
    if (!hadAnyLastMonth) {
        const myCats = new Set(
            products.map((p) => (p.category || "unknown").toLowerCase())
        );
        for (const s of dummySalesLastMonth) {
            const cat = (s.category || "unknown").toLowerCase();
            if (myCats.has(cat)) {
                buckets[cat] = (buckets[cat] || 0) + Number(s.qty || 0);
            }
        }
    }
    const labels = Object.keys(buckets).map(
        (c) => c[0].toUpperCase() + c.slice(1)
    );
    const values = Object.values(buckets);
    return { labels, values };
}

function makePalette(n) {
    const base = [
        "#81c784",
        "#aed581",
        "#66bb6a",
        "#cfd8dc",
        "#a5d6a7",
        "#b0bec5",
        "#9ccc65",
    ];
    return Array.from({ length: n }, (_, i) => base[i % base.length]);
}

function renderPie(labels, values) {
    const el = document.getElementById("pieByCategory");
    if (!el) return;
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(el, {
        type: "pie",
        data: {
            labels,
            datasets: [
                {
                    data: values,
                    borderWidth: 1,
                    backgroundColor: makePalette(labels.length),
                },
            ],
        },
        options: {
            plugins: {
                legend: { position: "bottom" },
                tooltip: {
                    callbacks: { label: (c) => `${c.label}: ${c.raw}` },
                },
            },
        },
    });
}

function renderBar(labels, values) {
    const el = document.getElementById("barByCategory");
    if (!el) return;
    if (barChart) barChart.destroy();
    barChart = new Chart(el, {
        type: "bar",
        data: {
            labels,
            datasets: [
                {
                    label: "Qty sold (last month)",
                    data: values,
                    borderWidth: 1,
                    backgroundColor: makePalette(labels.length),
                },
            ],
        },
        options: {
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } },
        },
    });
}

function updateCharts(visibleProducts) {
    const { labels, values } = computeLastMonthCategoryTotals(visibleProducts);
    renderPie(labels, values);
    renderBar(labels, values);
}

let _t;
searchInput.addEventListener("input", () => {
    clearTimeout(_t);
    _t = setTimeout(applyFilters, 120);
});
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
