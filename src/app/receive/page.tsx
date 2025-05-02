"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "~/providers/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ArrowDownToLine } from "lucide-react";

export default function ReceivePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !user) {
      // User not authenticated, redirect to sign in
      router.push("/auth/signin");
    }
  }, [user, isLoading, router]);
  
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto max-w-md p-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ArrowDownToLine className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Receive</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            This feature is coming soon. You'll be able to receive payments directly to your account.
          </p>
          <button 
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </CardContent>
      </Card>
    </div>
  );
} 