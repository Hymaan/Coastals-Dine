let currentUser = null;

// Check authentication on page load
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/verify');
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showDashboard();
            loadStats();
        } else {
            showLogin();
        }
    } catch (error) {
        showLogin();
    }
}

// Show login screen
function showLogin() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminDashboard').classList.add('hidden');
}

// Show dashboard
function showDashboard() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('adminDashboard').classList.remove('hidden');
}

// Handle login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            showDashboard();
            loadStats();
        } else {
            const errorDiv = document.getElementById('loginError');
            errorDiv.textContent = data.error || 'Invalid credentials';
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Login error:', error);
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.remove('hidden');
    }
});

// Logout
async function logout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        currentUser = null;
        showLogin();
        document.getElementById('loginForm').reset();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Show section
function showSection(section) {
    // Update active button
    const buttons = document.querySelectorAll('.admin-nav button');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(s => s.classList.add('hidden'));
    
    // Show selected section
    const sectionId = section + 'Section';
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Load data for section
    switch(section) {
        case 'overview':
            loadStats();
            break;
        case 'menu':
            loadMenuItems();
            break;
        case 'reservations':
            loadReservations();
            break;
        case 'orders':
            loadOrders();
            break;
        case 'reviews':
            loadReviews();
            break;
    }
}

// Load stats
async function loadStats() {
    try {
        const response = await fetch('/api/admin/stats');
        const stats = await response.json();
        
        const statsGrid = document.getElementById('statsGrid');
        statsGrid.innerHTML = `
            <div class="stat-card">
                <div class="stat-value">${stats.pendingReservations}</div>
                <div class="stat-title">Pending Reservations</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.pendingOrders}</div>
                <div class="stat-title">Pending Orders</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.pendingReviews}</div>
                <div class="stat-title">Pending Reviews</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.activeMenuItems}</div>
                <div class="stat-title">Active Menu Items</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">SAR ${stats.todayRevenue.toFixed(2)}</div>
                <div class="stat-title">Today's Revenue</div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load menu items
async function loadMenuItems() {
    try {
        const response = await fetch('/api/admin/menu/items');
        const items = await response.json();
        
        const table = document.getElementById('menuItemsTable');
        
        if (items.length === 0) {
            table.innerHTML = '<p>No menu items found</p>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Featured</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td><strong>${item.name}</strong><br><small style="color: var(--text-light);">${item.description}</small></td>
                            <td>${item.category_name}</td>
                            <td>SAR ${item.price.toFixed(2)}</td>
                            <td><span class="status-badge ${item.is_available ? 'status-confirmed' : 'status-cancelled'}">${item.is_available ? 'Available' : 'Unavailable'}</span></td>
                            <td>${item.is_featured ? '⭐' : '-'}</td>
                            <td>
                                <button class="btn btn-small" onclick="editMenuItem(${item.id})">Edit</button>
                                <button class="btn btn-danger btn-small" onclick="deleteMenuItem(${item.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading menu items:', error);
    }
}

// Menu item modal functions
function openMenuItemModal(itemId = null) {
    if (itemId) {
        // Edit mode - load item data
        fetch(`/api/admin/menu/items`)
            .then(res => res.json())
            .then(items => {
                const item = items.find(i => i.id === itemId);
                if (item) {
                    document.getElementById('menuItemModalTitle').textContent = 'Edit Menu Item';
                    document.getElementById('itemId').value = item.id;
                    document.getElementById('itemCategory').value = item.category_id;
                    document.getElementById('itemName').value = item.name;
                    document.getElementById('itemDescription').value = item.description;
                    document.getElementById('itemPrice').value = item.price;
                    document.getElementById('itemImage').value = item.image_url || '';
                    document.getElementById('itemAvailable').checked = item.is_available;
                    document.getElementById('itemFeatured').checked = item.is_featured;
                }
            });
    } else {
        // Add mode - clear form
        document.getElementById('menuItemModalTitle').textContent = 'Add Menu Item';
        document.getElementById('menuItemForm').reset();
        document.getElementById('itemId').value = '';
    }
    
    document.getElementById('menuItemModal').classList.add('active');
}

function closeMenuItemModal() {
    document.getElementById('menuItemModal').classList.remove('active');
}

function editMenuItem(id) {
    openMenuItemModal(id);
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
        const response = await fetch(`/api/admin/menu/items/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Menu item deleted successfully');
            loadMenuItems();
        } else {
            alert('Error deleting menu item');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
        alert('Error deleting menu item');
    }
}

// Handle menu item form
document.getElementById('menuItemForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const formData = {
        category_id: parseInt(document.getElementById('itemCategory').value),
        name: document.getElementById('itemName').value,
        description: document.getElementById('itemDescription').value,
        price: parseFloat(document.getElementById('itemPrice').value),
        image_url: document.getElementById('itemImage').value,
        is_available: document.getElementById('itemAvailable').checked,
        is_featured: document.getElementById('itemFeatured').checked
    };
    
    try {
        const url = itemId ? `/api/admin/menu/items/${itemId}` : '/api/admin/menu/items';
        const method = itemId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            alert(itemId ? 'Menu item updated successfully' : 'Menu item added successfully');
            closeMenuItemModal();
            loadMenuItems();
        } else {
            alert('Error saving menu item');
        }
    } catch (error) {
        console.error('Error saving menu item:', error);
        alert('Error saving menu item');
    }
});

// Load reservations
async function loadReservations() {
    try {
        const response = await fetch('/api/admin/reservations');
        const reservations = await response.json();
        
        const table = document.getElementById('reservationsTable');
        
        if (reservations.length === 0) {
            table.innerHTML = '<p>No reservations found</p>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Date & Time</th>
                        <th>Guests</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map(res => `
                        <tr>
                            <td><strong>${res.customer_name}</strong></td>
                            <td>${res.date} at ${res.time}</td>
                            <td>${res.guests} guests</td>
                            <td>${res.customer_phone}<br><small>${res.customer_email}</small></td>
                            <td><span class="status-badge status-${res.status}">${res.status}</span></td>
                            <td>
                                <select onchange="updateReservationStatus(${res.id}, this.value)" class="btn btn-small">
                                    <option value="">Change Status</option>
                                    <option value="confirmed">Confirm</option>
                                    <option value="completed">Complete</option>
                                    <option value="cancelled">Cancel</option>
                                </select>
                            </td>
                        </tr>
                        ${res.special_requests ? `
                        <tr>
                            <td colspan="6" style="background: var(--secondary-color); padding: 0.5rem 1rem;">
                                <small><strong>Special Requests:</strong> ${res.special_requests}</small>
                            </td>
                        </tr>
                        ` : ''}
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

async function updateReservationStatus(id, status) {
    if (!status) return;
    
    try {
        const response = await fetch(`/api/admin/reservations/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Reservation status updated');
            loadReservations();
        } else {
            alert('Error updating reservation');
        }
    } catch (error) {
        console.error('Error updating reservation:', error);
        alert('Error updating reservation');
    }
}

// Load orders
async function loadOrders() {
    try {
        const response = await fetch('/api/admin/orders');
        const orders = await response.json();
        
        const table = document.getElementById('ordersTable');
        
        if (orders.length === 0) {
            table.innerHTML = '<p>No orders found</p>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>#${order.id}</td>
                            <td>
                                <strong>${order.customer_name}</strong><br>
                                <small>${order.customer_phone}</small>
                            </td>
                            <td>
                                <button class="btn btn-small" onclick="viewOrderDetails(${order.id})">View Items</button>
                            </td>
                            <td><strong>SAR ${order.total_amount.toFixed(2)}</strong></td>
                            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                            <td>${new Date(order.created_at).toLocaleString()}</td>
                            <td>
                                <select onchange="updateOrderStatus(${order.id}, this.value)" class="btn btn-small">
                                    <option value="">Change Status</option>
                                    <option value="confirmed">Confirm</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="out-for-delivery">Out for Delivery</option>
                                    <option value="completed">Complete</option>
                                    <option value="cancelled">Cancel</option>
                                </select>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

function viewOrderDetails(orderId) {
    fetch('/api/admin/orders')
        .then(res => res.json())
        .then(orders => {
            const order = orders.find(o => o.id === orderId);
            if (!order) return;
            
            const content = document.getElementById('orderDetailsContent');
            content.innerHTML = `
                <div style="margin-bottom: 1rem;">
                    <strong>Customer:</strong> ${order.customer_name}<br>
                    <strong>Phone:</strong> ${order.customer_phone}<br>
                    <strong>Address:</strong> ${order.customer_address}<br>
                    <strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}
                </div>
                <h4>Order Items:</h4>
                <table style="margin-top: 1rem;">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>${item.name}</td>
                                <td>${item.quantity}</td>
                                <td>SAR ${item.price.toFixed(2)}</td>
                                <td>SAR ${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                        <tr style="font-weight: bold; border-top: 2px solid var(--border-color);">
                            <td colspan="3" style="text-align: right;">Total:</td>
                            <td>SAR ${order.total_amount.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            `;
            
            document.getElementById('orderDetailsModal').classList.add('active');
        });
}

function closeOrderDetailsModal() {
    document.getElementById('orderDetailsModal').classList.remove('active');
}

async function updateOrderStatus(id, status) {
    if (!status) return;
    
    try {
        const response = await fetch(`/api/admin/orders/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        
        if (response.ok) {
            alert('Order status updated');
            loadOrders();
        } else {
            alert('Error updating order');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        alert('Error updating order');
    }
}

// Load reviews
async function loadReviews() {
    try {
        const response = await fetch('/api/admin/reviews');
        const reviews = await response.json();
        
        const table = document.getElementById('reviewsTable');
        
        if (reviews.length === 0) {
            table.innerHTML = '<p>No reviews found</p>';
            return;
        }
        
        table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Rating</th>
                        <th>Comment</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reviews.map(review => `
                        <tr>
                            <td><strong>${review.customer_name}</strong></td>
                            <td>${'⭐'.repeat(review.rating)}</td>
                            <td>${review.comment || 'No comment'}</td>
                            <td>${new Date(review.created_at).toLocaleDateString()}</td>
                            <td><span class="status-badge ${review.is_approved ? 'status-confirmed' : 'status-pending'}">${review.is_approved ? 'Approved' : 'Pending'}</span></td>
                            <td>
                                ${!review.is_approved ? `<button class="btn btn-small" onclick="approveReview(${review.id})">Approve</button>` : ''}
                                <button class="btn btn-danger btn-small" onclick="deleteReview(${review.id})">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

async function approveReview(id) {
    try {
        const response = await fetch(`/api/admin/reviews/${id}/approve`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            alert('Review approved');
            loadReviews();
        } else {
            alert('Error approving review');
        }
    } catch (error) {
        console.error('Error approving review:', error);
        alert('Error approving review');
    }
}

async function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
        const response = await fetch(`/api/admin/reviews/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Review deleted');
            loadReviews();
        } else {
            alert('Error deleting review');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        alert('Error deleting review');
    }
}

// Initialize
checkAuth();
