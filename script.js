
let stock = {
    teaPowder:10,      
    coffeePowder: 100,   
    sugar: 200,          
    milk: 2000,          
    cups: 50             
};


let sales = {
    teaSold: 0,          
    coffeeSold: 0,       
    totalRevenue: 0,     
    totalCost: 0         
};


let currentOrder = {
    drink: null,         
    withSugar: true,     
    price: 0,            
    cost: 0              
};


const PRICES = {
    tea: { 
        selling: 15,     
        cost: 8          
    },
    coffee: { 
        selling: 20,     
        cost: 12         
    }
};

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
    updateStatus('idle', 'Selection Updated', 'Click "Order & Pay Now" to proceed');
}

function toggleSugar(withSugar) {
    currentOrder.withSugar = withSugar;

    
    document.getElementById('sugar-yes').classList.toggle('active', withSugar);
    document.getElementById('sugar-no').classList.toggle('active', !withSugar);

    // Update order summary
    updateOrderSummary();
}


function updateOrderSummary() {
    
    const drinkName = currentOrder.drink ? 
        (currentOrder.drink === 'tea' ? 'Tea' : 'Coffee') : 'None';
    
   
    const sugarText = currentOrder.withSugar ? 'With Sugar' : 'Without Sugar';

    
    document.getElementById('selected-drink').textContent = drinkName;
    document.getElementById('selected-sugar').textContent = sugarText;
    document.getElementById('total-amount').textContent = '₹' + currentOrder.price;
}


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

    
    if (stock.cups < ingredients.cups) {
        return 'Insufficient cups!';
    }

    return null; 
}


function processOrder() {
    
    const error = validateStock();
    if (error) {
        updateStatus('error', '❌', 'Order Failed', error);
        return;
    }

    document.getElementById('order-btn').disabled = true;

    const drinkName = currentOrder.drink === 'tea' ? 'Tea' : 'Coffee';
    
    updateStatus('preparing', 'Processing Payment...', 
        'Amount: ₹' + currentOrder.price);

    setTimeout(() => {
        
        updateStatus('preparing', '✅', 'Payment Confirmed', 
            'Starting preparation...');

        setTimeout(() => {
            
            const grindText = currentOrder.drink === 'tea' ? 
                'Steeping tea leaves...' : 'Grinding coffee beans...';
            updateStatus('preparing', 'Preparing Your ' + drinkName, grindText);

            setTimeout(() => {
                
                updateStatus('preparing', '🥛', 'Adding Milk', 
                    'Heating and mixing...');

                setTimeout(() => {
                    
                    if (currentOrder.withSugar) {
                        updateStatus('preparing', 'Adding Sugar', 
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

function continuePreparation() {
    const drinkName = currentOrder.drink === 'tea' ? 'tea' : 'coffee';
    
    updateStatus('preparing', 'Pouring Into Cup', 
        'Almost ready...');

    setTimeout(() => {
        
        const drink = currentOrder.drink;
        const ingredients = INGREDIENTS[drink];

        
        if (drink === 'tea') {
            stock.teaPowder -= ingredients.teaPowder;
        } else {
            stock.coffeePowder -= ingredients.coffeePowder;
        }

        if (currentOrder.withSugar) {
            stock.sugar -= INGREDIENTS.sugar;
        }

        
        stock.milk -= ingredients.milk;
        stock.cups -= ingredients.cups;

        if (drink === 'tea') {
            sales.teaSold++;
        } else {
            sales.coffeeSold++;
        }
        sales.totalRevenue += currentOrder.price;
        sales.totalCost += currentOrder.cost;

        updateStockDisplay();
        updateSalesDisplay();

        updateStatus('ready', 
            'Your ' + drinkName.charAt(0).toUpperCase() + drinkName.slice(1) + ' is Ready!', 
            'Please collect your beverage from the dispenser');

        setTimeout(() => {
            updateStatus('success', 'Thank You!', 
                'Enjoy your beverage. Have a great day!');

            setTimeout(() => {
                clearOrder();
            }, 3000);
        }, 4000);
    }, 1500);
}

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


function updateStatus(type, icon, text, subtext) {
    const statusArea = document.getElementById('status-area');
    
    // Remove all existing status classes
    statusArea.className = 'status-area';
    // Add new status class
    statusArea.classList.add('status-' + type);

    document.getElementById('status-icon').textContent = icon;
    document.getElementById('status-text').textContent = text;
    document.getElementById('status-subtext').textContent = subtext;
}

function clearOrder() {
    
    currentOrder = {
        drink: null,
        withSugar: true,
        price: 0,
        cost: 0
    };

    document.getElementById('menu-tea').classList.remove('selected');
    document.getElementById('menu-coffee').classList.remove('selected');
    
    document.getElementById('sugar-yes').classList.add('active');
    document.getElementById('sugar-no').classList.remove('active');
    
    document.getElementById('order-btn').disabled = true;

    document.getElementById('selected-drink').textContent = 'None';
    document.getElementById('selected-sugar').textContent = 'With Sugar';
    document.getElementById('total-amount').textContent = '₹0';

    updateStatus('idle', '🛒', 'Ready to Serve', 'Select a drink from the menu to begin');
}

function checkStockLevels() {
    const alerts = [];
    
    const LOW_STOCK_THRESHOLD = 20; 
    const CRITICAL_STOCK_THRESHOLD = 10; 
    
    
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

function updateStockDisplay() {
    document.getElementById('stock-tea').textContent = stock.teaPowder + ' g';
    document.getElementById('stock-coffee').textContent = stock.coffeePowder + ' g';
    document.getElementById('stock-sugar').textContent = stock.sugar + ' g';
    document.getElementById('stock-milk').textContent = stock.milk + ' ml';
    document.getElementById('stock-cups').textContent = stock.cups + ' pcs';
    
    checkStockLevels();
}

function updateSalesDisplay() {
    document.getElementById('sales-tea').textContent = sales.teaSold + ' cups';
    document.getElementById('sales-coffee').textContent = sales.coffeeSold + ' cups';
    document.getElementById('sales-revenue').textContent = '₹' + sales.totalRevenue;
    document.getElementById('sales-cost').textContent = '₹' + sales.totalCost;

    const profit = sales.totalRevenue - sales.totalCost;
    document.getElementById('profit').textContent = '₹' + profit;
}


updateStockDisplay();
updateSalesDisplay();