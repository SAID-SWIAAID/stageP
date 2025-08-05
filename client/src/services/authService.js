// This file handles client-side interactions with your backend's authentication APIs.

const BACKEND_URL = import.meta.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001/api'

/**
 * Simulates an authentication state change listener.
 * In a real app, this might listen to Firebase Auth state or check a token.
 * @param {function} callback - The function to call with the current user.
 * @returns {function} An unsubscribe function.
 */
export function onAuthChange(callback) {
  // For now, we'll simulate a user being logged in if a 'user' is in localStorage.
  // In a real application, this would involve checking a token's validity with the backend.
  const storedUser = localStorage.getItem("user")
  if (storedUser) {
    try {
      callback(JSON.parse(storedUser))
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e)
      localStorage.removeItem("user")
      callback(null)
    }
  } else {
    callback(null)
  }

  // Return a dummy unsubscribe function for now
  return () => {
    console.log("Auth listener unsubscribed (simulated).")
  }
}

/**
 * Saves or updates user information in the backend (Firestore).
 * @param {object} userData - The user data to save. Must include uid and phoneNumber.
 * @returns {Promise<object>} The updated user object from the backend.
 */
export async function saveUserToBackend(userData) {
  console.log("Saving user data to backend:", userData)
  try {
    const response = await fetch(`${BACKEND_URL}/users/save-profile`, { // <-- Fix here
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to save user to backend.")
    }

    const data = await response.json()
    console.log("User data saved to backend:", data)
    return data
  } catch (error) {
    console.error("Error saving user to backend:", error)
    throw error
  }
}

/**
 * Registers a new user with the backend.
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response from the backend.
 */
export async function registerUser(phoneNumber, password) {
  console.log("Registering user with phone number:", phoneNumber)
  console.log("Registering user with password:", password)
  try {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Registration failed.")
    }

    return await response.json()
  } catch (error) {
    console.error("Error during registration:", error)
    throw error
  }
}

/**
 * Logs in a user with the backend.
 * @param {string} phoneNumber - The user's phone number.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The response from the backend, including a token and user info.
 */
export async function loginUser(phoneNumber, password) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phoneNumber, password }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Login failed.")
    }

    return await response.json()
  } catch (error) {
    console.error("Error during login:", error)
    throw error
  }
}

/**
 * Completes a user's profile by sending additional information to the backend.
 * @param {string} uid - The user's unique ID.
 * @param {object} profileData - Object containing name, email, and address.
 * @returns {Promise<object>} The response from the backend.
 */
export async function completeUserProfile(uid, profileData) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/complete-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if your backend requires it for profile completion
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ uid, ...profileData }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to complete profile.")
    }

    return await response.json()
  } catch (error) {
    console.error("Error completing profile:", error)
    throw error
  }
}

/**
 * Fetches user profile from the backend.
 * @param {string} uid - The user's unique ID.
 * @returns {Promise<object>} The user profile data.
 */
export async function fetchUserProfile(uid) {
  try {
    const response = await fetch(`${BACKEND_URL}/users/${uid}`)

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch user profile.")
    }

    const data = await response.json()
    return data.user
  } catch (error) {
    console.error("Error fetching user profile:", error)
    throw error
  }
}

/**
 * Fetches all products from the backend.
 * @returns {Promise<Array>} An array of product objects.
 */
export async function getProducts() {
  try {
    const response = await fetch(`${BACKEND_URL}/products`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch products.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

/**
 * Adds a new product to the backend.
 * @param {object} productData - The product data to add.
 * @returns {Promise<object>} The added product data with its ID.
 */
export async function addProduct(productData) {
  try {
    const response = await fetch(`${BACKEND_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add product.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error adding product:", error)
    throw error
  }
}

/**
 * Updates an existing product in the backend.
 * @param {string} productId - The ID of the product to update.
 * @param {object} updatedData - The updated product data.
 * @returns {Promise<object>} A success message.
 */
export async function updateProduct(productId, updatedData) {
  try {
    const response = await fetch(`${BACKEND_URL}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update product.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

/**
 * Deletes a product from the backend.
 * @param {string} productId - The ID of the product to delete.
 * @returns {Promise<object>} A success message.
 */
export async function deleteProduct(productId) {
  try {
    const response = await fetch(`${BACKEND_URL}/products/${productId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete product.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

/**
 * Fetches all suppliers from the backend.
 * @returns {Promise<Array>} An array of supplier objects.
 */
export async function getSuppliers() {
  try {
    const response = await fetch(`${BACKEND_URL}/suppliers`)
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to fetch suppliers.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    throw error
  }
}

/**
 * Adds a new supplier to the backend.
 * @param {object} supplierData - The supplier data to add.
 * @returns {Promise<object>} The added supplier data with its ID.
 */
export async function addSupplier(supplierData) {
  try {
    const response = await fetch(`${BACKEND_URL}/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierData),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to add supplier.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error adding supplier:", error)
    throw error
  }
}

/**
 * Updates an existing supplier in the backend.
 * @param {string} supplierId - The ID of the supplier to update.
 * @param {object} updatedData - The updated supplier data.
 * @returns {Promise<object>} A success message.
 */
export async function updateSupplier(supplierId, updatedData) {
  try {
    const response = await fetch(`${BACKEND_URL}/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to update supplier.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error updating supplier:", error)
    throw error
  }
}

/**
 * Deletes a supplier from the backend.
 * @param {string} supplierId - The ID of the supplier to delete.
 * @returns {Promise<object>} A success message.
 */
export async function deleteSupplier(supplierId) {
  try {
    const response = await fetch(`${BACKEND_URL}/suppliers/${supplierId}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || "Failed to delete supplier.")
    }
    return await response.json()
  } catch (error) {
    console.error("Error deleting supplier:", error)
    throw error
  }
}

// The following functions are placeholders for if you decide to implement
// traditional email/password authentication or other user management
// directly through your backend API. For the current OTP flow, they are not directly used.

export const resetPassword = async (email) => {
  console.warn("resetPassword is a placeholder. Implement backend API call if needed.")
  throw new Error("Password reset not implemented via this service.")
}

export const logoutUser = async () => {
  console.warn("logoutUser is a placeholder. Implement backend API call if needed.")
  throw new Error("Logout not implemented via this service.")
}

export const updateUserProfile = async (uid, data) => {
  console.warn("updateUserProfile is a placeholder. Implement backend update if needed.")
  throw new Error("Update user profile not implemented via this service.")
}

export const deleteUserProfile = async (uid) => {
  console.warn("deleteUserProfile is a placeholder. Implement backend delete if needed.")
  throw new Error("Delete user profile not implemented via this service.")
}
