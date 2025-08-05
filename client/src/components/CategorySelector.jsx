import { useState } from "react"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { productCategories, getSubcategoriesForCategory } from "../data/categories"

export default function CategorySelector({ 
  selectedCategory, 
  selectedSubcategory, 
  onCategoryChange, 
  onSubcategoryChange,
  required = false 
}) {
  const [availableSubcategories, setAvailableSubcategories] = useState(
    selectedCategory ? getSubcategoriesForCategory(selectedCategory) : {}
  )

  const handleCategoryChange = (categoryKey) => {
    onCategoryChange(categoryKey)
    
    // Update available subcategories
    const subcategories = getSubcategoriesForCategory(categoryKey)
    setAvailableSubcategories(subcategories)
    
    // Clear subcategory if it's not available in the new category
    if (selectedSubcategory && !subcategories[selectedSubcategory]) {
      onSubcategoryChange("")
    }
  }

  return (
    <div className="space-y-4">
      {/* Main Category Selection */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="category" className="text-right">
          Category {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="col-span-3">
          <Select value={selectedCategory} onValueChange={handleCategoryChange} required={required}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(productCategories).map(([key, category]) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subcategory" className="text-right">
            Subcategory {required && <span className="text-red-500">*</span>}
          </Label>
          <div className="col-span-3">
            <Select value={selectedSubcategory} onValueChange={onSubcategoryChange} required={required}>
              <SelectTrigger>
                <SelectValue placeholder="Select a subcategory" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(availableSubcategories).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Category Preview */}
      {selectedCategory && selectedSubcategory && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-sm text-gray-500">
            Selected:
          </Label>
          <div className="col-span-3 text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">
              {productCategories[selectedCategory]?.icon} {productCategories[selectedCategory]?.name}
            </span>
            {" > "}
            <span className="font-medium">
              {availableSubcategories[selectedSubcategory]}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 