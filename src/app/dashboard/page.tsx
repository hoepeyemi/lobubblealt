"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowDownToLine, ArrowRight, ArrowUpRight, Eye, EyeOff, Receipt } from "lucide-react";
import { useAuth } from "~/providers/auth-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { toast } from "react-hot-toast";

interface Transaction {
  id: string;
  type: "send" | "receive";
  amount: number;
  recipient: string;
  date: string;
}

// Mock transactions for demonstration
const mockTransactions: Transaction[] = [
  {
    id: "tx1",
    type: "send",
    amount: 20,
    recipient: "John Doe",
    date: "2023-06-15",
  },
  {
    id: "tx2",
    type: "receive",
    amount: 50,
    recipient: "Alice Smith",
    date: "2023-06-10",
  },
  {
    id: "tx3",
    type: "send",
    amount: 15,
    recipient: "Bob Johnson",
    date: "2023-06-05",
  },
];

// Create a separate component that uses search params
function DashboardContent() {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [balance] = useState("673,000.56"); // Mock balance
  const router = useRouter();
  
  // If the user isn't loaded yet, show a loading state
  if (!user) {
    return <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mb-4"></div>
      <p>Loading user data...</p>
    </div>;
  }

  return (
    <div className="container mx-auto max-w-md space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Welcome, {user.firstName || "User"}
        </h1>
        <Button variant="ghost" onClick={() => {
          logout();
          router.push("/auth/signin");
        }}>
          Logout
        </Button>
      </div>

      <Card className="overflow-hidden bg-blue-600 text-white">
        <CardContent className="p-6">
          <div className="space-y-1">
            <h2 className="text-sm font-medium text-blue-100">Current Balance</h2>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">
                ${showBalance ? balance : "••••••"}
              </p>
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="rounded-full p-1 hover:bg-blue-500"
              >
                {showBalance ? (
                  <EyeOff className="h-4 w-4 text-blue-100" />
                ) : (
                  <Eye className="h-4 w-4 text-blue-100" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button 
              variant="outline" 
              className="bg-blue-500 text-white hover:bg-blue-400 border-blue-400"
              onClick={() => toast.success("Send feature coming soon!")}
            >
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Send
            </Button>
            <Button 
              variant="outline" 
              className="bg-blue-500 text-white hover:bg-blue-400 border-blue-400"
              onClick={() => toast.success("Receive feature coming soon!")}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Receive
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="cursor-pointer transition-colors hover:bg-gray-50" onClick={() => toast.success("Send feature coming soon!")}>
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <ArrowUpRight className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold">Send Money</h3>
              <p className="text-sm text-gray-500">Transfer to others</p>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-gray-50" onClick={() => toast.success("Receive feature coming soon!")}>
          <CardContent className="flex items-center space-x-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <ArrowDownToLine className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold">Receive Money</h3>
              <p className="text-sm text-gray-500">Get paid by others</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="space-y-4 pt-4">
          {mockTransactions.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockTransactions.map((tx) => (
                <Card key={tx.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === "receive" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                          {tx.type === "receive" ? (
                            <ArrowDownToLine className="h-5 w-5" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{tx.recipient}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(tx.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold ${tx.type === "receive" ? "text-green-600" : "text-red-600"}`}>
                          {tx.type === "receive" ? "+" : "-"}${tx.amount}
                        </p>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Main component with Suspense boundary
export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
} 