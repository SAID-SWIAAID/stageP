import { SidebarInput } from "../components/ui/sidebar"
import { Link, useLocation } from "react-router-dom" // Use useLocation for active state
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from "./ui/sidebar"
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  BarChart2,
  Upload,
  Download,
  LayoutDashboard,
  CreditCard,
  BookOpen,
  Truck,
  TrendingUp,
  Plus,
  ChevronDown,
  ChevronUp,
  User2,
  Store,
  Boxes,
  ClipboardList,
  Handshake,
  LineChart,
  Coins,
  FileIcon as FileInvoice,
  PiggyBank,
  Cog,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"

export default function AppSidebar() {
  const location = useLocation() // Get current location for active state

  const mainItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "My Products", url: "/my-products", icon: Package },
    { title: "Add Product", url: "/add-product", icon: Plus },
    { title: "Categories", url: "/categories", icon: BookOpen },
    { title: "My Boutiques", url: "/boutique-management", icon: Store },
    { title: "Inventory", url: "/inventory", icon: Boxes },
    { title: "Boutique", url: "/boutique", icon: Store },
    { title: "Bulk Upload", url: "/bulk-upload", icon: Upload },
    { title: "Export Products", url: "/export-products", icon: Download },
  ]

  const salesItems = [
    { title: "Clients", url: "/clients", icon: Users },
    { title: "Stock", url: "/stock", icon: ClipboardList },
    { title: "Orders", url: "/orders", icon: ShoppingCart },
    { title: "Sales History", url: "/sales-history", icon: TrendingUp },
    { title: "Electronic Payment", url: "/electronic-payment", icon: CreditCard },
    { title: "Catalog", url: "/catalog", icon: BookOpen },
  ]

  const financialItems = [
    { title: "Purchases", url: "/purchases", icon: Truck },
    { title: "Suppliers", url: "/suppliers", icon: Handshake },
    { title: "Statistics", url: "/statistics", icon: LineChart },
    { title: "Cash Collection", url: "/cash-collection", icon: Coins },
    { title: "Invoices", url: "/invoices", icon: FileInvoice },
    { title: "Expenses", url: "/expenses", icon: PiggyBank },
  ]

  const otherItems = [
    { title: "Configuration", url: "/configuration", icon: Cog },
    { title: "Client Dashboard", url: "/client-dashboard", icon: LayoutDashboard },
    { title: "Dummy API", url: "/dummy-api", icon: BarChart2 }, // Added Dummy API link
  ]

  return (
    <SidebarProvider>
      <Sidebar className="w-48" style={{ width: '192px', minWidth: '192px', maxWidth: '192px' }}>
        <SidebarHeader className="px-3 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="text-xs h-8">
                    Select Workspace
                    <ChevronDown className="ml-auto h-3 w-3" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <span>Acme Inc</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Monsters Inc</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarInput placeholder="Search..." className="text-xs h-8" />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs px-2 py-1">Main</SidebarGroupLabel>
            <SidebarGroupContent>
              {mainItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.url}>
                    <Link to={item.url} className="w-full">
                      <SidebarMenuButton className={`w-full h-8 text-xs ${isActive ? "bg-accent" : ""}`}>
                        <Icon className="h-3 w-3" />
                        <span className="text-xs">{item.title}</span>
                      </SidebarMenuButton>
                    </Link>
                  </SidebarMenuItem>
                )
              })}
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between text-xs px-2 py-1">
                  Sales
                  <ChevronUp className="h-3 w-3" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {salesItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.url
                    return (
                      <SidebarMenuItem key={item.url}>
                        <Link to={item.url} className="w-full">
                          <SidebarMenuButton className={`w-full h-8 text-xs ${isActive ? "bg-accent" : ""}`}>
                            <Icon className="h-3 w-3" />
                            <span className="text-xs">{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          <SidebarGroup>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between text-xs px-2 py-1">
                  Financial
                  <ChevronDown className="h-3 w-3" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {financialItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.url
                    return (
                      <SidebarMenuItem key={item.url}>
                        <Link to={item.url} className="w-full">
                          <SidebarMenuButton className={`w-full h-8 text-xs ${isActive ? "bg-accent" : ""}`}>
                            <Icon className="h-3 w-3" />
                            <span className="text-xs">{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>

          <SidebarGroup>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex items-center justify-between text-xs px-2 py-1">
                  Other
                  <ChevronDown className="h-3 w-3" />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  {otherItems.map((item) => {
                    const Icon = item.icon
                    const isActive = location.pathname === item.url
                    return (
                      <SidebarMenuItem key={item.url}>
                        <Link to={item.url} className="w-full">
                          <SidebarMenuButton className={`w-full h-8 text-xs ${isActive ? "bg-accent" : ""}`}>
                            <Icon className="h-3 w-3" />
                            <span className="text-xs">{item.title}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="px-3 py-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="text-xs h-8">
                    <User2 className="h-3 w-3" />
                    Username
                    <ChevronUp className="ml-auto h-3 w-3" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
                  <DropdownMenuItem>
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}