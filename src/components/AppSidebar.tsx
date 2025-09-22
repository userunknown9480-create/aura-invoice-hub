import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  FileText,
  Package,
  TrendingUp,
  Receipt,
  BookOpen,
  Plus,
  ShoppingCart,
  RefreshCw,
  Upload,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Overview", path: "/", icon: BarChart3 },
  { name: "Invoices", path: "/invoices", icon: FileText },
  { name: "Stock", path: "/stock", icon: Package },
  { name: "Reports", path: "/reports", icon: TrendingUp },
  { name: "GST Reports", path: "/gst-reports", icon: Receipt },
  { name: "Purchase/Sales Register", path: "/purchase-sales-register", icon: BookOpen },
  { name: "Purchase Bill Generator", path: "/purchase-bill-generator", icon: Plus },
  { name: "Sales Bill Generator", path: "/sales-bill-generator", icon: ShoppingCart },
  { name: "Tally Sync", path: "/tally-sync", icon: RefreshCw },
];

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export function AppSidebar({ collapsed, onCollapse }: AppSidebarProps) {
  const location = useLocation();

  return (
    <div
      className={cn(
        "bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold text-primary">Retail Bill Book</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Invoice Management</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapse(!collapsed)}
            className="transition-smooth hover:bg-nav-hover"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">ShivaPrakash Thelkar</p>
              <p className="text-xs text-muted-foreground truncate">22AAAAA0000A1Z5</p>
            </div>
            <Button variant="ghost" size="sm" className="text-danger hover:bg-danger/10">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink key={item.name} to={item.path}>
              <div
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg transition-smooth",
                  "hover:bg-nav-hover",
                  isActive && "bg-nav-active-bg text-nav-active font-medium"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="ml-3 text-sm">{item.name}</span>}
              </div>
            </NavLink>
          );
        })}

        {/* Quick Upload Button */}
        <div className="pt-4">
          <NavLink to="/upload-invoice">
            <Button
              className={cn(
                "w-full justify-start gradient-primary text-white hover:opacity-90 transition-smooth",
                collapsed && "px-2"
              )}
            >
              <Upload className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Upload Invoice</span>}
            </Button>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}