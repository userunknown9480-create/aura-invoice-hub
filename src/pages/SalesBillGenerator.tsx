import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Save,
  Printer,
  Calculator,
  ShoppingCart,
  FileText,
  Send,
} from "lucide-react";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
}

export default function SalesBillGenerator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: "",
    customerAddress: "",
    customerGSTIN: "",
    customerContact: "",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    placeOfSupply: "",
    paymentTerms: "",
    notes: "",
  });

  const [items, setItems] = useState<LineItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstRate: 18,
      cgst: 0,
      sgst: 0,
      igst: 0,
    },
  ]);

  const gstRates = [0, 5, 12, 18, 28];

  const calculateItemAmount = (item: LineItem) => {
    const amount = item.quantity * item.rate;
    const gstAmount = (amount * item.gstRate) / 100;
    
    return {
      ...item,
      amount,
      cgst: gstAmount / 2,
      sgst: gstAmount / 2,
      igst: 0, // Assuming intra-state supply
    };
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        return calculateItemAmount(updatedItem);
      }
      return item;
    }));
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstRate: 18,
      cgst: 0,
      sgst: 0,
      igst: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const totalCGST = items.reduce((sum, item) => sum + item.cgst, 0);
    const totalSGST = items.reduce((sum, item) => sum + item.sgst, 0);
    const totalIGST = items.reduce((sum, item) => sum + item.igst, 0);
    const totalTax = totalCGST + totalSGST + totalIGST;
    const grandTotal = subtotal + totalTax;

    return { subtotal, totalCGST, totalSGST, totalIGST, totalTax, grandTotal };
  };

  const totals = calculateTotals();

  const handleSave = () => {
    if (!formData.customerName || !formData.invoiceNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in customer name and invoice number.",
        variant: "destructive",
      });
      return;
    }

    // Mock save functionality
    toast({
      title: "Sales Invoice Saved",
      description: "Sales invoice has been saved successfully.",
    });

    // Reset form
    setFormData({
      customerName: "",
      customerAddress: "",
      customerGSTIN: "",
      customerContact: "",
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      placeOfSupply: "",
      paymentTerms: "",
      notes: "",
    });

    setItems([{
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
      gstRate: 18,
      cgst: 0,
      sgst: 0,
      igst: 0,
    }]);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendInvoice = () => {
    if (!formData.customerContact) {
      toast({
        title: "Contact Required",
        description: "Please add customer contact information to send invoice.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invoice Sent",
      description: "Sales invoice has been sent to the customer.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Bill Generator</h1>
          <p className="text-muted-foreground mt-2">
            Create and send professional sales invoices
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleSendInvoice}>
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
          <Button onClick={handleSave} className="gradient-success text-white">
            <Save className="mr-2 h-4 w-4" />
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
              />
            </div>
            <div>
              <Label htmlFor="customerGSTIN">Customer GSTIN</Label>
              <Input
                id="customerGSTIN"
                value={formData.customerGSTIN}
                onChange={(e) => setFormData({ ...formData, customerGSTIN: e.target.value })}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div>
              <Label htmlFor="customerContact">Contact</Label>
              <Input
                id="customerContact"
                value={formData.customerContact}
                onChange={(e) => setFormData({ ...formData, customerContact: e.target.value })}
                placeholder="Phone/Email"
              />
            </div>
            <div>
              <Label htmlFor="customerAddress">Billing Address</Label>
              <Textarea
                id="customerAddress"
                value={formData.customerAddress}
                onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                placeholder="Customer billing address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Invoice Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number *</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                placeholder="SALES-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="placeOfSupply">Place of Supply</Label>
              <Input
                id="placeOfSupply"
                value={formData.placeOfSupply}
                onChange={(e) => setFormData({ ...formData, placeOfSupply: e.target.value })}
                placeholder="State name"
              />
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="15-days">Net 15</SelectItem>
                  <SelectItem value="30-days">Net 30</SelectItem>
                  <SelectItem value="45-days">Net 45</SelectItem>
                  <SelectItem value="60-days">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">₹{totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST:</span>
                <span className="font-semibold">₹{totals.totalCGST.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST:</span>
                <span className="font-semibold">₹{totals.totalSGST.toLocaleString()}</span>
              </div>
              {totals.totalIGST > 0 && (
                <div className="flex justify-between">
                  <span>IGST:</span>
                  <span className="font-semibold">₹{totals.totalIGST.toLocaleString()}</span>
                </div>
              )}
              <hr />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>₹{totals.grandTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="pt-4">
              <Label htmlFor="notes">Terms & Conditions</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Terms and conditions, additional notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoice Items</CardTitle>
          <Button onClick={addItem} size="sm" className="gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product/Service</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>GST%</TableHead>
                  <TableHead>CGST</TableHead>
                  <TableHead>SGST</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                        placeholder="Product or service description"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-20"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-24"
                        min="0"
                        step="0.01"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₹{item.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.gstRate.toString()}
                        onValueChange={(value) => updateItem(item.id, 'gstRate', parseInt(value))}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {gstRates.map((rate) => (
                            <SelectItem key={rate} value={rate.toString()}>
                              {rate}%
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>₹{item.cgst.toLocaleString()}</TableCell>
                    <TableCell>₹{item.sgst.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                        className="text-danger hover:bg-danger/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}