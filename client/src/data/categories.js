export const productCategories = {
  electronics: {
    name: "Electronics",
    icon: "📱",
    subcategories: {
      smartphones: "Smartphones",
      laptops: "Laptops & Computers",
      tablets: "Tablets",
      accessories: "Accessories",
      audio: "Audio & Headphones",
      cameras: "Cameras & Photography",
      gaming: "Gaming",
      smart_home: "Smart Home",
      wearables: "Wearables",
      tv_audio: "TV & Audio"
    }
  },
  clothing: {
    name: "Clothing & Fashion",
    icon: "👕",
    subcategories: {
      mens_clothing: "Men's Clothing",
      womens_clothing: "Women's Clothing",
      kids_clothing: "Kids' Clothing",
      shoes: "Shoes & Footwear",
      accessories: "Fashion Accessories",
      jewelry: "Jewelry & Watches",
      bags: "Bags & Luggage",
      sportswear: "Sportswear",
      underwear: "Underwear & Lingerie",
      formal_wear: "Formal Wear"
    }
  },
  home_garden: {
    name: "Home & Garden",
    icon: "🏠",
    subcategories: {
      furniture: "Furniture",
      decor: "Home Decor",
      kitchen: "Kitchen & Dining",
      bathroom: "Bathroom",
      garden: "Garden & Outdoor",
      lighting: "Lighting",
      bedding: "Bedding & Linens",
      storage: "Storage & Organization",
      tools: "Tools & Hardware",
      appliances: "Home Appliances"
    }
  },
  beauty_health: {
    name: "Beauty & Health",
    icon: "💄",
    subcategories: {
      skincare: "Skincare",
      makeup: "Makeup",
      haircare: "Hair Care",
      fragrances: "Fragrances",
      personal_care: "Personal Care",
      vitamins: "Vitamins & Supplements",
      fitness: "Fitness & Exercise",
      medical: "Medical Supplies",
      dental: "Dental Care",
      wellness: "Wellness & Spa"
    }
  },
  sports_outdoors: {
    name: "Sports & Outdoors",
    icon: "⚽",
    subcategories: {
      team_sports: "Team Sports",
      individual_sports: "Individual Sports",
      fitness_equipment: "Fitness Equipment",
      camping: "Camping & Hiking",
      cycling: "Cycling",
      water_sports: "Water Sports",
      winter_sports: "Winter Sports",
      hunting_fishing: "Hunting & Fishing",
      yoga: "Yoga & Pilates",
      outdoor_gear: "Outdoor Gear"
    }
  },
  automotive: {
    name: "Automotive",
    icon: "🚗",
    subcategories: {
      car_parts: "Car Parts",
      car_accessories: "Car Accessories",
      motorcycle: "Motorcycle",
      tools_equipment: "Tools & Equipment",
      maintenance: "Maintenance",
      electronics: "Car Electronics",
      interior: "Interior Accessories",
      exterior: "Exterior Accessories",
      performance: "Performance Parts",
      safety: "Safety Equipment"
    }
  },
  books_media: {
    name: "Books & Media",
    icon: "📚",
    subcategories: {
      books: "Books",
      magazines: "Magazines",
      music: "Music",
      movies: "Movies & TV",
      games: "Video Games",
      educational: "Educational",
      comics: "Comics & Graphic Novels",
      audio_books: "Audiobooks",
      digital_content: "Digital Content",
      collectibles: "Collectibles"
    }
  },
  food_beverages: {
    name: "Food & Beverages",
    icon: "🍎",
    subcategories: {
      fresh_food: "Fresh Food",
      packaged_food: "Packaged Food",
      beverages: "Beverages",
      snacks: "Snacks",
      organic: "Organic & Natural",
      international: "International Cuisine",
      dietary: "Dietary & Special Needs",
      gourmet: "Gourmet & Specialty",
      baby_food: "Baby Food",
      pet_food: "Pet Food"
    }
  },
  toys_hobbies: {
    name: "Toys & Hobbies",
    icon: "🎮",
    subcategories: {
      kids_toys: "Kids Toys",
      board_games: "Board Games",
      puzzles: "Puzzles",
      arts_crafts: "Arts & Crafts",
      model_building: "Model Building",
      collectibles: "Collectibles",
      outdoor_toys: "Outdoor Toys",
      educational_toys: "Educational Toys",
      building_blocks: "Building Blocks",
      dolls_action_figures: "Dolls & Action Figures"
    }
  },
  industrial: {
    name: "Industrial & Business",
    icon: "🏭",
    subcategories: {
      machinery: "Machinery & Equipment",
      tools: "Industrial Tools",
      safety: "Safety Equipment",
      office_supplies: "Office Supplies",
      packaging: "Packaging Materials",
      chemicals: "Industrial Chemicals",
      electrical: "Electrical Equipment",
      plumbing: "Plumbing Supplies",
      construction: "Construction Materials",
      medical_equipment: "Medical Equipment"
    }
  }
}

// Helper function to get category name by key
export const getCategoryName = (categoryKey) => {
  return productCategories[categoryKey]?.name || categoryKey
}

// Helper function to get subcategory name by keys
export const getSubcategoryName = (categoryKey, subcategoryKey) => {
  return productCategories[categoryKey]?.subcategories[subcategoryKey] || subcategoryKey
}

// Helper function to get all categories as array
export const getCategoriesArray = () => {
  return Object.entries(productCategories).map(([key, category]) => ({
    key,
    name: category.name,
    icon: category.icon,
    subcategories: Object.entries(category.subcategories).map(([subKey, subName]) => ({
      key: subKey,
      name: subName
    }))
  }))
}

// Helper function to get subcategories for a specific category
export const getSubcategoriesForCategory = (categoryKey) => {
  return productCategories[categoryKey]?.subcategories || {}
} 