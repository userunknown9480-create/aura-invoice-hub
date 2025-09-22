import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter,
  Download,
  Printer,
  Calendar,
  Receipt,
  ShoppingBag,
  Package,
} from "lucide-react";

const gstRates = [0, 5, 12, 18, 28];

const mockPurchaseData = [
  {
    id: "1",
    date: "2024-01-15",
    vendor: "ABC Suppliers Pvt Ltd",
    invoiceNo: "INV-2024-001",
    gstin: "27AAAAA0000A1Z5",
    taxableValue: 10000,
    gstRate: 18,
    cgst: 900,
    sgst: 900,
    igst: 0,
    totalAmount: 11800,
  },
  {
    id: "2",
    date: "2024-01-17",
    vendor: "XYZ Trading Co",
    invoiceNo: "INV-2024-002",
    gstin: "29BBBBB1111B2Z6",
    taxableValue: 5000,
    gstRate: 12,
    cgst: 300,
    sgst: 300,
    igst: 0,
    totalAmount: 5600,
  },
  {
    id: "3",
    date: "2024-01-20",
    vendor: "DEF Enterprises",
    invoiceNo: "INV-2024-003",
    gstin: "33CCCCC2222C3Z7",
    taxableValue: 8000,
    gstRate: 5,
    cgst: 200,
    sgst: 200,
    igst: 0,
    totalAmount: 8400,
  },
];

const mockSalesData = [
  {
    id: "1",
    date: "2024-01-16",
    customer: "Customer A Ltd",
    invoiceNo: "SALE-2024-001",
    gstin: "22DDDDD3333D4Z8",
    taxableValue: 15000,
    gstRate: 18,
    cgst: 1350,
    sgst: 1350,
    igst: 0,
    totalAmount: 17700,
  },
  {
    id: "2",
    date: "2024-01-18",
    customer: "Customer B Pvt Ltd",
    invoiceNo: "SALE-2024-002",
    gstin: "24EEEEE4444E5Z9",
    taxableValue: 20000,
    gstRate: 12,
    cgst: 1200,
    sgst: 1200,
    igst: 0,
    totalAmount: 22400,
  },
];

export default function PurchaseSalesRegister() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGSTRate, setSelectedGSTRate] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("purchase");

  const currentData = activeTab === "purchase" ? mockPurchaseData : mockSalesData;
  
  const filteredData = currentData.filter((item) => {
    const matchesSearch = 
      item.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activeTab === "purchase" ? 
        (item as any).vendor.toLowerCase().includes(searchTerm.toLowerCase()) :
        (item as any).customer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesGSTRate = selectedGSTRate === null || item.gstRate === selectedGSTRate;
    
    return matchesSearch && matchesGSTRate;
  });

  const getGSTRateSummary = (rate: number) => {
    const rateData = currentData.filter(item => item.gstRate === rate);
    const totalTaxable = rateData.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalTax = rateData.reduce((sum, item) => sum + item.cgst + item.sgst + item.igst, 0);
    const totalAmount = rateData.reduce((sum, item) => sum + item.totalAmount, 0);
    
    return { count: rateData.length, totalTaxable, totalTax, totalAmount };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      `Invoice No,Date,${activeTab === 'purchase' ? 'Vendor' : 'Customer'},GSTIN,Taxable Value,GST Rate,CGST,SGST,IGST,Total Amount\n` +
      filteredData.map(item => 
        `${item.invoiceNo},${item.date},${activeTab === 'purchase' ? (item as any).vendor : (item as any).customer},${item.gstin},${item.taxableValue},${item.gstRate}%,${item.cgst},${item.sgst},${item.igst},${item.totalAmount}`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${activeTab}_register.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase/Sales Register</h1>
          <p className="text-muted-foreground mt-2">
            Detailed GST-wise registers similar to Tally Prime
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
        </div>
      </div>

      {/* GST Rate Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {gstRates.map((rate) => {
          const summary = getGSTRateSummary(rate);
          return (
            <Card 
              key={rate} 
              className={`shadow-card cursor-pointer transition-all hover:shadow-lg ${
                selectedGSTRate === rate ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedGSTRate(selectedGSTRate === rate ? null : rate)}
            >
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">GST {rate}%</p>
                  <p className="text-xl font-bold">{summary.count}</p>
                  <p className="text-xs text-muted-foreground">
                    ₹{summary.totalAmount.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={`Search ${activeTab} invoices...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={selectedGSTRate !== null ? "default" : "outline"}
              onClick={() => setSelectedGSTRate(null)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {selectedGSTRate !== null ? `GST ${selectedGSTRate}%` : "All Rates"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Register Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="purchase" className="flex items-center">
            <ShoppingBag className="mr-2 h-4 w-4" />
            Purchase Register
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center">
            <Package className="mr-2 h-4 w-4" />
            Sales Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Summary for Selected Tab */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold">{filteredData.length}</p>
                  </div>
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Taxable Value</p>
                    <p className="text-2xl font-bold">
                      ₹{filteredData.reduce((sum, item) => sum + item.taxableValue, 0).toLocaleString()}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-success" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Tax</p>
                    <p className="text-2xl font-bold">
                      ₹{filteredData.reduce((sum, item) => sum + item.cgst + item.sgst + item.igst, 0).toLocaleString()}
                    </p>
                  </div>
                  <Receipt className="h-8 w-8 text-warning" />
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                    <p className="text-2xl font-bold">
                      ₹{filteredData.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Register Table */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="capitalize">{activeTab} Register</CardTitle>
              {selectedGSTRate !== null && (
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  GST Rate: {selectedGSTRate}%
                </Badge>
              )}
            </CardHeader>
            <CardContent>
              {filteredData.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice No</TableHead>
                        <TableHead>{activeTab === 'purchase' ? 'Vendor' : 'Customer'}</TableHead>
                        <TableHead>GSTIN</TableHead>
                        <TableHead>Taxable Value</TableHead>
                        <TableHead>GST Rate</TableHead>
                        <TableHead>CGST</TableHead>
                        <TableHead>SGST</TableHead>
                        <TableHead>IGST</TableHead>
                        <TableHead>Total Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.date}</TableCell>
                          <TableCell className="font-medium">{item.invoiceNo}</TableCell>
                          <TableCell>
                            {activeTab === 'purchase' ? (item as any).vendor : (item as any).customer}
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.gstin}</TableCell>
                          <TableCell>₹{item.taxableValue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className="bg-muted/50 text-muted-foreground">
                              {item.gstRate}%
                            </Badge>
                          </TableCell>
                          <TableCell>₹{item.cgst.toLocaleString()}</TableCell>
                          <TableCell>₹{item.sgst.toLocaleString()}</TableCell>
                          <TableCell>₹{item.igst.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">₹{item.totalAmount.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  {/* Register Summary */}
                  <div className="border-t bg-muted/10 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="font-semibold">
                        Total Records: {filteredData.length}
                      </div>
                      <div className="font-semibold">
                        Taxable Value: ₹{filteredData.reduce((sum, item) => sum + item.taxableValue, 0).toLocaleString()}
                      </div>
                      <div className="font-semibold">
                        Total Tax: ₹{filteredData.reduce((sum, item) => sum + item.cgst + item.sgst + item.igst, 0).toLocaleString()}
                      </div>
                      <div className="font-semibold">
                        Total Amount: ₹{filteredData.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  {activeTab === 'purchase' ? (
                    <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  ) : (
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  )}
                  <p className="text-lg font-medium mb-2">No {activeTab} records found</p>
                  <p className="text-muted-foreground">
                    {searchTerm || selectedGSTRate !== null ? 
                      "Try adjusting your filters" : 
                      `No ${activeTab} invoices for the selected period`
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}