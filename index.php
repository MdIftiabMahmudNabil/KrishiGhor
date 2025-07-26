<?php
// Database connection
$db_connection = pg_connect("host=db dbname=krishighor user=postgres password=yourpassword");

// Initialize variables
$dark_mode = isset($_COOKIE['dark_mode']) ? $_COOKIE['dark_mode'] : 'light';

// Toggle dark mode
if (isset($_POST['toggle_dark_mode'])) {
    $dark_mode = $dark_mode === 'light' ? 'dark' : 'light';
    setcookie('dark_mode', $dark_mode, time() + (86400 * 30), "/");
}

// Handle form submissions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Add new crop
    if (isset($_POST['add_crop'])) {
        $name = pg_escape_string($_POST['name']);
        $type = pg_escape_string($_POST['type']);
        $quantity = (float)$_POST['quantity'];
        $price = (float)$_POST['price'];
        $region = pg_escape_string($_POST['region']);
        $description = pg_escape_string($_POST['description']);
        
        $query = "INSERT INTO crops (name, type, quantity, price, region, description) 
                  VALUES ('$name', '$type', $quantity, $price, '$region', '$description')";
        pg_query($db_connection, $query);
    }
    
    // Update crop
    if (isset($_POST['update_crop'])) {
        $id = (int)$_POST['id'];
        $name = pg_escape_string($_POST['name']);
        $type = pg_escape_string($_POST['type']);
        $quantity = (float)$_POST['quantity'];
        $price = (float)$_POST['price'];
        $region = pg_escape_string($_POST['region']);
        $description = pg_escape_string($_POST['description']);
        
        $query = "UPDATE crops SET 
                  name = '$name', 
                  type = '$type', 
                  quantity = $quantity, 
                  price = $price, 
                  region = '$region', 
                  description = '$description'
                  WHERE id = $id";
        pg_query($db_connection, $query);
    }
    
    // Delete crop
    if (isset($_POST['delete_crop'])) {
        $id = (int)$_POST['id'];
        $query = "DELETE FROM crops WHERE id = $id";
        pg_query($db_connection, $query);
    }
    
    // Add to cart
    if (isset($_POST['add_to_cart'])) {
        $crop_id = (int)$_POST['crop_id'];
        $quantity = (float)$_POST['quantity'];
        
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
        
        if (isset($_SESSION['cart'][$crop_id])) {
            $_SESSION['cart'][$crop_id] += $quantity;
        } else {
            $_SESSION['cart'][$crop_id] = $quantity;
        }
    }
    
    // Remove from cart
    if (isset($_POST['remove_from_cart'])) {
        $crop_id = (int)$_POST['crop_id'];
        if (isset($_SESSION['cart'][$crop_id])) {
            unset($_SESSION['cart'][$crop_id]);
        }
    }
    
    // Update cart
    if (isset($_POST['update_cart'])) {
        foreach ($_POST['quantities'] as $crop_id => $quantity) {
            $crop_id = (int)$crop_id;
            $quantity = (float)$quantity;
            
            if ($quantity <= 0) {
                unset($_SESSION['cart'][$crop_id]);
            } else {
                $_SESSION['cart'][$crop_id] = $quantity;
            }
        }
    }
}

// Get filter parameters
$search = isset($_GET['search']) ? pg_escape_string($_GET['search']) : '';
$type_filter = isset($_GET['type']) ? pg_escape_string($_GET['type']) : '';
$region_filter = isset($_GET['region']) ? pg_escape_string($_GET['region']) : '';
$price_min = isset($_GET['price_min']) ? (float)$_GET['price_min'] : 0;
$price_max = isset($_GET['price_max']) ? (float)$_GET['price_max'] : PHP_FLOAT_MAX;

// Build query
$query = "SELECT * FROM crops WHERE 1=1";
if (!empty($search)) {
    $query .= " AND (name ILIKE '%$search%' OR description ILIKE '%$search%')";
}
if (!empty($type_filter)) {
    $query .= " AND type = '$type_filter'";
}
if (!empty($region_filter)) {
    $query .= " AND region = '$region_filter'";
}
$query .= " AND price BETWEEN $price_min AND $price_max";
$query .= " ORDER BY name";

$result = pg_query($db_connection, $query);

// Get unique types and regions for filters
$types_result = pg_query($db_connection, "SELECT DISTINCT type FROM crops ORDER BY type");
$regions_result = pg_query($db_connection, "SELECT DISTINCT region FROM crops ORDER BY region");

// Get cart items if they exist
$cart_items = [];
$cart_total = 0;
if (isset($_SESSION['cart']) && !empty($_SESSION['cart'])) {
    $cart_ids = implode(',', array_keys($_SESSION['cart']));
    $cart_query = "SELECT * FROM crops WHERE id IN ($cart_ids)";
    $cart_result = pg_query($db_connection, $cart_query);
    
    while ($row = pg_fetch_assoc($cart_result)) {
        $row['cart_quantity'] = $_SESSION['cart'][$row['id']];
        $row['subtotal'] = $row['price'] * $row['cart_quantity'];
        $cart_items[] = $row;
        $cart_total += $row['subtotal'];
    }
}

// Get price trends for comparison tool
$price_trends_query = "SELECT 
    date_trunc('month', updated_at) as month,
    type,
    AVG(price) as avg_price
FROM crops
GROUP BY month, type
ORDER BY month, type";
$price_trends_result = pg_query($db_connection, $price_trends_query);

$price_trends = [];
while ($row = pg_fetch_assoc($price_trends_result)) {
    $price_trends[] = $row;
}

// AI Recommendations
$ai_recommendations = [];
if (!empty($cart_items)) {
    // Simple recommendation logic (in a real app, this would be more sophisticated)
    $recommendation_query = "SELECT * FROM crops 
                            WHERE type IN (
                                SELECT DISTINCT type FROM crops WHERE id IN ($cart_ids)
                            ) 
                            AND id NOT IN ($cart_ids)
                            ORDER BY price ASC 
                            LIMIT 3";
    $recommendation_result = pg_query($db_connection, $recommendation_query);
    
    while ($row = pg_fetch_assoc($recommendation_result)) {
        $ai_recommendations[] = $row;
    }
}
?>
<!DOCTYPE html>
<html lang="en" class="<?php echo $dark_mode === 'dark' ? 'dark' : ''; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KrishiGhor - Product Management</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            200: '#bbf7d0',
                            300: '#86efac',
                            400: '#4ade80',
                            500: '#22c55e',
                            600: '#16a34a',
                            700: '#15803d',
                            800: '#166534',
                            900: '#14532d',
                        },
                        secondary: {
                            50: '#f8fafc',
                            100: '#f1f5f9',
                            200: '#e2e8f0',
                            300: '#cbd5e1',
                            400: '#94a3b8',
                            500: '#64748b',
                            600: '#475569',
                            700: '#334155',
                            800: '#1e293b',
                            900: '#0f172a',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        /* Custom scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #f1f1f1;
        }
        .dark ::-webkit-scrollbar-track {
            background: #1e293b;
        }
        ::-webkit-scrollbar-thumb {
            background: #86efac;
            border-radius: 4px;
        }
        .dark ::-webkit-scrollbar-thumb {
            background: #166534;
        }
        
        /* Animation for cards */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Gradient background */
        .gradient-bg {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%);
        }
        .dark .gradient-bg {
            background: linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%);
        }
        
        /* Custom checkbox */
        .custom-checkbox {
            appearance: none;
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #cbd5e1;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
        }
        .custom-checkbox:checked {
            background-color: #22c55e;
            border-color: #22c55e;
        }
        .custom-checkbox:checked::after {
            content: "✓";
            color: white;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 12px;
            font-weight: bold;
        }
        .dark .custom-checkbox {
            border-color: #475569;
        }
    </style>
</head>
<body class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <!-- Header -->
    <header class="gradient-bg shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4">
            <div class="flex justify-between items-center">
                <div class="flex items-center space-x-2">
                    <i class="fas fa-leaf text-3xl text-primary-600 dark:text-primary-400"></i>
                    <h1 class="text-2xl font-bold text-gray-800 dark:text-white">KrishiGhor</h1>
                    <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300">Product Management</span>
                </div>
                <div class="flex items-center space-x-4">
                    <form method="post" class="m-0">
                        <button type="submit" name="toggle_dark_mode" class="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all">
                            <i class="<?php echo $dark_mode === 'dark' ? 'fas fa-sun' : 'fas fa-moon'; ?> text-gray-700 dark:text-yellow-300"></i>
                        </button>
                    </form>
                    <div class="relative">
                        <button id="cart-button" class="p-2 rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all relative">
                            <i class="fas fa-shopping-cart text-gray-700 dark:text-white"></i>
                            <?php if (!empty($cart_items)): ?>
                                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    <?php echo count($cart_items); ?>
                                </span>
                            <?php endif; ?>
                        </button>
                        <!-- Cart Dropdown -->
                        <div id="cart-dropdown" class="hidden absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-md shadow-xl z-50 border border-gray-200 dark:border-gray-700">
                            <div class="p-4">
                                <h3 class="font-bold text-lg text-gray-800 dark:text-white mb-2">Your Cart</h3>
                                <?php if (empty($cart_items)): ?>
                                    <p class="text-gray-600 dark:text-gray-300">Your cart is empty</p>
                                <?php else: ?>
                                    <div class="max-h-60 overflow-y-auto">
                                        <?php foreach ($cart_items as $item): ?>
                                            <div class="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                                                <div>
                                                    <p class="font-medium text-gray-800 dark:text-white"><?php echo htmlspecialchars($item['name']); ?></p>
                                                    <p class="text-sm text-gray-600 dark:text-gray-300"><?php echo $item['cart_quantity']; ?> kg × ₹<?php echo number_format($item['price'], 2); ?></p>
                                                </div>
                                                <div class="flex items-center">
                                                    <span class="text-primary-600 dark:text-primary-400 font-medium">₹<?php echo number_format($item['subtotal'], 2); ?></span>
                                                    <form method="post" class="ml-2">
                                                        <input type="hidden" name="crop_id" value="<?php echo $item['id']; ?>">
                                                        <button type="submit" name="remove_from_cart" class="text-red-500 hover:text-red-700">
                                                            <i class="fas fa-times"></i>
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                    <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div class="flex justify-between font-bold text-gray-800 dark:text-white">
                                            <span>Total:</span>
                                            <span>₹<?php echo number_format($cart_total, 2); ?></span>
                                        </div>
                                        <a href="#cart-section" class="block mt-2 w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-2 rounded-md transition-colors">
                                            View Cart
                                        </a>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>
                    </div>
                    <div class="hidden md:flex items-center space-x-2">
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" class="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800">
                        <span class="text-gray-700 dark:text-white font-medium">Admin</span>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-4 py-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-fade-in" style="animation-delay: 0.1s;">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium">Total Crops</p>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                            <?php 
                            $count_query = "SELECT COUNT(*) FROM crops";
                            $count_result = pg_query($db_connection, $count_query);
                            echo pg_fetch_result($count_result, 0, 0);
                            ?>
                        </h3>
                    </div>
                    <div class="p-3 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
                        <i class="fas fa-seedling text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-fade-in" style="animation-delay: 0.2s;">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium">Total Inventory</p>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                            <?php 
                            $inventory_query = "SELECT SUM(quantity) FROM crops";
                            $inventory_result = pg_query($db_connection, $inventory_query);
                            echo number_format(pg_fetch_result($inventory_result, 0, 0), 2); ?> kg
                        </h3>
                    </div>
                    <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                        <i class="fas fa-weight-hanging text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-fade-in" style="animation-delay: 0.3s;">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium">Avg. Price</p>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                            ₹<?php 
                            $avg_price_query = "SELECT AVG(price) FROM crops";
                            $avg_price_result = pg_query($db_connection, $avg_price_query);
                            echo number_format(pg_fetch_result($avg_price_result, 0, 0), 2); ?>
                        </h3>
                    </div>
                    <div class="p-3 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                        <i class="fas fa-rupee-sign text-xl"></i>
                    </div>
                </div>
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-fade-in" style="animation-delay: 0.4s;">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 dark:text-gray-400 font-medium">Regions</p>
                        <h3 class="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                            <?php 
                            $regions_count_query = "SELECT COUNT(DISTINCT region) FROM crops";
                            $regions_count_result = pg_query($db_connection, $regions_count_query);
                            echo pg_fetch_result($regions_count_result, 0, 0); ?>
                        </h3>
                    </div>
                    <div class="p-3 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                        <i class="fas fa-map-marker-alt text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and Filters -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Search & Filter Crops</h2>
            <form method="get" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
                    <input type="text" id="search" name="search" value="<?php echo htmlspecialchars($search); ?>" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                           placeholder="Crop name or description">
                </div>
                
                <div>
                    <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Type</label>
                    <select id="type" name="type" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                        <option value="">All Types</option>
                        <?php while ($type_row = pg_fetch_assoc($types_result)): ?>
                            <option value="<?php echo htmlspecialchars($type_row['type']); ?>" <?php echo $type_filter === $type_row['type'] ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($type_row['type']); ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>
                
                <div>
                    <label for="region" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
                    <select id="region" name="region" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                        <option value="">All Regions</option>
                        <?php 
                        pg_result_seek($regions_result, 0); // Reset pointer
                        while ($region_row = pg_fetch_assoc($regions_result)): ?>
                            <option value="<?php echo htmlspecialchars($region_row['region']); ?>" <?php echo $region_filter === $region_row['region'] ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($region_row['region']); ?>
                            </option>
                        <?php endwhile; ?>
                    </select>
                </div>
                
                <div>
                    <label for="price_range" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price Range (₹)</label>
                    <div class="flex space-x-2">
                        <input type="number" id="price_min" name="price_min" value="<?php echo $price_min; ?>" 
                               class="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="Min" min="0" step="0.01">
                        <input type="number" id="price_max" name="price_max" value="<?php echo $price_max === PHP_FLOAT_MAX ? '' : $price_max; ?>" 
                               class="w-1/2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white" 
                               placeholder="Max" min="0" step="0.01">
                    </div>
                </div>
                
                <div class="md:col-span-2 lg:col-span-4 flex justify-end space-x-3">
                    <button type="submit" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors">
                        <i class="fas fa-filter mr-2"></i>Apply Filters
                    </button>
                    <a href="product_management.php" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-medium rounded-md shadow-sm transition-colors">
                        <i class="fas fa-times mr-2"></i>Reset
                    </a>
                </div>
            </form>
        </div>

        <!-- Price Comparison Tool -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Price Comparison Tool</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                            <?php 
                            $unique_types = [];
                            pg_result_seek($types_result, 0);
                            while ($type_row = pg_fetch_assoc($types_result)) {
                                $unique_types[] = $type_row['type'];
                                echo '<th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">' . htmlspecialchars($type_row['type']) . '</th>';
                            }
                            ?>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <?php
                        $current_month = null;
                        foreach ($price_trends as $trend):
                            if ($trend['month'] !== $current_month):
                                $current_month = $trend['month'];
                                $month_name = date('M Y', strtotime($current_month));
                                echo '<tr>';
                                echo '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">' . $month_name . '</td>';
                                
                                foreach ($unique_types as $type) {
                                    $found = false;
                                    foreach ($price_trends as $t) {
                                        if ($t['month'] === $current_month && $t['type'] === $type) {
                                            echo '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹' . number_format($t['avg_price'], 2) . '</td>';
                                            $found = true;
                                            break;
                                        }
                                    }
                                    if (!$found) {
                                        echo '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">-</td>';
                                    }
                                }
                                
                                echo '</tr>';
                            endif;
                        endforeach;
                        ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Crop Listing -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">Crop Inventory</h2>
                <button id="add-crop-button" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors">
                    <i class="fas fa-plus mr-2"></i>Add New Crop
                </button>
            </div>
            
            <!-- Add/Edit Crop Modal (hidden by default) -->
            <div id="crop-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-800 dark:text-white" id="modal-title">Add New Crop</h3>
                        <button id="close-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <form method="post" id="crop-form">
                        <input type="hidden" id="crop-id" name="id">
                        <div class="space-y-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Crop Name</label>
                                <input type="text" id="name" name="name" required
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label for="type" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                <input type="text" id="type" name="type" required
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label for="quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity (kg)</label>
                                <input type="number" id="quantity" name="quantity" required min="0" step="0.01"
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (₹/kg)</label>
                                <input type="number" id="price" name="price" required min="0" step="0.01"
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label for="region" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
                                <input type="text" id="region" name="region" required
                                       class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                            </div>
                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea id="description" name="description" rows="3"
                                          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"></textarea>
                            </div>
                        </div>
                        <div class="mt-6 flex justify-end space-x-3">
                            <button type="button" id="cancel-crop" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-medium rounded-md shadow-sm transition-colors">
                                Cancel
                            </button>
                            <button type="submit" name="add_crop" id="submit-crop" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors">
                                Save Crop
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Crop Table -->
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crop</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity (kg)</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price (₹/kg)</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Region</th>
                            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <?php if (pg_num_rows($result) > 0): ?>
                            <?php while ($row = pg_fetch_assoc($result)): ?>
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                <i class="fas fa-seedling text-primary-600 dark:text-primary-400"></i>
                                            </div>
                                            <div class="ml-4">
                                                <div class="text-sm font-medium text-gray-900 dark:text-white"><?php echo htmlspecialchars($row['name']); ?></div>
                                                <div class="text-sm text-gray-500 dark:text-gray-400"><?php echo strlen($row['description']) > 30 ? substr(htmlspecialchars($row['description']), 0, 30) . '...' : htmlspecialchars($row['description']); ?></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><?php echo htmlspecialchars($row['type']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><?php echo number_format($row['quantity'], 2); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600 dark:text-primary-400">₹<?php echo number_format($row['price'], 2); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300"><?php echo htmlspecialchars($row['region']); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex space-x-2">
                                            <button onclick="editCrop(<?php echo htmlspecialchars(json_encode($row)); ?>)" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <form method="post" onsubmit="return confirm('Are you sure you want to delete this crop?');">
                                                <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                                <button type="submit" name="delete_crop" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </form>
                                            <button onclick="addToCartPrompt(<?php echo $row['id']; ?>)" class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                                                <i class="fas fa-cart-plus"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No crops found matching your criteria.
                                </td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- AI Recommendations -->
        <?php if (!empty($ai_recommendations)): ?>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">AI-Powered Recommendations</h2>
            <p class="text-gray-600 dark:text-gray-300 mb-4">Based on your current selections, we recommend these additional crops that might interest you:</p>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <?php foreach ($ai_recommendations as $recommendation): ?>
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow">
                        <div class="flex justify-between items-start">
                            <div>
                                <h3 class="font-bold text-gray-800 dark:text-white"><?php echo htmlspecialchars($recommendation['name']); ?></h3>
                                <p class="text-sm text-gray-600 dark:text-gray-300"><?php echo htmlspecialchars($recommendation['type']); ?></p>
                            </div>
                            <span class="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300">AI Recommended</span>
                        </div>
                        <div class="mt-3">
                            <p class="text-sm text-gray-600 dark:text-gray-300 mb-1">Available: <?php echo number_format($recommendation['quantity'], 2); ?> kg</p>
                            <p class="text-primary-600 dark:text-primary-400 font-medium">₹<?php echo number_format($recommendation['price'], 2); ?>/kg</p>
                        </div>
                        <div class="mt-4 flex justify-between items-center">
                            <span class="text-xs text-gray-500 dark:text-gray-400"><?php echo htmlspecialchars($recommendation['region']); ?></span>
                            <button onclick="addToCartPrompt(<?php echo $recommendation['id']; ?>)" class="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors">
                                <i class="fas fa-cart-plus mr-1"></i>Add
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- Cart Section -->
        <div id="cart-section" class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Your Order Cart</h2>
            
            <?php if (empty($cart_items)): ?>
                <div class="text-center py-8">
                    <i class="fas fa-shopping-cart text-4xl text-gray-400 dark:text-gray-500 mb-3"></i>
                    <p class="text-gray-600 dark:text-gray-400">Your cart is empty. Add some crops to get started!</p>
                </div>
            <?php else: ?>
                <form method="post">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Crop</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price (₹/kg)</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity (kg)</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal (₹)</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <?php foreach ($cart_items as $item): ?>
                                    <tr>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                                                    <i class="fas fa-seedling text-primary-600 dark:text-primary-400"></i>
                                                </div>
                                                <div class="ml-4">
                                                    <div class="text-sm font-medium text-gray-900 dark:text-white"><?php echo htmlspecialchars($item['name']); ?></div>
                                                    <div class="text-sm text-gray-500 dark:text-gray-400"><?php echo htmlspecialchars($item['type']); ?></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-primary-600 dark:text-primary-400">₹<?php echo number_format($item['price'], 2); ?></td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <input type="number" name="quantities[<?php echo $item['id']; ?>]" value="<?php echo $item['cart_quantity']; ?>" 
                                                   min="0.01" step="0.01" class="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">₹<?php echo number_format($item['subtotal'], 2); ?></td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button type="submit" name="remove_from_cart" value="<?php echo $item['id']; ?>" class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                                <tr class="bg-gray-50 dark:bg-gray-700 font-bold">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white" colspan="3">Total</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">₹<?php echo number_format($cart_total, 2); ?></td>
                                    <td class="px-6 py-4 whitespace-nowrap"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="mt-6 flex justify-between items-center">
                        <button type="submit" name="update_cart" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors">
                            <i class="fas fa-sync-alt mr-2"></i>Update Cart
                        </button>
                        <button type="button" onclick="checkout()" class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors">
                            <i class="fas fa-check-circle mr-2"></i>Proceed to Checkout
                        </button>
                    </div>
                </form>
            <?php endif; ?>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-800 dark:bg-gray-900 text-white py-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 class="text-lg font-bold mb-4">KrishiGhor</h3>
                    <p class="text-gray-400">Transparent crop pricing & supply chain platform connecting producers and buyers directly.</p>
                </div>
                <div>
                    <h4 class="text-md font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Products</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-md font-semibold mb-4">Resources</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">Support</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition-colors">API Docs</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-md font-semibold mb-4">Contact</h4>
                    <ul class="space-y-2">
                        <li class="flex items-center text-gray-400"><i class="fas fa-map-marker-alt mr-2"></i> Farmers Plaza, Agricultural Zone</li>
                        <li class="flex items-center text-gray-400"><i class="fas fa-phone mr-2"></i> +91 9876543210</li>
                        <li class="flex items-center text-gray-400"><i class="fas fa-envelope mr-2"></i> info@krishighor.com</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
                <p>&copy; <?php echo date('Y'); ?> KrishiGhor. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- Add to Cart Modal -->
    <div id="add-to-cart-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">Add to Cart</h3>
                <button onclick="closeAddToCartModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <form method="post" id="add-to-cart-form">
                <input type="hidden" id="modal-crop-id" name="crop_id">
                <div class="mb-4">
                    <label for="cart-quantity" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quantity (kg)</label>
                    <input type="number" id="cart-quantity" name="quantity" min="0.01" step="0.01" value="1" 
                           class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white">
                </div>
                <div class="flex justify-end space-x-3">
                    <button type="button" onclick="closeAddToCartModal()" class="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-medium rounded-md shadow-sm transition-colors">
                        Cancel
                    </button>
                    <button type="submit" name="add_to_cart" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors">
                        Add to Cart
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Checkout Modal -->
    <div id="checkout-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-bold text-gray-800 dark:text-white">Order Confirmation</h3>
                <button onclick="closeCheckoutModal()" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mb-6">
                <p class="text-gray-600 dark:text-gray-300 mb-4">Your order has been placed successfully!</p>
                <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 class="font-medium text-gray-800 dark:text-white mb-2">Order Summary</h4>
                    <div class="space-y-2">
                        <?php foreach ($cart_items as $item): ?>
                            <div class="flex justify-between">
                                <span class="text-gray-600 dark:text-gray-300"><?php echo htmlspecialchars($item['name']); ?> (<?php echo $item['cart_quantity']; ?> kg)</span>
                                <span class="text-gray-800 dark:text-white">₹<?php echo number_format($item['subtotal'], 2); ?></span>
                            </div>
                        <?php endforeach; ?>
                        <div class="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2 font-bold">
                            <div class="flex justify-between">
                                <span class="text-gray-800 dark:text-white">Total</span>
                                <span class="text-primary-600 dark:text-primary-400">₹<?php echo number_format($cart_total, 2); ?></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end">
                <button onclick="closeCheckoutModal()" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm transition-colors">
                    Done
                </button>
            </div>
        </div>
    </div>

    <script>
        // Toggle cart dropdown
        document.getElementById('cart-button').addEventListener('click', function() {
            document.getElementById('cart-dropdown').classList.toggle('hidden');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            const cartButton = document.getElementById('cart-button');
            const cartDropdown = document.getElementById('cart-dropdown');
            
            if (!cartButton.contains(event.target) && !cartDropdown.contains(event.target)) {
                cartDropdown.classList.add('hidden');
            }
        });

        // Add Crop Modal
        document.getElementById('add-crop-button').addEventListener('click', function() {
            document.getElementById('modal-title').textContent = 'Add New Crop';
            document.getElementById('crop-form').reset();
            document.getElementById('crop-id').value = '';
            document.getElementById('submit-crop').name = 'add_crop';
            document.getElementById('submit-crop').textContent = 'Save Crop';
            document.getElementById('crop-modal').classList.remove('hidden');
        });

        // Close Modal
        document.getElementById('close-modal').addEventListener('click', function() {
            document.getElementById('crop-modal').classList.add('hidden');
        });

        document.getElementById('cancel-crop').addEventListener('click', function() {
            document.getElementById('crop-modal').classList.add('hidden');
        });

        // Edit Crop
        function editCrop(crop) {
            document.getElementById('modal-title').textContent = 'Edit Crop';
            document.getElementById('crop-id').value = crop.id;
            document.getElementById('name').value = crop.name;
            document.getElementById('type').value = crop.type;
            document.getElementById('quantity').value = crop.quantity;
            document.getElementById('price').value = crop.price;
            document.getElementById('region').value = crop.region;
            document.getElementById('description').value = crop.description;
            document.getElementById('submit-crop').name = 'update_crop';
            document.getElementById('submit-crop').textContent = 'Update Crop';
            document.getElementById('crop-modal').classList.remove('hidden');
        }

        // Add to Cart Prompt
        function addToCartPrompt(cropId) {
            document.getElementById('modal-crop-id').value = cropId;
            document.getElementById('cart-quantity').value = 1;
            document.getElementById('add-to-cart-modal').classList.remove('hidden');
        }

        function closeAddToCartModal() {
            document.getElementById('add-to-cart-modal').classList.add('hidden');
        }

        // Checkout
        function checkout() {
            document.getElementById('checkout-modal').classList.remove('hidden');
        }

        function closeCheckoutModal() {
            document.getElementById('checkout-modal').classList.add('hidden');
            // In a real app, you would submit the form here
            window.location.href = 'product_management.php?checkout=success';
        }

        // Dark mode transition
        document.documentElement.classList.add('transition-colors');
        document.documentElement.classList.add('duration-300');
    </script>
</body>
</html>
