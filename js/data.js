// Static data for GitHub Pages deployment (no backend needed)
const staticData = {
  categories: [
    { id: 1, name: "Appetizers", display_order: 0 },
    { id: 2, name: "Main Course", display_order: 1 },
    { id: 3, name: "Seafood Specials", display_order: 2 },
    { id: 4, name: "Desserts", display_order: 3 },
    { id: 5, name: "Beverages", display_order: 4 }
  ],
  
  menuItems: [
    { id: 1, category_id: 1, name: "Crispy Calamari", category_name: "Appetizers", description: "Fresh calamari rings, lightly breaded and fried to golden perfection", price: 28.00, image_url: "", is_available: 1, is_featured: 1 },
    { id: 2, category_id: 1, name: "Coastal Bruschetta", category_name: "Appetizers", description: "Toasted bread topped with fresh tomatoes, basil, and olive oil", price: 22.00, image_url: "", is_available: 1, is_featured: 0 },
    { id: 3, category_id: 2, name: "Grilled Chicken Supreme", category_name: "Main Course", description: "Tender grilled chicken breast with herbs and garlic butter", price: 48.00, image_url: "", is_available: 1, is_featured: 1 },
    { id: 4, category_id: 2, name: "Beef Tenderloin", category_name: "Main Course", description: "Prime beef tenderloin with mushroom sauce and roasted vegetables", price: 85.00, image_url: "", is_available: 1, is_featured: 0 },
    { id: 5, category_id: 3, name: "Lobster Thermidor", category_name: "Seafood Specials", description: "Classic French lobster dish with creamy sauce", price: 120.00, image_url: "", is_available: 1, is_featured: 1 },
    { id: 6, category_id: 3, name: "Grilled Salmon", category_name: "Seafood Specials", description: "Atlantic salmon fillet with lemon butter and asparagus", price: 65.00, image_url: "", is_available: 1, is_featured: 1 },
    { id: 7, category_id: 3, name: "Seafood Platter", category_name: "Seafood Specials", description: "Assorted fresh seafood including prawns, mussels, and fish", price: 95.00, image_url: "", is_available: 1, is_featured: 0 },
    { id: 8, category_id: 4, name: "Tiramisu", category_name: "Desserts", description: "Classic Italian dessert with coffee-soaked ladyfingers", price: 25.00, image_url: "", is_available: 1, is_featured: 0 },
    { id: 9, category_id: 4, name: "Chocolate Lava Cake", category_name: "Desserts", description: "Warm chocolate cake with molten center, served with vanilla ice cream", price: 28.00, image_url: "", is_available: 1, is_featured: 1 },
    { id: 10, category_id: 5, name: "Fresh Lemonade", category_name: "Beverages", description: "House-made lemonade with mint", price: 12.00, image_url: "", is_available: 1, is_featured: 0 },
    { id: 11, category_id: 5, name: "Arabic Coffee", category_name: "Beverages", description: "Traditional Arabic coffee with cardamom", price: 10.00, image_url: "", is_available: 1, is_featured: 0 }
  ],
  
  reviews: [
    { id: 1, customer_name: "Ahmed Al-Rashid", rating: 5, comment: "Great food and a very calm family environment. Highly recommended.", created_at: "2026-01-15", is_approved: 1 },
    { id: 2, customer_name: "Sarah Mohammed", rating: 4, comment: "Tasty meals and good service. Delivery was quick and well packed.", created_at: "2026-01-20", is_approved: 1 },
    { id: 3, customer_name: "Khalid Hassan", rating: 5, comment: "One of the best family restaurants in Jubail City Center.", created_at: "2026-01-25", is_approved: 1 },
    { id: 4, customer_name: "Fatima Ali", rating: 5, comment: "The seafood platter was absolutely delicious! Will definitely come back.", created_at: "2026-01-28", is_approved: 1 },
    { id: 5, customer_name: "Omar Abdullah", rating: 4, comment: "Great atmosphere and friendly staff. The grilled salmon was perfect.", created_at: "2026-01-30", is_approved: 1 }
  ]
};
