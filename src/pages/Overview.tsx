import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { NavLink } from "react-router-dom";
import {
  FileText,
  ShoppingBag,
  Package,
  TrendingUp,
  Upload,
  Eye,
  BarChart3,
  Receipt,
  BookOpen,
  Plus,
  ShoppingCart,
  ArrowRight,
  DollarSign,
  Calendar,
} from "lucide-react";

const statsCards = [
  {
    title: "Total Invoices",
    value: "0",
    subtitle: "All time",
    icon: FileText,
    color: "text-primary",
  },
  {
    title: "Purchase Bills",
    value: "0",
    subtitle: "This month",
    icon: ShoppingBag,
    color: "text-warning",
  },
  {
    title: "Sales Bills",
    value: "0",
    subtitle: "This month",
    icon: Package,
    color: "text-success",
  },
  {
    title: "Total Amount",
    value: "₹0",
    subtitle: "Processed",
    icon: DollarSign,
    color: "text-primary",
  },
];

const quickActions = [
  {
    title: "Upload Invoice",
    description: "Process new bills with AI",
    icon: Upload,
    path: "/upload-invoice",
    gradient: "gradient-primary",
  },
  {
    title: "View Invoices",
    description: "Manage all invoices",
    icon: Eye,
    path: "/invoices",
    gradient: "gradient-success",
  },
  {
    title: "Stock Management",
    description: "Track inventory levels",
    icon: Package,
    path: "/stock",
    gradient: "gradient-primary",
  },
  {
    title: "View Reports",
    description: "Generate financial reports",
    icon: BarChart3,
    path: "/reports",
    gradient: "gradient-success",
  },
  {
    title: "GST Reports",
    description: "Generate GST filings",
    icon: Receipt,
    path: "/gst-reports",
    gradient: "gradient-primary",
  },
  {
    title: "Purchase/Sales Register",
    description: "View detailed registers",
    icon: BookOpen,
    path: "/purchase-sales-register",
    gradient: "gradient-success",
  },
  {
    title: "Purchase Bill Generator",
    description: "Create new purchase bills",
    icon: Plus,
    path: "/purchase-bill-generator",
    gradient: "gradient-primary",
  },
  {
    title: "Sales Bill Generator",
    description: "Create new sales bills",
    icon: ShoppingCart,
    path: "/sales-bill-generator",
    gradient: "gradient-success",
  },
];

export default function Overview() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, ShivaPrakash Thelkar!
        </h1>
        <p className="text-muted-foreground mb-4">
          Your AI assistant has processed <span className="font-semibold text-primary">0 invoices</span> so far
        </p>
        <div className="flex items-center space-x-4">
          <NavLink to="/upload-invoice">
            <Button className="gradient-primary text-white hover:opacity-90 transition-smooth">
              <Upload className="mr-2 h-4 w-4" />
              Upload New Invoice
            </Button>
          </NavLink>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            Processing Status: Ready
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="shadow-card hover:shadow-lg transition-smooth">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <NavLink key={index} to={action.path}>
              <Card className="shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.gradient} flex items-center justify-center mb-4`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <div className="flex items-center text-primary font-medium text-sm">
                    Get Started
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <NavLink to="/invoices">
              <Button variant="ghost" size="sm" className="text-primary hover:bg-nav-hover">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </NavLink>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No invoices yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Upload your first invoice to get started with AI-powered processing
              </p>
              <NavLink to="/upload-invoice">
                <Button className="gradient-primary text-white">Upload First Invoice</Button>
              </NavLink>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Monthly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ShoppingCart className="h-5 w-5 text-success mr-2" />
                  <span className="font-medium">Sales</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹0</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-warning mr-2" />
                  <span className="font-medium">Purchases</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">₹0</div>
                  <div className="text-xs text-muted-foreground">This Month</div>
                </div>
              </div>
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Target</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}