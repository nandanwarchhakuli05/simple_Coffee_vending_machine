// ==================== STATE MANAGEMENT ====================
// Stock levels - Initial inventory
let stock = {
    teaPowder:0,      // in grams
    coffeePowder: 100,   // in grams
    sugar: 200,          // in grams
    milk: 2000,          // in milliliters
    cups: 50             // number of cups
};

// Sales tracking - Daily sales data
let sales = {
    teaSold: 0,          // total tea cups sold
    coffeeSold: 0,       // total coffee cups sold
    totalRevenue: 0,     // total money earned
    totalCost: 0         // total making cost
};

// Current order state - Tracks user's current selection
let currentOrder = {
    drink: null,         // 'tea' or 'coffee'
    withSugar: true,     // sugar preference
    price: 0,            // selling price
    cost: 0              // making cost
};

// ==================== PRICING CONSTANTS ====================
// Fixed prices for selling and making cost
const PRICES = {
    tea: { 
        selling: 15,     // selling price per cup
        cost: 8          // making cost per cup
    },
    coffee: { 
        selling: 20,     // selling price per cup
        cost: 12         // making cost per cup
    }
};

// ==================== INGREDIENT REQUIREMENTS ====================
// Ingredient quantities required per cup
const INGREDIENTS = {
    tea: { 
        teaPowder: 5,    // grams
        milk: 50,        // ml
        cups: 1          // number
    },
    coffee: { 
        coffeePowder: 7, // grams
        milk: 50,        // ml
        cups: 1          // number
    },
    sugar: 10            // grams per cup (when sugar is selected)
};

// ==================== MENU SELECTION ====================
/**
 * Handles drink selection from menu
 * @param {string} drinkType - 'tea' or 'coffee'
 */
function selectDrink(drinkType) {
    // Update current order with selected drink
    currentOrder.drink = drinkType;
    currentOrder.price = PRICES[drinkType].selling;
    currentOrder.cost = PRICES[drinkType].cost;

    // Update UI - highlight selected menu item
    document.getElementById('menu-tea').classList.remove('selected');
    document.getElementById('menu-coffee').classList.remove('selected');
    document.getElementById('menu-' + drinkType).classList.add('selected');

    // Update order summary display
    updateOrderSummary();

    // Enable the order button
    document.getElementById('order-btn').disabled = false;

    // Update status message
    updateStatus('idle', '🛒', 'Selection Updated', 'Click "Order & Pay Now" to proceed');
}

// ==================== SUGAR CUSTOMIZATION ====================
/**
 * Handles sugar preference toggle
 * @param {boolean} withSugar - true for with sugar, false for without
 */
function toggleSugar(withSugar) {
    currentOrder.withSugar = withSugar;

    // Update button active states
    document.getElementById('sugar-yes').classList.toggle('active', withSugar);
    document.getElementById('sugar-no').classList.toggle('active', !withSugar);

    // Update order summary
    updateOrderSummary();
}

// ==================== ORDER SUMMARY UPDATE ====================
/**
 * Updates the order summary display with current selections
 */
function updateOrderSummary() {
    // Format drink name for display
    const drinkName = currentOrder.drink ? 
        (currentOrder.drink === 'tea' ? 'Tea' : 'Coffee') : 'None';
    
    // Format sugar preference
    const sugarText = currentOrder.withSugar ? 'With Sugar' : 'Without Sugar';

    // Update DOM elements
    document.getElementById('selected-drink').textContent = drinkName;
    document.getElementById('selected-sugar').textContent = sugarText;
    document.getElementById('total-amount').textContent = '₹' + currentOrder.price;
}

// ==================== STOCK VALIDATION ====================
/**
 * Validates if sufficient stock is available for current order
 * @returns {string|null} Error message if stock insufficient, null if OK
 */
function validateStock() {
    // Check if drink is selected
    if (!currentOrder.drink) {
        return 'Please select a drink first';
    }

    const drink = currentOrder.drink;
    const ingredients = INGREDIENTS[drink];

    // Check drink powder availability
    if (drink === 'tea' && stock.teaPowder < ingredients.teaPowder) {
        return 'Insufficient tea powder!';
    }
    if (drink === 'coffee' && stock.coffeePowder < ingredients.coffeePowder) {
        return 'Insufficient coffee powder!';
    }

    // Check sugar availability (only if user wants sugar)
    if (currentOrder.withSugar && stock.sugar < INGREDIENTS.sugar) {
        return 'Insufficient sugar!';
    }

    // Check milk availability
    if (stock.milk < ingredients.milk) {
        return 'Insufficient milk!';
    }

    // Check cups availability
    if (stock.cups < ingredients.cups) {
        return 'Insufficient cups!';
    }

    return null; // All stock checks passed
}

// ==================== ORDER PROCESSING ====================
/**
 * Main function to process the order through multiple stages
 */
function processOrder() {
    // Validate stock availability
    const error = validateStock();
    if (error) {
        updateStatus('error', '❌', 'Order Failed', error);
        return;
    }

    // Disable order button to prevent multiple clicks
    document.getElementById('order-btn').disabled = true;

    const drinkName = currentOrder.drink === 'tea' ? 'Tea' : 'Coffee';
    
    // Stage 1: Payment Processing (1.5 seconds)
    updateStatus('preparing', '💳', 'Processing Payment...', 
        'Amount: ₹' + currentOrder.price);

    setTimeout(() => {
        // Stage 2: Payment Confirmed (1 second)
        updateStatus('preparing', '✅', 'Payment Confirmed', 
            'Starting preparation...');

        setTimeout(() => {
            // Stage 3: Grinding/Brewing (1.5 seconds)
            const grindText = currentOrder.drink === 'tea' ? 
                'Steeping tea leaves...' : 'Grinding coffee beans...';
            updateStatus('preparing', '⚙️', 'Preparing Your ' + drinkName, grindText);

            setTimeout(() => {
                // Stage 4: Adding Milk (1.5 seconds)
                updateStatus('preparing', '🥛', 'Adding Milk', 
                    'Heating and mixing...');

                setTimeout(() => {
                    // Stage 5: Adding Sugar (conditional - 1 second)
                    if (currentOrder.withSugar) {
                        updateStatus('preparing', '🍬', 'Adding Sugar', 
                            'Sweetening your beverage...');
                        
                        setTimeout(() => continuePreparation(), 1000);
                    } else {
                        continuePreparation();
                    }
                }, 1500);
            }, 1500);
        }, 1000);
    }, 1500);
}

// ==================== CONTINUE PREPARATION ====================
/**
 * Continues preparation after all ingredients are added
 * Handles final stages: pouring, stock deduction, and completion
 */
function continuePreparation() {
    const drinkName = currentOrder.drink === 'tea' ? 'tea' : 'coffee';
    
    // Stage 6: Pouring Into Cup (1.5 seconds)
    updateStatus('preparing', '☕', 'Pouring Into Cup', 
        'Almost ready...');

    setTimeout(() => {
        // Deduct stock based on order
        const drink = currentOrder.drink;
        const ingredients = INGREDIENTS[drink];

        // Reduce drink powder
        if (drink === 'tea') {
            stock.teaPowder -= ingredients.teaPowder;
        } else {
            stock.coffeePowder -= ingredients.coffeePowder;
        }

        // Reduce sugar if selected
        if (currentOrder.withSugar) {
            stock.sugar -= INGREDIENTS.sugar;
        }

        // Reduce common ingredients
        stock.milk -= ingredients.milk;
        stock.cups -= ingredients.cups;

        // Update sales statistics
        if (drink === 'tea') {
            sales.teaSold++;
        } else {
            sales.coffeeSold++;
        }
        sales.totalRevenue += currentOrder.price;
        sales.totalCost += currentOrder.cost;

        // Refresh all display values
        updateStockDisplay();
        updateSalesDisplay();

        // Stage 7: Ready for Pickup (4 seconds)
        updateStatus('ready', '🎉', 
            'Your ' + drinkName.charAt(0).toUpperCase() + drinkName.slice(1) + ' is Ready!', 
            'Please collect your beverage from the dispenser');

        // Auto-complete after 4 seconds
        setTimeout(() => {
            // Stage 8: Thank You Message (3 seconds)
            updateStatus('success', '😊', 'Thank You!', 
                'Enjoy your beverage. Have a great day!');

            // Auto-reset after 3 more seconds
            setTimeout(() => {
                clearOrder();
            }, 3000);
        }, 4000);
    }, 1500);
}

// ==================== DRINK READY NOTIFICATION ====================
/**
 * Shows a prominent notification when drink is ready
 * @param {string} drinkName - Name of the drink (tea or coffee)
 * @param {boolean} withSugar - Whether sugar was added
 */
function showDrinkReadyNotification(drinkName, withSugar) {
    const notification = document.getElementById('drink-ready-notification');
    const drinkInfo = document.getElementById('ready-drink-info');
    
    // Format drink info
    const sugarText = withSugar ? 'with Sugar' : 'without Sugar';
    const drinkText = drinkName.charAt(0).toUpperCase() + drinkName.slice(1);
    
    drinkInfo.textContent = `${drinkText} ${sugarText}`;
    
    // Show notification
    notification.classList.remove('hidden');
    
    // Hide notification after 3.5 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3500);
}

// ==================== STATUS UPDATE ====================
/**
 * Updates the status area with new message and styling
 * @param {string} type - Status type: 'idle', 'preparing', 'ready', 'error', 'success'
 * @param {string} icon - Emoji icon to display
 * @param {string} text - Main status text
 * @param {string} subtext - Additional status information
 */
function updateStatus(type, icon, text, subtext) {
    const statusArea = document.getElementById('status-area');
    
    // Remove all existing status classes
    statusArea.className = 'status-area';
    // Add new status class
    statusArea.classList.add('status-' + type);

    // Update content
    document.getElementById('status-icon').textContent = icon;
    document.getElementById('status-text').textContent = text;
    document.getElementById('status-subtext').textContent = subtext;
}

// ==================== CLEAR ORDER ====================
/**
 * Resets the order to initial state
 * Clears all selections and resets UI
 */
function clearOrder() {
    // Reset order state to default
    currentOrder = {
        drink: null,
        withSugar: true,
        price: 0,
        cost: 0
    };

    // Reset menu selection UI
    document.getElementById('menu-tea').classList.remove('selected');
    document.getElementById('menu-coffee').classList.remove('selected');
    
    // Reset sugar selection UI
    document.getElementById('sugar-yes').classList.add('active');
    document.getElementById('sugar-no').classList.remove('active');
    
    // Disable order button
    document.getElementById('order-btn').disabled = true;

    // Reset order summary display
    document.getElementById('selected-drink').textContent = 'None';
    document.getElementById('selected-sugar').textContent = 'With Sugar';
    document.getElementById('total-amount').textContent = '₹0';

    // Reset status to idle
    updateStatus('idle', '🛒', 'Ready to Serve', 'Select a drink from the menu to begin');
}

// ==================== STOCK MONITORING ====================
/**
 * Check stock levels and display alerts for low or empty stock
 */
function checkStockLevels() {
    const alerts = [];
    
    // Define thresholds
    const LOW_STOCK_THRESHOLD = 20; // 20% of initial stock
    const CRITICAL_STOCK_THRESHOLD = 10; // 10% of initial stock
    
    // Check tea powder (initial: 100g)
    if (stock.teaPowder === 0) {
        alerts.push({
            type: 'critical',
            icon: '🚨',
            title: 'Tea Powder Empty!',
            message: 'Tea powder is completely out of stock. Please refill immediately to serve tea.'
        });
    } else if (stock.teaPowder <= CRITICAL_STOCK_THRESHOLD) {
        alerts.push({
            type: 'critical',
            icon: '⚠️',
            title: 'Tea Powder Critical!',
            message: `Only ${stock.teaPowder}g remaining. Urgent refill needed.`
        });
    } else if (stock.teaPowder <= LOW_STOCK_THRESHOLD) {
        alerts.push({
            type: 'warning',
            icon: '⚡',
            title: 'Tea Powder Low',
            message: `Tea powder is running low (${stock.teaPowder}g remaining). Please refill soon.`
        });
    }
    
    // Check coffee powder (initial: 100g)
    if (stock.coffeePowder === 0) {
        alerts.push({
            type: 'critical',
            icon: '🚨',
            title: 'Coffee Powder Empty!',
            message: 'Coffee powder is completely out of stock. Please refill immediately to serve coffee.'
        });
    } else if (stock.coffeePowder <= CRITICAL_STOCK_THRESHOLD) {
        alerts.push({
            type: 'critical',
            icon: '⚠️',
            title: 'Coffee Powder Critical!',
            message: `Only ${stock.coffeePowder}g remaining. Urgent refill needed.`
        });
    } else if (stock.coffeePowder <= LOW_STOCK_THRESHOLD) {
        alerts.push({
            type: 'warning',
            icon: '⚡',
            title: 'Coffee Powder Low',
            message: `Coffee powder is running low (${stock.coffeePowder}g remaining). Please refill soon.`
        });
    }
    
    // Check sugar (initial: 200g)
    if (stock.sugar === 0) {
        alerts.push({
            type: 'critical',
            icon: '🚨',
            title: 'Sugar Empty!',
            message: 'Sugar is completely out of stock. Cannot serve beverages with sugar.'
        });
    } else if (stock.sugar <= LOW_STOCK_THRESHOLD) {
        alerts.push({
            type: 'critical',
            icon: '⚠️',
            title: 'Sugar Critical!',
            message: `Only ${stock.sugar}g remaining. Urgent refill needed.`
        });
    } else if (stock.sugar <= 40) {
        alerts.push({
            type: 'warning',
            icon: '⚡',
            title: 'Sugar Low',
            message: `Sugar is running low (${stock.sugar}g remaining). Please refill soon.`
        });
    }
    
    // Check milk (initial: 2000ml)
    if (stock.milk === 0) {
        alerts.push({
            type: 'critical',
            icon: '🚨',
            title: 'Milk Empty!',
            message: 'Milk is completely out of stock. Please refill immediately.'
        });
    } else if (stock.milk <= 200) {
        alerts.push({
            type: 'critical',
            icon: '⚠️',
            title: 'Milk Critical!',
            message: `Only ${stock.milk}ml remaining. Urgent refill needed.`
        });
    } else if (stock.milk <= 400) {
        alerts.push({
            type: 'warning',
            icon: '⚡',
            title: 'Milk Low',
            message: `Milk is running low (${stock.milk}ml remaining). Please refill soon.`
        });
    }
    
    // Check cups (initial: 50)
    if (stock.cups === 0) {
        alerts.push({
            type: 'critical',
            icon: '🚨',
            title: 'Cups Empty!',
            message: 'No cups available. Please refill immediately to serve beverages.'
        });
    } else if (stock.cups <= 5) {
        alerts.push({
            type: 'critical',
            icon: '⚠️',
            title: 'Cups Critical!',
            message: `Only ${stock.cups} cups remaining. Urgent refill needed.`
        });
    } else if (stock.cups <= 10) {
        alerts.push({
            type: 'warning',
            icon: '⚡',
            title: 'Cups Low',
            message: `Cups are running low (${stock.cups} remaining). Please refill soon.`
        });
    }
    
    // Display alerts
    displayStockAlerts(alerts);
}

/**
 * Display stock alerts on the page
 * @param {Array} alerts - Array of alert objects
 */
function displayStockAlerts(alerts) {
    const alertContainer = document.getElementById('stock-alerts');
    
    if (alerts.length === 0) {
        alertContainer.innerHTML = '';
        alertContainer.classList.remove('stock-alerts-container');
        return;
    }
    
    alertContainer.classList.add('stock-alerts-container');
    
    let alertsHTML = '';
    alerts.forEach(alert => {
        alertsHTML += `
            <div class="stock-alert ${alert.type}">
                <div class="stock-alert-icon">${alert.icon}</div>
                <div class="stock-alert-content">
                    <div class="stock-alert-title">${alert.title}</div>
                    <div class="stock-alert-message">${alert.message}</div>
                </div>
            </div>
        `;
    });
    
    alertContainer.innerHTML = alertsHTML;
}

// ==================== DISPLAY UPDATES ====================
/**
 * Updates the stock display with current values
 */
function updateStockDisplay() {
    document.getElementById('stock-tea').textContent = stock.teaPowder + ' g';
    document.getElementById('stock-coffee').textContent = stock.coffeePowder + ' g';
    document.getElementById('stock-sugar').textContent = stock.sugar + ' g';
    document.getElementById('stock-milk').textContent = stock.milk + ' ml';
    document.getElementById('stock-cups').textContent = stock.cups + ' pcs';
    
    // Check and display stock level alerts
    checkStockLevels();
}

/**
 * Updates the sales display with current values
 * Also calculates and displays profit
 */
function updateSalesDisplay() {
    document.getElementById('sales-tea').textContent = sales.teaSold + ' cups';
    document.getElementById('sales-coffee').textContent = sales.coffeeSold + ' cups';
    document.getElementById('sales-revenue').textContent = '₹' + sales.totalRevenue;
    document.getElementById('sales-cost').textContent = '₹' + sales.totalCost;

    // Calculate and display profit
    const profit = sales.totalRevenue - sales.totalCost;
    document.getElementById('profit').textContent = '₹' + profit;
}

// ==================== INITIALIZATION ====================
// Initialize displays when page loads
updateStockDisplay();
updateSalesDisplay();