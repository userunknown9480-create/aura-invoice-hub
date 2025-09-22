import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  RefreshCw,
  Settings,
  CheckCircle,
  AlertCircle,
  Download,
  Upload,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";

const mockSyncData = [
  {
    id: "1",
    type: "Purchase",
    invoiceNo: "INV-2024-001",
    date: "2024-01-15",
    vendor: "ABC Suppliers Pvt Ltd",
    amount: 11800,
    status: "synced",
    lastSync: "2024-01-15 10:30 AM",
  },
  {
    id: "2",
    type: "Sales",
    invoiceNo: "SALE-2024-001",
    date: "2024-01-16",
    vendor: "XYZ Customer Ltd",
    amount: 25000,
    status: "pending",
    lastSync: "-",
  },
  {
    id: "3",
    type: "Purchase",
    invoiceNo: "INV-2024-002",
    date: "2024-01-17",
    vendor: "DEF Trading Co",
    amount: 8500,
    status: "failed",
    lastSync: "2024-01-17 02:15 PM",
  },
];

export default function TallySync() {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [connectionSettings, setConnectionSettings] = useState({
    tallyPath: "C:\\Program Files (x86)\\Tally.ERP 9",
    companyName: "",
    serverPort: "9000",
    xmlDataPath: "",
  });

  const handleConnect = () => {
    // Mock connection process
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          setIsConnected(true);
          toast({
            title: "Connected to Tally",
            description: "Successfully connected to Tally ERP/Prime.",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({
      title: "Disconnected",
      description: "Disconnected from Tally ERP/Prime.",
    });
  };

  const handleSyncAll = () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please connect to Tally first.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          toast({
            title: "Sync Complete",
            description: "All invoices have been synced with Tally.",
          });
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "failed":
        return "bg-danger/10 text-danger border-danger/20";
      default:
        return "bg-muted/10 text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <RefreshCw className="h-4 w-4" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const syncedCount = mockSyncData.filter(item => item.status === "synced").length;
  const pendingCount = mockSyncData.filter(item => item.status === "pending").length;
  const failedCount = mockSyncData.filter(item => item.status === "failed").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tally Sync</h1>
          <p className="text-muted-foreground mt-2">
            Synchronize your invoices with Tally ERP/Prime
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <Wifi className="h-5 w-5 text-success" />
                <span className="text-success font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Disconnected</span>
              </>
            )}
          </div>
          {isConnected ? (
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect
            </Button>
          ) : (
            <Button onClick={handleConnect} className="gradient-primary text-white">
              <Database className="mr-2 h-4 w-4" />
              Connect to Tally
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Synced</p>
                <p className="text-2xl font-bold text-success">{syncedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-danger">{failedCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-danger" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="text-center">
              <Button 
                onClick={handleSyncAll} 
                disabled={!isConnected || isSyncing}
                className="w-full gradient-success text-white"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Sync All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Progress */}
      {isSyncing && (
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Synchronizing...</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs for different sections */}
      <Tabs defaultValue="sync-status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sync-status">Sync Status</TabsTrigger>
          <TabsTrigger value="settings">Connection Settings</TabsTrigger>
          <TabsTrigger value="logs">Sync Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="sync-status" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Invoice Sync Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Vendor/Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Sync</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSyncData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">{item.type}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.invoiceNo}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.vendor}</TableCell>
                        <TableCell>₹{item.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item.status)}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 capitalize">{item.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{item.lastSync}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            disabled={!isConnected}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Tally Connection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tallyPath">Tally Installation Path</Label>
                  <Input
                    id="tallyPath"
                    value={connectionSettings.tallyPath}
                    onChange={(e) => setConnectionSettings({
                      ...connectionSettings,
                      tallyPath: e.target.value
                    })}
                    placeholder="C:\Program Files (x86)\Tally.ERP 9"
                  />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    value={connectionSettings.companyName}
                    onChange={(e) => setConnectionSettings({
                      ...connectionSettings,
                      companyName: e.target.value
                    })}
                    placeholder="Your Company Name"
                  />
                </div>
                <div>
                  <Label htmlFor="serverPort">Server Port</Label>
                  <Input
                    id="serverPort"
                    value={connectionSettings.serverPort}
                    onChange={(e) => setConnectionSettings({
                      ...connectionSettings,
                      serverPort: e.target.value
                    })}
                    placeholder="9000"
                  />
                </div>
                <div>
                  <Label htmlFor="xmlDataPath">XML Data Path</Label>
                  <Input
                    id="xmlDataPath"
                    value={connectionSettings.xmlDataPath}
                    onChange={(e) => setConnectionSettings({
                      ...connectionSettings,
                      xmlDataPath: e.target.value
                    })}
                    placeholder="C:\Tally Data"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="gradient-primary text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
                <Button variant="outline">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Sync Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto Sync</p>
                  <p className="text-sm text-muted-foreground">Automatically sync new invoices</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sync Interval</p>
                  <p className="text-sm text-muted-foreground">How often to sync data</p>
                </div>
                <Button variant="outline" size="sm">Every Hour</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Error Notifications</p>
                  <p className="text-sm text-muted-foreground">Get notified of sync failures</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sync Logs</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Logs
                </Button>
                <Button variant="outline" size="sm">
                  Clear Logs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                <div className="p-2 border-l-4 border-success bg-success/5 rounded">
                  <div className="flex justify-between text-sm">
                    <span>[2024-01-15 10:30:15] SUCCESS</span>
                    <span>INV-2024-001</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Successfully synced purchase invoice to Tally</p>
                </div>
                <div className="p-2 border-l-4 border-danger bg-danger/5 rounded">
                  <div className="flex justify-between text-sm">
                    <span>[2024-01-17 14:15:32] ERROR</span>
                    <span>INV-2024-002</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Failed to sync: Invalid vendor GSTIN format</p>
                </div>
                <div className="p-2 border-l-4 border-warning bg-warning/5 rounded">
                  <div className="flex justify-between text-sm">
                    <span>[2024-01-16 09:45:20] WARNING</span>
                    <span>SALE-2024-001</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Invoice pending: Waiting for Tally company to be opened</p>
                </div>
                <div className="p-2 border-l-4 border-success bg-success/5 rounded">
                  <div className="flex justify-between text-sm">
                    <span>[2024-01-14 16:20:45] SUCCESS</span>
                    <span>Connection</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Successfully connected to Tally ERP 9</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}