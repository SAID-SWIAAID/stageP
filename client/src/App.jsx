import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import PrivateRoute from "./components/PrivateRoute"

// Import your pages
import AuthPage from "./pages/AuthPage"
import CompleteProfilePage from "./pages/CompleteProfilePage"
import DashboardPage from "./pages/DashboardPage"
import CategorySelectionPage from "./pages/CategorySelectionPage"
import CategoriesPage from "./pages/CategoriesPage"
import BoutiqueManagementPage from "./pages/BoutiqueManagementPage"
import MyProductsPage from "./pages/MyProductsPage"
import InventoryPage from "./pages/InventoryPage"
import BoutiquePage from "./pages/BoutiquePage"
import AddProductPage from "./pages/AddProductPage"
import BulkUploadPage from "./pages/BulkUploadPage"
import ClientsPage from "./pages/ClientsPage"
import StockPage from "./pages/StockPage"
import OrdersPage from "./pages/OrdersPage"
import SalesHistoryPage from "./pages/SalesHistoryPage"
import ElectronicPaymentPage from "./pages/ElectronicPaymentPage"
import CatalogPage from "./pages/CatalogPage"
import PurchasesPage from "./pages/PurchasesPage"
import SuppliersPage from "./pages/SuppliersPage"
import StatisticsPage from "./pages/StatisticsPage"
import CashCollectionPage from "./pages/CashCollectionPage"
import InvoicesPage from "./pages/InvoicesPage"
import ExpensesPage from "./pages/ExpensesPage"
import ConfigurationPage from "./pages/ConfigurationPage"
import ClientDashboardPage from "./pages/ClientDashboardPage"
import ExportProductsPage from "./pages/ExportProductsPage"
import DummyApiPage from "./pages/DummyApiPage"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Private Routes */}
          <Route
            path="/complete-profile"
            element={
              <PrivateRoute>
                <CompleteProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/category-selection"
            element={
              <PrivateRoute>
                <CategorySelectionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-products"
            element={
              <PrivateRoute>
                <MyProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <InventoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/boutique"
            element={
              <PrivateRoute>
                <BoutiquePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute>
                <AddProductPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <CategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/boutique-management"
            element={
              <PrivateRoute>
                <BoutiqueManagementPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/bulk-upload"
            element={
              <PrivateRoute>
                <BulkUploadPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/clients"
            element={
              <PrivateRoute>
                <ClientsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <PrivateRoute>
                <StockPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/sales-history"
            element={
              <PrivateRoute>
                <SalesHistoryPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/electronic-payment"
            element={
              <PrivateRoute>
                <ElectronicPaymentPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/catalog"
            element={
              <PrivateRoute>
                <CatalogPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/purchases"
            element={
              <PrivateRoute>
                <PurchasesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/suppliers"
            element={
              <PrivateRoute>
                <SuppliersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/statistics"
            element={
              <PrivateRoute>
                <StatisticsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cash-collection"
            element={
              <PrivateRoute>
                <CashCollectionPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <PrivateRoute>
                <InvoicesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <PrivateRoute>
                <ExpensesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/configuration"
            element={
              <PrivateRoute>
                <ConfigurationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/client-dashboard"
            element={
              <PrivateRoute>
                <ClientDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/export-products"
            element={
              <PrivateRoute>
                <ExportProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/dummy-api"
            element={
              <PrivateRoute>
                <DummyApiPage />
              </PrivateRoute>
            }
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
