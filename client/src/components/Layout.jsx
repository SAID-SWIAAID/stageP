import AppSidebar from "./Sidebar"

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Fixed-width Sidebar */}
      <div className="w-48 flex-shrink-0">
        <AppSidebar />
      </div>

      {/* Main content area with perfect centering */}
      <main className="flex-1 p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}