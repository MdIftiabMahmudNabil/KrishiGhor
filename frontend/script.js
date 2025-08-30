// Global Variables
let currentLanguage = 'bn';
let voiceRecognition = null;
let isListening = false;
let trackingInterval = null;
let currentTrackingNumber = null;

// Tracking data storage
const trackingDatabase = {
    'KG-2025-001230': {
        status: 'delivered',
        crop: 'ধান',
        quantity: '৫০০ কেজি',
        destination: 'কাওরান বাজার, ঢাকা',
        vehicle: 'ঢাকা-মেট্রো-গ-১২৩৪৫৬',
        driver: 'মোঃ করিম আলী',
        phone: '০১৭১২৩৪৫৬৭৮',
        speed: 0,
        remaining: 0,
        eta: 0,
        progress: 100
    },
    'KG-2025-001231': {
        status: 'in-transit',
        crop: 'আলু',
        quantity: '৩০০ কেজি',
        destination: 'চট্টগ্রাম',
        vehicle: 'চট্ট-গা-১১২২৩৩',
        driver: 'মোঃ রহিম উদ্দিন',
        phone: '০১৮১২৩৪৫৬৭৮',
        speed: 45,
        remaining: 85,
        eta: 120,
        progress: 60
    },
    'KG-2025-001232': {
        status: 'delivered',
        crop: 'টমেটো',
        quantity: '২০০ কেজি',
        destination: 'সিলেট',
        vehicle: 'সিলে-গা-৯৯৮৮৭৭',
        driver: 'মোঃ আহমদ হোসেন',
        phone: '০১৯১২৩৪৫৬৭৮',
        speed: 0,
        remaining: 0,
        eta: 0,
        progress: 100
    }
};

// Market Data
const marketData = {
    dhaka: [
        { name: 'কাওরান বাজার', value: 'kawran', price: 45 },
        { name: 'শাহবাগ বাজার', value: 'shahbag', price: 42 },
        { name: 'ফар্মগেট বাজার', value: 'farmgate', price: 48 },
        { name: 'নিউমার্কেট', value: 'newmarket', price: 50 }
    ],
    chittagong: [
        { name: 'রিয়াজউদ্দিন বাজার', value: 'riazuddin', price: 38 },
        { name: 'চকবাজার', value: 'chokbazar', price: 40 },
        { name: 'কদমতলী বাজার', value: 'kadamtoli', price: 36 }
    ],
    sylhet: [
        { name: 'সুবিদবাজার', value: 'subidbazar', price: 44 },
        { name: 'বন্দরবাজার', value: 'bondorbazar', price: 42 },
        { name: 'আম্বরখানা', value: 'amborkhana', price: 46 }
    ],
    rajshahi: [
        { name: 'সাহেব বাজার', value: 'saheb', price: 35 },
        { name: 'তালাইমারি বাজার', value: 'talaimari', price: 37 },
        { name: 'বরেন্দ্র পার্ক বাজার', value: 'borendro', price: 39 }
    ]
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateLanguageDisplay();
    generateAISuggestions();
    initializeVoiceRecognition();
    setupSearchAutocomplete();
    initializeDemoData();
});

// Initialize App
function initializeApp() {
    document.documentElement.lang = currentLanguage;
    
    const form = document.getElementById('transport-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('change', updateCostEstimation);
        input.addEventListener('input', updateCostEstimation);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    const langToggle = document.querySelector('.language-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }

    // Search input event listener
    const searchInput = document.getElementById('tracking-search');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchTracking();
            }
        });
    }
    
    // District change listener
    const districtSelect = document.getElementById('district');
    if (districtSelect) {
        districtSelect.addEventListener('change', loadMarkets);
    }
}

// Setup Search Autocomplete
function setupSearchAutocomplete() {
    const searchInput = document.getElementById('tracking-search');
    searchInput.addEventListener('input', function(e) {
        const value = e.target.value.toUpperCase();
        if (value.length >= 3) {
            showSearchSuggestions(value);
        } else {
            hideSearchResults();
        }
    });
}

// Show Search Suggestions
function showSearchSuggestions(query) {
    const suggestions = Object.keys(trackingDatabase).filter(trackingNum => 
        trackingNum.includes(query)
    );

    if (suggestions.length > 0) {
        displaySearchResults(suggestions);
    } else {
        hideSearchResults();
    }
}

// Search Tracking Function
function searchTracking() {
    const searchInput = document.getElementById('tracking-search');
    const trackingNumber = searchInput.value.trim().toUpperCase();
    
    if (!trackingNumber) {
        showNotification(
            currentLanguage === 'bn' 
                ? 'ট্র্যাকিং নম্বর লিখুন' 
                : 'Please enter tracking number',
            'error'
        );
        return;
    }

    showLoading();

    // Simulate API call delay
    setTimeout(() => {
        hideLoading();
        
        if (trackingDatabase[trackingNumber]) {
            displayTrackingInfo(trackingNumber);
            hideSearchResults();
        } else {
            showNotification(
                currentLanguage === 'bn' 
                    ? 'ট্র্যাকিং নম্বর পাওয়া যায়নি' 
                    : 'Tracking number not found',
                'error'
            );
            displaySearchResults([]);
        }
    }, 1500);
}

// Display Search Results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-result-item" style="text-align: center; color: var(--light-text);">
                <p>${currentLanguage === 'bn' ? 'কোন ট্র্যাকিং নম্বর পাওয়া যায়নি' : 'No tracking numbers found'}</p>
            </div>
        `;
    } else {
        results.forEach(trackingNum => {
            const data = trackingDatabase[trackingNum];
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.onclick = () => {
                document.getElementById('tracking-search').value = trackingNum;
                displayTrackingInfo(trackingNum);
                hideSearchResults();
            };
            
            resultItem.innerHTML = `
                <div class="result-header">
                    <span class="tracking-number">${trackingNum}</span>
                    <span class="result-status ${data.status}">${getStatusText(data.status)}</span>
                </div>
                <div class="result-details">
                    ${data.crop} - ${data.quantity} → ${data.destination}
                </div>
            `;
            resultsContainer.appendChild(resultItem);
        });
    }

    resultsContainer.classList.add('show');
}

// Hide Search Results
function hideSearchResults() {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.classList.remove('show');
}

// Handle Search Input
function handleSearchInput(e) {
    const value = e.target.value;
    
    // Auto format tracking number
    if (value.length <= 15) {
        let formatted = value.toUpperCase().replace(/[^A-Z0-9-]/g, '');
        if (formatted.length >= 2 && !formatted.startsWith('KG-')) {
            formatted = 'KG-' + formatted;
        }
        if (formatted !== value) {
            e.target.value = formatted;
        }
    }
}

// Display Tracking Information
function displayTrackingInfo(trackingNumber) {
    const data = trackingDatabase[trackingNumber];
    currentTrackingNumber = trackingNumber;

    // Update tracking number display
    document.getElementById('tracking-number-value').textContent = trackingNumber;
    document.getElementById('tracking-number-display').style.display = 'block';

    // Update vehicle info
    document.getElementById('vehicle-number').textContent = data.vehicle;
    document.getElementById('driver-name').textContent = data.driver;
    document.getElementById('driver-phone').textContent = data.phone;
    document.getElementById('vehicle-info').style.display = 'block';

    // Update status
    updateTrackingStatus(data.status);
    
    // Update live tracking
    if (data.status === 'in-transit') {
        startLiveTracking(data);
    } else if (data.status === 'delivered') {
        showDeliveredStatus();
    } else {
        showPendingStatus();
    }

    // Update progress steps
    updateProgressSteps(data);

    // Show success message
    showNotification(
        currentLanguage === 'bn' 
            ? 'ট্র্যাকিং তথ্য লোড হয়েছে' 
            : 'Tracking information loaded'
    );
}

// Start Live Tracking
function startLiveTracking(data) {
    // Show live map
    document.getElementById('map-placeholder').style.display = 'none';
    document.getElementById('live-map').style.display = 'block';

    // Update vehicle status
    updateVehicleStatus(data.speed, data.remaining, data.eta);

    // Start real-time updates
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }

    trackingInterval = setInterval(() => {
        updateLiveTrackingData(data);
    }, 5000);
}

// Update Live Tracking Data
function updateLiveTrackingData(data) {
    // Simulate real-time updates
    const speedVariation = (Math.random() - 0.5) * 10;
    const newSpeed = Math.max(0, Math.min(80, data.speed + speedVariation));
    
    const progressDecrement = Math.random() * 2;
    data.remaining = Math.max(0, data.remaining - progressDecrement);
    data.eta = Math.max(0, data.eta - (progressDecrement / newSpeed * 60));

    updateVehicleStatus(Math.round(newSpeed), Math.round(data.remaining), Math.round(data.eta));

    // Check if delivered
    if (data.remaining <= 0) {
        data.status = 'delivered';
        showDeliveredStatus();
        clearInterval(trackingInterval);
    }
}

// Update Vehicle Status
function updateVehicleStatus(speed, remaining, eta) {
    const speedUnit = currentLanguage === 'bn' ? 'কিমি/ঘন্টা' : 'km/h';
    const distanceUnit = currentLanguage === 'bn' ? 'কিমি বাকি' : 'km left';
    const timeUnit = currentLanguage === 'bn' ? 'মিনিট' : 'minutes';

    document.getElementById('vehicle-speed').textContent = `${speed} ${speedUnit}`;
    document.getElementById('remaining-distance').textContent = `${remaining} ${distanceUnit}`;
    document.getElementById('remaining-time').textContent = `${eta} ${timeUnit}`;
}

// Update Tracking Status
function updateTrackingStatus(status) {
    const statusDot = document.getElementById('main-status-dot');
    const statusText = document.getElementById('main-status-text');
    
    statusDot.className = 'status-dot';
    
    switch (status) {
        case 'pending':
            statusDot.classList.add('warning');
            statusText.textContent = currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending';
            break;
        case 'in-transit':
            statusDot.classList.add('active');
            statusText.textContent = currentLanguage === 'bn' ? 'পরিবহনে' : 'In Transit';
            break;
        case 'delivered':
            statusDot.style.background = 'var(--success-color)';
            statusText.textContent = currentLanguage === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered';
            break;
    }
}

// Update Progress Steps
function updateProgressSteps(data) {
    const currentTime = new Date();
    const steps = ['step-pickup', 'step-transit', 'step-delivery'];
    
    // Reset all steps
    steps.forEach(stepId => {
        const step = document.getElementById(stepId);
        step.className = 'progress-step';
    });

    // Update based on status
    if (data.status === 'delivered') {
        steps.forEach(stepId => {
            document.getElementById(stepId).classList.add('completed');
        });
        
        document.getElementById('pickup-time').textContent = '১০:৩০ AM';
        document.getElementById('transit-time').textContent = '১১:১৫ AM';
        document.getElementById('delivery-time').textContent = '১২:৩০ PM';
    } else if (data.status === 'in-transit') {
        document.getElementById('step-pickup').classList.add('completed');
        document.getElementById('step-transit').classList.add('active');
        
        document.getElementById('pickup-time').textContent = '১০:৩০ AM';
        document.getElementById('transit-time').textContent = 'চলমান';
        document.getElementById('delivery-time').textContent = `আনুমানিক: ${Math.round(data.eta)} মিনিট`;
    } else {
        document.getElementById('step-pickup').classList.add('active');
        document.getElementById('pickup-time').textContent = 'অপেক্ষারত';
    }
}

// Show Delivered Status
function showDeliveredStatus() {
    document.getElementById('map-placeholder').style.display = 'none';
    const liveMap = document.getElementById('live-map');
    liveMap.style.display = 'block';
    
    // Stop truck animation
    const truck = liveMap.querySelector('.truck-marker');
    truck.style.animation = 'none';
    truck.style.left = '85%';
    truck.style.top = '45%';
    truck.style.background = 'var(--success-color)';

    updateVehicleStatus(0, 0, 0);
    
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
}

// Show Pending Status
function showPendingStatus() {
    document.getElementById('map-placeholder').style.display = 'flex';
    document.getElementById('live-map').style.display = 'none';
    
    const placeholder = document.getElementById('map-placeholder');
    placeholder.innerHTML = `
        <i class="fas fa-clock"></i>
        <p>${currentLanguage === 'bn' ? 'পিকআপের জন্য অপেক্ষারত...' : 'Waiting for pickup...'}</p>
    `;
}

// Load Markets based on District
function loadMarkets() {
    const districtSelect = document.getElementById('district');
    const marketSelect = document.getElementById('market');
    const selectedDistrict = districtSelect.value;
    
    marketSelect.innerHTML = '';
    
    if (selectedDistrict && marketData[selectedDistrict]) {
        const markets = marketData[selectedDistrict];
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = currentLanguage === 'bn' ? 'বাজার নির্বাচন করুন' : 'Select Market';
        marketSelect.appendChild(defaultOption);
        
        markets.forEach(market => {
            const option = document.createElement('option');
            option.value = market.value;
            option.textContent = market.name;
            option.dataset.price = market.price;
            marketSelect.appendChild(option);
        });
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = currentLanguage === 'bn' ? 'প্রথমে জেলা নির্বাচন করুন' : 'Select district first';
        marketSelect.appendChild(defaultOption);
    }
    
    updateCostEstimation();
}

// Update Cost Estimation
function updateCostEstimation() {
    const origin = document.getElementById('origin').value;
    const district = document.getElementById('district').value;
    const market = document.getElementById('market').value;
    const quantity = parseFloat(document.getElementById('quantity').value) || 0;
    const vehicleType = document.getElementById('vehicle-type').value;
    
    if (origin && district && market && quantity > 0 && vehicleType) {
        const baseDistance = getDistanceEstimate(district);
        const distance = baseDistance + Math.random() * 10;
        
        const baseCostPerKm = 5;
        const vehicleMultiplier = vehicleType === 'truck' ? 1.2 : 1.0;
        const weightMultiplier = Math.ceil(quantity / 100) * 0.1 + 1;
        
        const transportCost = Math.round(distance * baseCostPerKm * vehicleMultiplier * weightMultiplier);
        const totalCost = transportCost;
        
        const eta = calculateETA(distance, vehicleType);
        
        document.getElementById('distance').textContent = `${distance.toFixed(1)} ${currentLanguage === 'bn' ? 'কিমি' : 'km'}`;
        document.getElementById('transport-cost').textContent = `৳ ${transportCost}`;
        document.getElementById('total-cost').textContent = `৳ ${totalCost}`;
        document.getElementById('eta').textContent = `${eta} ${currentLanguage === 'bn' ? 'মিনিট' : 'minutes'}`;
        
        document.getElementById('cost-estimate').style.display = 'block';
    } else {
        document.getElementById('cost-estimate').style.display = 'none';
    }
}

// Get Distance Estimate
function getDistanceEstimate(district) {
    const distances = {
        'dhaka': 25,
        'chittagong': 180,
        'sylhet': 220,
        'rajshahi': 160
    };
    return distances[district] || 50;
}

// Calculate ETA using ML simulation
function calculateETA(distance, vehicleType) {
    const baseSpeed = vehicleType === 'truck' ? 45 : 55;
    const trafficFactor = 0.7 + Math.random() * 0.3;
    const weatherFactor = 0.9 + Math.random() * 0.1;
    
    const adjustedSpeed = baseSpeed * trafficFactor * weatherFactor;
    const timeInHours = distance / adjustedSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);
    
    return timeInMinutes;
}

// Generate AI Suggestions
function generateAISuggestions() {
    const suggestionsContainer = document.querySelector('.suggestion-cards');
    const suggestions = [
        {
            bn: '🏆 সর্বোচ্চ দাম: কাওরান বাজার (৳৫০/কেজি)',
            en: '🏆 Highest Price: Kawran Bazar (৳50/kg)'
        },
        {
            bn: '🚛 দ্রুততম পরিবহন: ট্রাক (২৫ মিনিট)',
            en: '🚛 Fastest Transport: Truck (25 minutes)'
        },
        {
            bn: '💰 সাশ্রয়ী বিকল্প: সাহেব বাজার, রাজশাহী',
            en: '💰 Cost-effective: Saheb Bazar, Rajshahi'
        }
    ];
    
    suggestionsContainer.innerHTML = '';
    suggestions.forEach(suggestion => {
        const card = document.createElement('div');
        card.className = 'suggestion-card';
        card.textContent = currentLanguage === 'bn' ? suggestion.bn : suggestion.en;
        card.addEventListener('click', () => applySuggestion(suggestion));
        suggestionsContainer.appendChild(card);
    });
}

// Apply AI Suggestion
function applySuggestion(suggestion) {
    showNotification(currentLanguage === 'bn' ? 'সুপারিশ প্রয়োগ করা হয়েছে' : 'Suggestion applied');
}

// Handle Form Submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    showLoading();
    
    // Generate new tracking number
    const newTrackingNumber = generateTrackingNumber();
    
    setTimeout(() => {
        hideLoading();
        
        // Create new tracking entry
        const formData = new FormData(e.target);
        const newTracking = {
            status: 'pending',
            crop: document.getElementById('crop-type').selectedOptions[0].textContent,
            quantity: formData.get('quantity') + ' কেজি',
            destination: document.getElementById('market').selectedOptions[0].textContent + ', ' + 
                        document.getElementById('district').selectedOptions[0].textContent,
            vehicle: 'ঢাকা-মেট্রো-গ-' + Math.floor(Math.random() * 900000 + 100000),
            driver: 'মোঃ ' + ['করিম', 'রহিম', 'সালাম', 'জামাল'][Math.floor(Math.random() * 4)] + ' আলী',
            phone: '০১৭' + Math.floor(Math.random() * 90000000 + 10000000),
            speed: 0,
            remaining: 0,
            eta: 0,
            progress: 0
        };
        
        trackingDatabase[newTrackingNumber] = newTracking;
        
        // Show tracking number
        displayTrackingInfo(newTrackingNumber);
        
        // Add to recent orders
        addToRecentOrders(newTrackingNumber, newTracking);
        
        showNotification(
            currentLanguage === 'bn' 
                ? 'পরিবহন অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!' 
                : 'Transport request submitted successfully!'
        );
        
        document.getElementById('transport-form').reset();
        updateCostEstimation();
        
        // Start pickup simulation after 3 seconds
        setTimeout(() => {
            newTracking.status = 'in-transit';
            newTracking.speed = 45;
            newTracking.remaining = getDistanceEstimate(document.getElementById('district').value);
            newTracking.eta = calculateETA(newTracking.remaining, 'truck');
            displayTrackingInfo(newTrackingNumber);
        }, 3000);
    }, 2000);
}

// Generate New Tracking Number
function generateTrackingNumber() {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000;
    return `KG-${year}-${randomNum}`;
}

// Add to Recent Orders
function addToRecentOrders(trackingNumber, data) {
    const ordersList = document.getElementById('orders-list');
    const newOrder = document.createElement('div');
    newOrder.className = 'order-item';
    
    const statusClass = data.status === 'delivered' ? 'delivered' : 'in-transit';
    const statusText = getStatusText(data.status);
    
    newOrder.innerHTML = `
        <div class="order-info">
            <h4>${data.crop} - ${data.quantity}</h4>
            <p><span data-bn="গন্তব্য:" data-en="Destination:">গন্তব্য:</span> ${data.destination}</p>
            <p><span data-bn="ট্র্যাকিং:" data-en="Tracking:">ট্র্যাকিং:</span> ${trackingNumber}</p>
            <span class="order-date">${new Date().toLocaleDateString('bn-BD')}</span>
        </div>
        <div class="order-status">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <span class="order-cost">৳ ${Math.floor(Math.random() * 500 + 300)}</span>
        </div>
    `;
    
    ordersList.insertBefore(newOrder, ordersList.firstChild);
}

// Get Status Text
function getStatusText(status) {
    const statusTexts = {
        'pending': currentLanguage === 'bn' ? 'অপেক্ষারত' : 'Pending',
        'in-transit': currentLanguage === 'bn' ? 'পরিবহনে' : 'In Transit',
        'delivered': currentLanguage === 'bn' ? 'ডেলিভারি সম্পন্ন' : 'Delivered'
    };
    return statusTexts[status] || status;
}

// Language Toggle Function
function toggleLanguage() {
    currentLanguage = currentLanguage === 'bn' ? 'en' : 'bn';
    document.documentElement.lang = currentLanguage;
    
    if (currentLanguage === 'en') {
        document.body.classList.add('english');
    } else {
        document.body.classList.remove('english');
    }
    
    updateLanguageDisplay();
    updateLanguageButton();
    
    // Refresh current tracking info if any
    if (currentTrackingNumber) {
        displayTrackingInfo(currentTrackingNumber);
    }
}

// Update Language Display
function updateLanguageDisplay() {
    const elements = document.querySelectorAll('[data-bn][data-en]');
    elements.forEach(element => {
        const text = currentLanguage === 'bn' ? element.dataset.bn : element.dataset.en;
        if (element.tagName === 'INPUT' || element.tagName === 'SELECT') {
            element.placeholder = text;
        } else {
            element.textContent = text;
        }
    });
    
    updateSelectOptions();
    generateAISuggestions();
}

// Update Language Button
function updateLanguageButton() {
    const langText = document.getElementById('lang-text');
    if (langText) {
        langText.textContent = currentLanguage === 'bn' ? 'English' : 'বাংলা';
    }
}

// Update Select Options
function updateSelectOptions() {
    const selects = document.querySelectorAll('select option[data-bn][data-en]');
    selects.forEach(option => {
        const text = currentLanguage === 'bn' ? option.dataset.bn : option.dataset.en;
        option.textContent = text;
    });
}

// Utility Functions
function showLoading() {
    document.getElementById('loading').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize demo data for development
function initializeDemoData() {
    // Add some sample tracking numbers for testing
    const sampleTrackings = ['KG-2025-001233', 'KG-2025-001234', 'KG-2025-001235'];
    
    sampleTrackings.forEach((trackingNum, index) => {
        if (!trackingDatabase[trackingNum]) {
            trackingDatabase[trackingNum] = {
                status: ['pending', 'in-transit', 'delivered'][index % 3],
                crop: ['পেঁয়াজ', 'গম', 'ভুট্টা'][index % 3],
                quantity: `${(index + 1) * 100} কেজি`,
                destination: ['নিউমার্কেট, ঢাকা', 'সুবিদবাজার, সিলেট', 'সাহেব বাজার, রাজশাহী'][index % 3],
                vehicle: `ঢাকা-মেট্রো-গ-${123456 + index}`,
                driver: `মোঃ ${['জামাল', 'কামাল', 'শামাল'][index % 3]} হোসেন`,
                phone: `০১৭${12345678 + index}`,
                speed: [0, 45, 0][index % 3],
                remaining: [0, 75, 0][index % 3],
                eta: [0, 95, 0][index % 3],
                progress: [0, 45, 100][index % 3]
            };
        }
    });
}


// Updated searchTracking function with API integration
function searchTracking() {
    const searchInput = document.getElementById('tracking-search');
    const trackingNumber = searchInput.value.trim().toUpperCase();
    
    if (!trackingNumber) {
        showNotification(
            currentLanguage === 'bn' 
                ? 'ট্র্যাকিং নম্বর লিখুন' 
                : 'Please enter tracking number',
            'error'
        );
        return;
    }

    showLoading();
    
    // API call to Django backend
    fetch(`/api/tracking/${trackingNumber}/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Tracking number not found');
            }
            return response.json();
        })
        .then(data => {
            hideLoading();
            displayTrackingInfo(data);
            hideSearchResults();
        })
        .catch(error => {
            hideLoading();
            showNotification(
                currentLanguage === 'bn' 
                    ? 'ট্র্যাকিং নম্বর পাওয়া যায়নি' 
                    : 'Tracking number not found',
                'error'
            );
            displaySearchResults([]);
        });
}