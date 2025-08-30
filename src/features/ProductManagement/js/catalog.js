import { CURRENT_USER_ID, supabase } from "./supabase.js";

const dummyProducts = [
    {
        id: "1",
        name: "Fresh Tomatoes",
        variety: "Local Red",
        description:
            "Fresh, juicy tomatoes grown organically in our farm. Perfect for salads and cooking.",
        price_per_unit: 80,
        unit: "kg",
        quantity: 150,
        location: "Bogura",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&h=300&fit=crop",
        category: "vegetables",
        created_at: "2024-01-15T10:00:00Z",
    },
    {
        id: "2",
        name: "Organic Potatoes",
        variety: "Desi Alu",
        description:
            "Fresh organic potatoes, perfect for cooking. Grown without chemical fertilizers.",
        price_per_unit: 45,
        unit: "kg",
        quantity: 200,
        location: "Bogura",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop",
        category: "vegetables",
        created_at: "2024-01-14T09:30:00Z",
    },
    {
        id: "3",
        name: "Sweet Mangoes",
        variety: "Langra",
        description:
            "Sweet and juicy Langra mangoes. Available in limited quantity.",
        price_per_unit: 120,
        unit: "kg",
        quantity: 75,
        location: "Dhaka",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1669207334420-66d0e3450283?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "fruits",
        created_at: "2024-01-13T14:20:00Z",
    },
    {
        id: "4",
        name: "Fresh Milk",
        variety: "Cow Milk",
        description:
            "Pure cow milk, collected fresh daily. Rich in nutrients and natural taste.",
        price_per_unit: 90,
        unit: "liter",
        quantity: 50,
        location: "Bogura",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop",
        category: "dairy",
        created_at: "2024-01-16T06:00:00Z",
    },
    {
        id: "5",
        name: "Basmati Rice",
        variety: "Premium Quality",
        description:
            "Premium quality Basmati rice, aromatic and long-grained. Perfect for special occasions.",
        price_per_unit: 180,
        unit: "kg",
        quantity: 100,
        location: "Chittagong",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop",
        category: "grains",
        created_at: "2024-01-12T11:15:00Z",
    },
    {
        id: "6",
        name: "Fresh Onions",
        variety: "Local Red",
        description:
            "Fresh red onions, essential for every kitchen. Grown with care in our fields.",
        price_per_unit: 35,
        unit: "kg",
        quantity: 300,
        location: "Bogura",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1642582037312-9b9639be89e6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG9uaW9ufGVufDB8fDB8fHww",
        category: "vegetables",
        created_at: "2024-01-11T08:45:00Z",
    },
    {
        id: "7",
        name: "Green Bananas",
        variety: "Sagor",
        description:
            "Fresh green bananas, perfect for cooking. Rich in nutrients and natural taste.",
        price_per_unit: 60,
        unit: "dozen",
        quantity: 40,
        location: "Dhaka",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1739664237734-e6e9b91bfd0d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "fruits",
        created_at: "2024-01-10T13:30:00Z",
    },
    {
        id: "8",
        name: "Fresh Eggs",
        variety: "Farm Fresh",
        description:
            "Farm fresh eggs, collected daily. Rich in protein and essential nutrients.",
        price_per_unit: 15,
        unit: "piece",
        quantity: 500,
        location: "Bogura",
        status: "active",
        image_url:
            "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "dairy",
        created_at: "2024-01-17T07:00:00Z",
    },
];

class ProductCatalog {
    constructor() {
        this.products = [...dummyProducts];
        this.filteredProducts = [...dummyProducts];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupUserMenu();
        this.renderProducts();
    }

    setupEventListeners() {
        const searchInput = document.getElementById("searchInput");
        searchInput.addEventListener("input", (e) => {
            this.filterProducts();
        });

        const categoryFilter = document.getElementById("categoryFilter");
        const priceFilter = document.getElementById("priceFilter");
        const locationFilter = document.getElementById("locationFilter");

        [categoryFilter, priceFilter, locationFilter].forEach((filter) => {
            filter.addEventListener("change", () => {
                this.filterProducts();
            });
        });

        const sortBy = document.getElementById("sortBy");
        sortBy.addEventListener("change", (e) => {
            this.sortProducts(e.target.value);
        });

        const clearFilters = document.getElementById("clearFilters");
        clearFilters.addEventListener("click", () => {
            this.clearAllFilters();
        });
    }

    setupUserMenu() {
        const userMenuBtn = document.getElementById("userMenuBtn");
        const userMenu = document.getElementById("userMenu");
        const signOutLink = document.getElementById("signOutLink");
        const settingsLink = document.getElementById("settingsLink");

        userMenuBtn.addEventListener("click", () => {
            userMenu.classList.toggle("open");
            userMenuBtn.setAttribute(
                "aria-expanded",
                userMenu.classList.contains("open")
            );
        });

        document.addEventListener("click", (e) => {
            if (
                !userMenuBtn.contains(e.target) &&
                !userMenu.contains(e.target)
            ) {
                userMenu.classList.remove("open");
                userMenuBtn.setAttribute("aria-expanded", "false");
            }
        });

        signOutLink.addEventListener("click", (e) => {
            e.preventDefault();

            console.log("Sign out clicked");
        });

        settingsLink.addEventListener("click", (e) => {
            e.preventDefault();

            console.log("Settings clicked");
        });
    }

    filterProducts() {
        const searchTerm = document
            .getElementById("searchInput")
            .value.toLowerCase();
        const category = document.getElementById("categoryFilter").value;
        const priceRange = document.getElementById("priceFilter").value;
        const location = document.getElementById("locationFilter").value;

        this.filteredProducts = this.products.filter((product) => {
            const matchesSearch =
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.variety.toLowerCase().includes(searchTerm);

            const matchesCategory =
                category === "all" || product.category === category;

            let matchesPrice = true;
            if (priceRange === "low") {
                matchesPrice = product.price_per_unit < 50;
            } else if (priceRange === "medium") {
                matchesPrice =
                    product.price_per_unit >= 50 &&
                    product.price_per_unit <= 200;
            } else if (priceRange === "high") {
                matchesPrice = product.price_per_unit > 200;
            }

            const matchesLocation =
                location === "all" ||
                product.location.toLowerCase() === location.toLowerCase();

            return (
                matchesSearch &&
                matchesCategory &&
                matchesPrice &&
                matchesLocation
            );
        });

        this.renderProducts();
    }

    sortProducts(sortBy) {
        switch (sortBy) {
            case "price_low":
                this.filteredProducts.sort(
                    (a, b) => a.price_per_unit - b.price_per_unit
                );
                break;
            case "price_high":
                this.filteredProducts.sort(
                    (a, b) => b.price_per_unit - a.price_per_unit
                );
                break;
            case "newest":
                this.filteredProducts.sort(
                    (a, b) => new Date(b.created_at) - new Date(a.created_at)
                );
                break;
            default:
                this.filteredProducts.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                break;
        }

        this.renderProducts();
    }

    clearAllFilters() {
        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "all";
        document.getElementById("priceFilter").value = "all";
        document.getElementById("locationFilter").value = "all";
        document.getElementById("sortBy").value = "name";

        this.filteredProducts = [...this.products];
        this.renderProducts();
    }

    renderProducts() {
        const productsGrid = document.getElementById("productsGrid");
        const loading = document.getElementById("loading");
        const noProducts = document.getElementById("noProducts");

        loading.style.display = "none";

        if (this.filteredProducts.length === 0) {
            noProducts.style.display = "block";
            productsGrid.innerHTML = "";
            return;
        }

        noProducts.style.display = "none";

        productsGrid.innerHTML = this.filteredProducts
            .map(
                (product) => `
      <div class="product-card" data-product-id="${product.id}">
        <div class="product-image">
          <img src="${product.image_url}" alt="${
                    product.name
                }" loading="lazy" />
          <div class="product-status status status--${
              product.status
          }">${this.formatStatus(product.status)}</div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-variety">${product.variety}</p>
          <p class="product-description">${product.description}</p>
          <div class="product-meta">
            <span class="product-price">৳${product.price_per_unit}/${
                    product.unit
                }</span>
            <span class="product-quantity">Qty: ${product.quantity}</span>
          </div>
          <div class="product-location">
            <span class="location-icon">📍</span> ${product.location}
          </div>
          <div class="product-actions">
            <button class="btn btn--primary" onclick="this.viewProduct('${
                product.id
            }')">Update Product</button>
            <button class="btn" onclick="this.contactFarmer('${
                product.id
            }')">Update Product</button>
          </div>
        </div>
      </div>
    `
            )
            .join("");
    }

    formatStatus(status) {
        const statusMap = {
            active: "Available",
            paused: "Paused",
            sold_out: "Sold Out",
        };
        return statusMap[status] || status;
    }

    viewProduct(productId) {
        console.log("View product:", productId);
    }

    contactFarmer(productId) {
        console.log("Contact farmer for product:", productId);
    }

    async loadProductsFromSupabase() {
        try {
            const { data, error } = await supabase
                .from("products")
                .select("*")
                .eq("owner_id", CURRENT_USER_ID)
                .order("created_at", { ascending: false });

            if (error) throw error;

            if (data) {
                this.products = data;
                this.filteredProducts = [...data];
                this.renderProducts();
            }
        } catch (error) {
            console.error("Error loading products from Supabase:", error);

            this.renderProducts();
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new ProductCatalog();
});

window.viewProduct = function (productId) {
    console.log("View product:", productId);
};

window.contactFarmer = function (productId) {
    console.log("Contact farmer for product:", productId);
};
