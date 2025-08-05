## 📁 Project Structure  
### Backend (Node.js/Express)  
``` 
server/
├── server.js                    (nouveau fichier principal)
├── node_modules/
├── uploads/
├── .env
├── .firebaserc
├── .gitignore
├── FIREBASE_SETUP_GUIDE.md
├── firebase-service-account.json
├── firebase.json
├── FIRESTORE_SETUP.md
├── firestore.indexes.json
├── firestore.rules
├── package-lock.json
├── package.json
├── config/
├── controllers/
├── routes/
├── middleware/
└── data/
``` 
### Frontend (React)  
```
src/  
├── assets/          # Static resources (images, fonts, icons)  
├── components/      # Reusable React components (e.g., Message.jsx, Navbar.jsx) 
├── context/         # Global state (e.g., AuthContext.js for logged-in user)  
├── hooks/           # Custom hooks (e.g., useSocket.js for WebSocket handling)  
└── pages/           # Page components (e.g., LoginPage.jsx, ChatPage.jsx)  
├── package.json/    
├── App.js/          
```  
### 1. Clone the project  
```bash  
git clone https://github.com/badie16/SoussTalk.git  
cd sousstalk  
```  

### 2. Install front-end dependencies  
```bash  
cd client  
npm install  
```  

### 3. Install back-end dependencies  
```bash  
cd ../server  
npm install  
```  

### 4. Run the development server  

Front-end:  
```bash  
cd client  
npm run dev  
```  

Back-end:  
```bash  
cd server  
npm start  
``` 
