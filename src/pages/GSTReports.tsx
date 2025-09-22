import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Download,
  FileText,
  Calculator,
  Calendar,
  Receipt,
  Printer,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const gstr1Data = [
  {
    gstin: "27AAAAA0000A1Z5",
    customerName: "XYZ Customer Ltd",
    invoiceNo: "SALE-2024-001",
    invoiceDate: "2024-01-16",
    taxableValue: 25000,
    cgst: 2250,
    sgst: 2250,
    igst: 0,
    totalTax: 4500,
    invoiceValue: 29500,
  },
  {
    gstin: "29BBBBB1111B2Z6",
    customerName: "ABC Enterprises",
    invoiceNo: "SALE-2024-002",
    invoiceDate: "2024-01-18",
    taxableValue: 15000,
    cgst: 1350,
    sgst: 1350,
    igst: 0,
    totalTax: 2700,
    invoiceValue: 17700,
  },
];

const gstr3bData = {
  outwardSupplies: {
    taxableValue: 40000,
    cgst: 3600,
    sgst: 3600,
    igst: 0,
    cess: 0,
  },
  inwardSupplies: {
    taxableValue: 28300,
    cgst: 2547,
    sgst: 2547,
    igst: 0,
    cess: 0,
  },
  netTax: {
    cgst: 1053,
    sgst: 1053,
    igst: 0,
    cess: 0,
  },
};

export default function GSTReports() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01");
  const { toast } = useToast();

  const handleDownloadGSTR1 = () => {
    const gstr1Json = {
      gstin: "22AAAAA0000A1Z5",
      ret_period: selectedMonth.replace("-", ""),
      b2b: gstr1Data.map(item => ({
        ctin: item.gstin,
        inv: [{
          inum: item.invoiceNo,
          idt: item.invoiceDate,
          val: item.invoiceValue,
          pos: "22",
          rchrg: "N",
          etin: "",
          itms: [{
            num: 1,
            itm_det: {
              txval: item.taxableValue,
              rt: 18,
              camt: item.cgst,
              samt: item.sgst,
              iamt: item.igst,
              csamt: 0
            }
          }]
        }]
      })),
      generated_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(gstr1Json, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `GSTR1_${selectedMonth}.json`);
    linkElement.click();

    toast({
      title: "GSTR-1 Downloaded",
      description: "GSTR-1 JSON file has been downloaded successfully.",
    });
  };

  const handleDownloadGSTR3B = () => {
    const gstr3bJson = {
      gstin: "22AAAAA0000A1Z5",
      ret_period: selectedMonth.replace("-", ""),
      sup_details: {
        osup_det: {
          txval: gstr3bData.outwardSupplies.taxableValue,
          camt: gstr3bData.outwardSupplies.cgst,
          samt: gstr3bData.outwardSupplies.sgst,
          iamt: gstr3bData.outwardSupplies.igst,
          csamt: gstr3bData.outwardSupplies.cess
        },
        isup_rev: {
          txval: gstr3bData.inwardSupplies.taxableValue,
          camt: gstr3bData.inwardSupplies.cgst,
          samt: gstr3bData.inwardSupplies.sgst,
          iamt: gstr3bData.inwardSupplies.igst,
          csamt: gstr3bData.inwardSupplies.cess
        }
      },
      itc_elg: {
        itc_avl: [{
          ty: "IMPG",
          camt: gstr3bData.inwardSupplies.cgst,
          samt: gstr3bData.inwardSupplies.sgst,
          iamt: gstr3bData.inwardSupplies.igst,
          csamt: gstr3bData.inwardSupplies.cess
        }]
      },
      intr_ltfee: {
        camt: gstr3bData.netTax.cgst,
        samt: gstr3bData.netTax.sgst,
        iamt: gstr3bData.netTax.igst,
        csamt: gstr3bData.netTax.cess
      },
      generated_at: new Date().toISOString()
    };

    const dataStr = JSON.stringify(gstr3bJson, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `GSTR3B_${selectedMonth}.json`);
    linkElement.click();

    toast({
      title: "GSTR-3B Downloaded",
      description: "GSTR-3B JSON file has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">GST Reports</h1>
          <p className="text-muted-foreground mt-2">
            Generate GSTR-1 and GSTR-3B reports for GST filing
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      {/* Period Selection */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Select Filing Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Label htmlFor="period">Filing Period</Label>
              <Input
                id="period"
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <div className="space-x-2">
              <Button onClick={handleDownloadGSTR1} className="gradient-primary text-white">
                <Download className="mr-2 h-4 w-4" />
                Download GSTR-1
              </Button>
              <Button onClick={handleDownloadGSTR3B} className="gradient-success text-white">
                <Download className="mr-2 h-4 w-4" />
                Download GSTR-3B
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">₹{gstr3bData.outwardSupplies.taxableValue.toLocaleString()}</p>
              </div>
              <Receipt className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Output Tax</p>
                <p className="text-2xl font-bold">₹{(gstr3bData.outwardSupplies.cgst + gstr3bData.outwardSupplies.sgst).toLocaleString()}</p>
              </div>
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Input Tax Credit</p>
                <p className="text-2xl font-bold">₹{(gstr3bData.inwardSupplies.cgst + gstr3bData.inwardSupplies.sgst).toLocaleString()}</p>
              </div>
              <FileText className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Tax Payable</p>
                <p className="text-2xl font-bold">₹{(gstr3bData.netTax.cgst + gstr3bData.netTax.sgst).toLocaleString()}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* GST Reports Tabs */}
      <Tabs defaultValue="gstr1" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gstr1">GSTR-1 (Sales)</TabsTrigger>
          <TabsTrigger value="gstr3b">GSTR-3B (Summary)</TabsTrigger>
          <TabsTrigger value="analysis">Tax Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="gstr1" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>GSTR-1 Outward Supplies</CardTitle>
              <Badge className="bg-success/10 text-success border-success/20">
                Ready for Filing
              </Badge>
            </CardHeader>
            <CardContent>
              {gstr1Data.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer GSTIN</TableHead>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Invoice No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Taxable Value</TableHead>
                        <TableHead>CGST</TableHead>
                        <TableHead>SGST</TableHead>
                        <TableHead>Invoice Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gstr1Data.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm">{item.gstin}</TableCell>
                          <TableCell>{item.customerName}</TableCell>
                          <TableCell className="font-medium">{item.invoiceNo}</TableCell>
                          <TableCell>{item.invoiceDate}</TableCell>
                          <TableCell>₹{item.taxableValue.toLocaleString()}</TableCell>
                          <TableCell>₹{item.cgst.toLocaleString()}</TableCell>
                          <TableCell>₹{item.sgst.toLocaleString()}</TableCell>
                          <TableCell className="font-semibold">₹{item.invoiceValue.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No sales data found</p>
                  <p className="text-muted-foreground">No outward supplies for the selected period</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gstr3b" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Outward Supplies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Taxable Value</span>
                  <span className="font-semibold">₹{gstr3bData.outwardSupplies.taxableValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span className="font-semibold">₹{gstr3bData.outwardSupplies.cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST</span>
                  <span className="font-semibold">₹{gstr3bData.outwardSupplies.sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGST</span>
                  <span className="font-semibold">₹{gstr3bData.outwardSupplies.igst.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total Output Tax</span>
                  <span>₹{(gstr3bData.outwardSupplies.cgst + gstr3bData.outwardSupplies.sgst + gstr3bData.outwardSupplies.igst).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Inward Supplies (ITC)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Taxable Value</span>
                  <span className="font-semibold">₹{gstr3bData.inwardSupplies.taxableValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span className="font-semibold">₹{gstr3bData.inwardSupplies.cgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST</span>
                  <span className="font-semibold">₹{gstr3bData.inwardSupplies.sgst.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGST</span>
                  <span className="font-semibold">₹{gstr3bData.inwardSupplies.igst.toLocaleString()}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold">
                  <span>Total ITC Available</span>
                  <span>₹{(gstr3bData.inwardSupplies.cgst + gstr3bData.inwardSupplies.sgst + gstr3bData.inwardSupplies.igst).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Net Tax Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">CGST Payable</p>
                    <p className="text-2xl font-bold text-danger">₹{gstr3bData.netTax.cgst.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">SGST Payable</p>
                    <p className="text-2xl font-bold text-danger">₹{gstr3bData.netTax.sgst.toLocaleString()}</p>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">IGST Payable</p>
                    <p className="text-2xl font-bold text-danger">₹{gstr3bData.netTax.igst.toLocaleString()}</p>
                  </div>
                </div>
                <div className="p-4 bg-danger/5 border-danger/20 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Tax Payable</span>
                    <span className="text-2xl font-bold text-danger">
                      ₹{(gstr3bData.netTax.cgst + gstr3bData.netTax.sgst + gstr3bData.netTax.igst).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Due Date: {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 20).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Tax Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>18% GST Rate</span>
                    <span className="font-semibold">₹{(gstr3bData.outwardSupplies.taxableValue * 0.8).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>12% GST Rate</span>
                    <span className="font-semibold">₹{(gstr3bData.outwardSupplies.taxableValue * 0.15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>5% GST Rate</span>
                    <span className="font-semibold">₹{(gstr3bData.outwardSupplies.taxableValue * 0.05).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>GSTR-1 Status</span>
                  <Badge className="bg-success/10 text-success border-success/20">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>GSTR-3B Status</span>
                  <Badge className="bg-success/10 text-success border-success/20">Ready</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Due Date</span>
                  <span className="font-semibold">20th of next month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Late Fee</span>
                  <span className="font-semibold text-success">₹0</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}