import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Image, File, Check, Printer, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  vendorName: string;
  vendorGST: string;
  totalAmount: string;
  gstAmount: string;
  items: { name: string; quantity: string; rate: string; amount: string }[];
}

export default function UploadInvoice() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<InvoiceData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'image/tiff', 'image/bmp'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPG, PNG, GIF, WebP) or PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    
    // Create preview URL for images
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    // Simulate AI processing
    processInvoice(file);
  };

  const processInvoice = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock extracted data
    const mockData: InvoiceData = {
      invoiceNumber: "INV-2024-001",
      date: "2024-01-15",
      vendorName: "ABC Suppliers Pvt Ltd",
      vendorGST: "27AAAAA0000A1Z5",
      totalAmount: "11800.00",
      gstAmount: "1800.00",
      items: [
        { name: "Product A", quantity: "10", rate: "1000.00", amount: "10000.00" },
        { name: "Service Charges", quantity: "1", rate: "1800.00", amount: "1800.00" }
      ]
    };
    
    setExtractedData(mockData);
    setIsProcessing(false);
    
    toast({
      title: "Invoice processed successfully",
      description: "AI has extracted the data. Please review and save.",
    });
  };

  const handleSave = () => {
    if (!extractedData) return;
    
    toast({
      title: "Invoice saved",
      description: "Invoice has been saved to your database.",
    });
    
    // Reset form
    setUploadedFile(null);
    setPreviewUrl(null);
    setExtractedData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Upload Invoice</h1>
        <p className="text-muted-foreground mt-2">
          Upload invoices in any format - our AI will extract all the important data
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Invoice
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    dragActive ? "border-primary bg-nav-hover" : "border-border hover:border-primary/50"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Drop your invoice here</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        or click to browse files
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <Image className="mr-1 h-3 w-3" />
                        Images
                      </div>
                      <div className="flex items-center">
                        <File className="mr-1 h-3 w-3" />
                        PDF
                      </div>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="gradient-primary text-white"
                    >
                      Choose File
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileInput}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="mr-3 h-5 w-5 text-success" />
                      <div>
                        <p className="font-medium">{uploadedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Check className="h-5 w-5 text-success" />
                  </div>

                  {previewUrl && (
                    <div className="border rounded-lg p-4">
                      <p className="text-sm font-medium mb-2">Preview</p>
                      <img
                        src={previewUrl}
                        alt="Invoice preview"
                        className="max-w-full h-auto max-h-64 object-contain mx-auto rounded"
                      />
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center py-4">
                      <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                      <p className="text-sm text-muted-foreground">AI is processing your invoice...</p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => {
                      setUploadedFile(null);
                      setPreviewUrl(null);
                      setExtractedData(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="w-full"
                  >
                    Upload Different File
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Extracted Data Section */}
        <div className="space-y-6">
          {extractedData && (
            <Card className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Extracted Invoice Data</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                  <Button size="sm" onClick={handleSave} className="gradient-success text-white">
                    <Save className="mr-2 h-4 w-4" />
                    Save Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={extractedData.invoiceNumber}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        invoiceNumber: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={extractedData.date}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        date: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="vendorName">Vendor Name</Label>
                  <Input
                    id="vendorName"
                    value={extractedData.vendorName}
                    onChange={(e) => setExtractedData({
                      ...extractedData,
                      vendorName: e.target.value
                    })}
                  />
                </div>

                <div>
                  <Label htmlFor="vendorGST">Vendor GST Number</Label>
                  <Input
                    id="vendorGST"
                    value={extractedData.vendorGST}
                    onChange={(e) => setExtractedData({
                      ...extractedData,
                      vendorGST: e.target.value
                    })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gstAmount">GST Amount</Label>
                    <Input
                      id="gstAmount"
                      value={extractedData.gstAmount}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        gstAmount: e.target.value
                      })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalAmount">Total Amount</Label>
                    <Input
                      id="totalAmount"
                      value={extractedData.totalAmount}
                      onChange={(e) => setExtractedData({
                        ...extractedData,
                        totalAmount: e.target.value
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Label>Items</Label>
                  <div className="space-y-2 mt-2">
                    {extractedData.items.map((item, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-2">
                        <Input
                          placeholder="Item name"
                          value={item.name}
                          onChange={(e) => {
                            const newItems = [...extractedData.items];
                            newItems[index].name = e.target.value;
                            setExtractedData({ ...extractedData, items: newItems });
                          }}
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...extractedData.items];
                              newItems[index].quantity = e.target.value;
                              setExtractedData({ ...extractedData, items: newItems });
                            }}
                          />
                          <Input
                            placeholder="Rate"
                            value={item.rate}
                            onChange={(e) => {
                              const newItems = [...extractedData.items];
                              newItems[index].rate = e.target.value;
                              setExtractedData({ ...extractedData, items: newItems });
                            }}
                          />
                          <Input
                            placeholder="Amount"
                            value={item.amount}
                            onChange={(e) => {
                              const newItems = [...extractedData.items];
                              newItems[index].amount = e.target.value;
                              setExtractedData({ ...extractedData, items: newItems });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}