# 🔥 Firestore Setup Guide - FIX YOUR DATA STORAGE

## 🚨 CURRENT PROBLEM
Your data is NOT being saved to Firebase Firestore because you're using placeholder credentials. The server is falling back to in-memory storage.

## ✅ SOLUTION: Enable Real Firestore

### Step 1: Get Firebase Service Account Key

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Select your project: `supplier-bbb9c`

2. **Generate Service Account Key:**
   - Click the gear icon ⚙️ (Project Settings)
   - Go to "Service accounts" tab
   - Click "Generate new private key"
   - Download the JSON file

3. **Replace the placeholder file:**
   - Open the downloaded JSON file
   - Copy ALL the content
   - Replace the content in `server/firebase-service-account.json`

### Step 2: Enable Firestore Database

1. **In Firebase Console:**
   - Go to "Firestore Database" in the left sidebar
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select a location (choose the closest to you)

2. **Verify Firestore is enabled:**
   - You should see "Cloud Firestore" in the left sidebar
   - The database should show as "Active"

### Step 3: Update Security Rules (Optional)

Your current rules are set to expire on August 31, 2025. For development, you can keep them as is.

### Step 4: Test the Connection

1. **Restart your server:**
   ```bash
   cd server
   node server.js
   ```

2. **Check server logs:**
   - You should see: "Firebase Admin SDK initialized successfully."
   - NOT: "Falling back to in-memory storage"

3. **Test data saving:**
   - Try adding a product or user
   - Check Firebase Console > Firestore Database to see if data appears

## 🔧 TROUBLESHOOTING

### If you still see "Falling back to in-memory storage":
1. Check that your service account JSON is valid
2. Verify the project ID matches your Firebase project
3. Make sure you copied the entire JSON content

### If you get authentication errors:
1. Verify your service account has the correct permissions
2. Check that Firestore is enabled in your Firebase project
3. Ensure your project ID is correct

## 📝 IMPORTANT NOTES

- **Never commit your service account key to git**
- **Keep your private key secure**
- **Use environment variables in production**

## 🎯 EXPECTED RESULT

After following these steps:
- ✅ Data will be saved to real Firestore
- ✅ Data will persist between server restarts
- ✅ You can view data in Firebase Console
- ✅ All CRUD operations will work with real database 