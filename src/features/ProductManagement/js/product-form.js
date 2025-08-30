import { CURRENT_USER_ID, STORAGE_BUCKET, supabase } from "./supabase.js";

const params = new URLSearchParams(location.search);
const productId = params.get("id");

const titleEl = document.getElementById("formTitle");
const form = document.getElementById("productForm");
const errorEl = document.getElementById("error");
const saveBtn = document.getElementById("saveBtn");

const nameEl = document.getElementById("name");
const varietyEl = document.getElementById("variety");
const descriptionEl = document.getElementById("description");
const priceEl = document.getElementById("price");
const unitEl = document.getElementById("unit");
const quantityEl = document.getElementById("quantity");
const locationEl = document.getElementById("location");
const statusEl = document.getElementById("status");
const photoEl = document.getElementById("photo");

function setError(msg) {
    if (!errorEl) return;
    errorEl.textContent = msg || "";
}

async function fetchAndPrefill(id) {
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
    if (error) {
        setError(error.message);
        return;
    }
    if (!data) return;
    nameEl.value = data.name || "";
    varietyEl.value = data.variety || "";
    descriptionEl.value = data.description || "";
    priceEl.value = data.price_per_unit ?? "";
    unitEl.value = data.unit || "";
    quantityEl.value = data.quantity ?? "";
    locationEl.value = data.location || "";
    statusEl.value = data.status || "active";
}

async function maybeUpload(file) {
    if (!file) return "";
    const path = `${CURRENT_USER_ID}/${crypto.randomUUID()}-${file.name}`;
    const { data: up, error: upErr } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { upsert: false });
    if (upErr) {
        setError(upErr.message);
        return "";
    }
    const { data: pub } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
    return pub?.publicUrl || "";
}

async function onSubmit(ev) {
    ev.preventDefault();
    setError("");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    const prevLabel = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving…";

    try {
        const imageUrl = await maybeUpload(photoEl.files?.[0]);
        const payload = {
            owner_id: CURRENT_USER_ID,
            name: nameEl.value.trim(),
            variety: varietyEl.value.trim() || null,
            description: descriptionEl.value.trim() || null,
            price_per_unit: Number(priceEl.value),
            unit: unitEl.value,
            quantity: Number(quantityEl.value),
            location: locationEl.value.trim(),
            status: statusEl.value,
        };
        if (imageUrl) payload.image_url = imageUrl;

        let error;
        if (productId) {
            ({ error } = await supabase
                .from("products")
                .update(payload)
                .eq("id", productId));
        } else {
            ({ error } = await supabase.from("products").insert(payload));
        }
        if (error) throw error;
        location.href = "index.html";
    } catch (err) {
        setError(err.message || "Failed to save");
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = prevLabel;
    }
}

if (productId) {
    titleEl.textContent = "Edit Product";
    fetchAndPrefill(productId);
} else {
    titleEl.textContent = "Add Product";
}

form.addEventListener("submit", onSubmit);
