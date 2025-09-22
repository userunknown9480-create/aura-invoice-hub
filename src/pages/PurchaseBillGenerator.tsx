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
  ShoppingBag,
  FileText,
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

export default function PurchaseBillGenerator() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vendorName: "",
    vendorAddress: "",
    vendorGSTIN: "",
    vendorContact: "",
    billNumber: "",
    billDate: new Date().toISOString().split('T')[0],
    dueDate: "",
    placeOfSupply: "",
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
    if (!formData.vendorName || !formData.billNumber) {
      toast({
        title: "Validation Error",
        description: "Please fill in vendor name and bill number.",
        variant: "destructive",
      });
      return;
    }

    // Mock save functionality
    toast({
      title: "Purchase Bill Saved",
      description: "Purchase bill has been saved successfully.",
    });

    // Reset form
    setFormData({
      vendorName: "",
      vendorAddress: "",
      vendorGSTIN: "",
      vendorContact: "",
      billNumber: "",
      billDate: new Date().toISOString().split('T')[0],
      dueDate: "",
      placeOfSupply: "",
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Bill Generator</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage purchase bills manually
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleSave} className="gradient-success text-white">
            <Save className="mr-2 h-4 w-4" />
            Save Bill
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Vendor Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="vendorName">Vendor Name *</Label>
              <Input
                id="vendorName"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                placeholder="Enter vendor name"
              />
            </div>
            <div>
              <Label htmlFor="vendorGSTIN">Vendor GSTIN</Label>
              <Input
                id="vendorGSTIN"
                value={formData.vendorGSTIN}
                onChange={(e) => setFormData({ ...formData, vendorGSTIN: e.target.value })}
                placeholder="22AAAAA0000A1Z5"
              />
            </div>
            <div>
              <Label htmlFor="vendorContact">Contact</Label>
              <Input
                id="vendorContact"
                value={formData.vendorContact}
                onChange={(e) => setFormData({ ...formData, vendorContact: e.target.value })}
                placeholder="Phone/Email"
              />
            </div>
            <div>
              <Label htmlFor="vendorAddress">Address</Label>
              <Textarea
                id="vendorAddress"
                value={formData.vendorAddress}
                onChange={(e) => setFormData({ ...formData, vendorAddress: e.target.value })}
                placeholder="Vendor address"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Bill Information */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Bill Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="billNumber">Bill Number *</Label>
              <Input
                id="billNumber"
                value={formData.billNumber}
                onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                placeholder="PUR-2024-001"
              />
            </div>
            <div>
              <Label htmlFor="billDate">Bill Date</Label>
              <Input
                id="billDate"
                type="date"
                value={formData.billDate}
                onChange={(e) => setFormData({ ...formData, billDate: e.target.value })}
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
          </CardContent>
        </Card>

        {/* Bill Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="mr-2 h-5 w-5" />
              Bill Summary
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Line Items */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
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
                  <TableHead>Description</TableHead>
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
                        placeholder="Item description"
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