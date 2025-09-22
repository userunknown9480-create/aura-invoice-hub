import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Overview from "./pages/Overview";
import Invoices from "./pages/Invoices";
import Stock from "./pages/Stock";
import Reports from "./pages/Reports";
import GSTReports from "./pages/GSTReports";
import PurchaseSalesRegister from "./pages/PurchaseSalesRegister";
import PurchaseBillGenerator from "./pages/PurchaseBillGenerator";
import SalesBillGenerator from "./pages/SalesBillGenerator";
import TallySync from "./pages/TallySync";
import UploadInvoice from "./pages/UploadInvoice";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Overview />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="stock" element={<Stock />} />
            <Route path="reports" element={<Reports />} />
            <Route path="gst-reports" element={<GSTReports />} />
            <Route path="purchase-sales-register" element={<PurchaseSalesRegister />} />
            <Route path="purchase-bill-generator" element={<PurchaseBillGenerator />} />
            <Route path="sales-bill-generator" element={<SalesBillGenerator />} />
            <Route path="tally-sync" element={<TallySync />} />
            <Route path="upload-invoice" element={<UploadInvoice />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
