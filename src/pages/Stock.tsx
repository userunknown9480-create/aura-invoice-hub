import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Printer,
  Download,
  Plus,
} from "lucide-react";

const mockStockData = [
  {
    id: "1",
    itemName: "Product A",
    currentStock: 150,
    minimumStock: 50,
    maximumStock: 500,
    unitPrice: 1000,
    category: "Electronics",
    supplier: "ABC Suppliers",
    lastUpdated: "2024-01-15",
  },
  {
    id: "2",
    itemName: "Product B",
    currentStock: 25,
    minimumStock: 50,
    maximumStock: 300,
    unitPrice: 750,
    category: "Accessories",
    supplier: "XYZ Trading",
    lastUpdated: "2024-01-14",
  },
  {
    id: "3",
    itemName: "Product C",
    currentStock: 200,
    minimumStock: 100,
    maximumStock: 400,
    unitPrice: 1200,
    category: "Tools",
    supplier: "DEF Company",
    lastUpdated: "2024-01-16",
  },
];

export default function Stock() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStock = mockStockData.filter((item) =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (current: number, minimum: number, maximum: number) => {
    if (current <= minimum) {
      return { status: "Low Stock", color: "bg-danger/10 text-danger border-danger/20", icon: TrendingDown };
    } else if (current >= maximum * 0.8) {
      return { status: "High Stock", color: "bg-warning/10 text-warning border-warning/20", icon: TrendingUp };
    } else {
      return { status: "Normal", color: "bg-success/10 text-success border-success/20", icon: Package };
    }
  };

  const totalItems = mockStockData.length;
  const lowStockItems = mockStockData.filter(item => item.currentStock <= item.minimumStock).length;
  const totalValue = mockStockData.reduce((sum, item) => sum + (item.currentStock * item.unitPrice), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Item Name,Current Stock,Minimum Stock,Maximum Stock,Unit Price,Category,Supplier,Last Updated\n" +
      filteredStock.map(item => 
        `${item.itemName},${item.currentStock},${item.minimumStock},${item.maximumStock},${item.unitPrice},${item.category},${item.supplier},${item.lastUpdated}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stock_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground mt-2">
            Track inventory levels and manage stock efficiently
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold">{totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Low Stock Alerts</p>
                <p className="text-2xl font-bold text-danger">{lowStockItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Stock Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Categories</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Package className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search items, categories, or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stock Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Stock Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStock.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Min/Max Stock</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Total Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStock.map((item) => {
                    const stockStatus = getStockStatus(item.currentStock, item.minimumStock, item.maximumStock);
                    const StatusIcon = stockStatus.icon;
                    
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell className="font-semibold">{item.currentStock}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Min: </span>
                            <span>{item.minimumStock}</span>
                            <span className="mx-1 text-muted-foreground">/</span>
                            <span className="text-muted-foreground">Max: </span>
                            <span>{item.maximumStock}</span>
                          </div>
                        </TableCell>
                        <TableCell>₹{item.unitPrice.toLocaleString()}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{(item.currentStock * item.unitPrice).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={stockStatus.color}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {stockStatus.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.supplier}</TableCell>
                        <TableCell>{item.lastUpdated}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No stock items found</p>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Start by adding your first stock item"}
              </p>
              <Button className="gradient-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                Add Stock Item
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}