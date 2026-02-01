// Load menu items grouped by category
async function loadMenu() {
    try {
        const [categoriesRes, itemsRes] = await Promise.all([
            fetch('/api/menu/categories'),
            fetch('/api/menu/items')
        ]);
        
        const categories = await categoriesRes.json();
        const items = await itemsRes.json();
        
        const menuContainer = document.getElementById('menuCategories');
        
        if (categories.length === 0) {
            menuContainer.innerHTML = '<p style="text-align: center;">Menu coming soon...</p>';
            return;
        }
        
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
                                    ${item.is_featured ? '<span class="menu-item-category">⭐ Featured</span>' : ''}
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

// Initialize
loadMenu();
