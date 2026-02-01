// Load featured menu items
async function loadFeaturedMenu() {
    try {
        const response = await fetch('/api/menu/featured');
        const items = await response.json();
        
        const grid = document.getElementById('featuredMenuGrid');
        
        if (items.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">No featured items available</p>';
            return;
        }
        
        grid.innerHTML = items.map(item => `
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
                    <span class="menu-item-category">${item.category_name}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading featured menu:', error);
        document.getElementById('featuredMenuGrid').innerHTML = '<p style="text-align: center; color: var(--danger);">Error loading menu items</p>';
    }
}

// Load reviews
async function loadReviews() {
    try {
        const response = await fetch('/api/reviews');
        const reviews = await response.json();
        
        const grid = document.getElementById('reviewsGrid');
        
        if (reviews.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: var(--text-light);">No reviews yet. Be the first to review!</p>';
            return;
        }
        
        grid.innerHTML = reviews.slice(0, 6).map(review => `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-author">${review.customer_name}</span>
                    <span class="stars">${'⭐'.repeat(review.rating)}</span>
                </div>
                <p class="review-comment">"${review.comment}"</p>
                <small style="color: var(--text-light);">${new Date(review.created_at).toLocaleDateString()}</small>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviewsGrid').innerHTML = '<p style="text-align: center; color: var(--danger);">Error loading reviews</p>';
    }
}

// Handle reservation form
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        customer_name: document.getElementById('name').value,
        customer_email: document.getElementById('email').value,
        customer_phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: parseInt(document.getElementById('guests').value),
        special_requests: document.getElementById('requests').value
    };
    
    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Reservation submitted successfully! We will confirm your booking soon.');
            document.getElementById('reservationForm').reset();
        } else {
            alert('Error submitting reservation. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting reservation:', error);
        alert('Error submitting reservation. Please try again.');
    }
});

// Review modal functions
function openReviewModal() {
    document.getElementById('reviewModal').classList.add('active');
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.remove('active');
    document.getElementById('reviewForm').reset();
}

// Handle review form
document.getElementById('reviewForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        customer_name: document.getElementById('reviewName').value,
        rating: parseInt(document.getElementById('rating').value),
        comment: document.getElementById('reviewComment').value
    };
    
    try {
        const response = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Thank you for your review! It will be published after moderation.');
            closeReviewModal();
        } else {
            alert('Error submitting review. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert('Error submitting review. Please try again.');
    }
});

// Set minimum date for reservations to today
document.getElementById('date').min = new Date().toISOString().split('T')[0];

// Initialize page
loadFeaturedMenu();
loadReviews();
