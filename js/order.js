let cart = [];

// Load menu items for ordering
async function loadMenu() {
    try {
        const [categoriesRes, itemsRes] = await Promise.all([
            fetch('/api/menu/categories'),
            fetch('/api/menu/items')
        ]);
        
        const categories = await categoriesRes.json();
        const items = await itemsRes.json();
        
        const menuContainer = document.getElementById('menuCategories');
        
        menuContainer.innerHTML = categories.map(category => {
            const categoryItems = items.filter(item => item.category_id === category.id);
            
            if (categoryItems.length === 0) return '';
            
            return `
                <div style="margin-bottom: 4rem;">
                    <h2 style="text-align: center; margin-bottom: 2rem; color: var(--dark);">${category.name}</h2>
                    <div class="menu-grid">
                        ${categoryItems.map(item => `
                            <div class="menu-item">
                                <div class="menu-item-image">
                                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 'Image Coming Soon'}
                                </div>
                                <div class="menu-item-content">
                                    <div class="menu-item-header">
                                        <h3 class="menu-item-name">${item.name}</h3>
                                        <span class="menu-item-price">SAR ${item.price.toFixed(2)}</span>
                                    </div>
                                    <p class="menu-item-description">${item.description}</p>
                                    <button class="btn btn-primary btn-small" style="margin-top: 1rem; width: 100%;" onclick="addToCart(${item.id}, '${item.name}', ${item.price})">Add to Cart</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading menu:', error);
        document.getElementById('menuCategories').innerHTML = '<p style="text-align: center; color: var(--danger);">Error loading menu</p>';
    }
}

// Add item to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Item added to cart!');
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '3000';
    notification.style.minWidth = '200px';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// View cart
function viewCart() {
    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    updateCartDisplay();
    document.getElementById('cartModal').classList.add('active');
}

// Close cart
function closeCart() {
    document.getElementById('cartModal').classList.remove('active');
}

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>
                <span style="color: var(--text-light);">SAR ${item.price.toFixed(2)} each</span>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="padding: 0 1rem;">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn btn-danger btn-small" onclick="removeFromCart(${item.id})" style="margin-left: 1rem;">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = `SAR ${total.toFixed(2)}`;
}

// Update quantity
function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(id);
    } else {
        updateCartDisplay();
        updateCartCount();
    }
}

// Remove from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
    updateCartCount();
    
    if (cart.length === 0) {
        closeCart();
    }
}

// Proceed to checkout
function proceedToCheckout() {
    closeCart();
    
    // Update checkout summary
    const summary = cart.map(item => 
        `${item.name} x ${item.quantity} = SAR ${(item.price * item.quantity).toFixed(2)}`
    ).join('<br>');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('checkoutSummary').innerHTML = summary;
    document.getElementById('checkoutTotal').textContent = `SAR ${total.toFixed(2)}`;
    
    document.getElementById('checkoutModal').classList.add('active');
}

// Close checkout
function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

// Handle checkout form
document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        customer_name: document.getElementById('customerName').value,
        customer_phone: document.getElementById('customerPhone').value,
        customer_address: document.getElementById('customerAddress').value,
        items: cart,
        total_amount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    };
    
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Order placed successfully! We will contact you shortly for confirmation.');
            cart = [];
            updateCartCount();
            closeCheckout();
            document.getElementById('checkoutForm').reset();
        } else {
            alert('Error placing order. Please try again.');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Error placing order. Please try again.');
    }
});

// Initialize
loadMenu();
