"use client";

import { useState } from "react";
import { verifyManagerAccess } from "@/actions/auth";
import { useRouter } from "nextjs-toploader/app";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

export default function LoginTemplate() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: async (secret: string) => {
      const response = await verifyManagerAccess(secret);
      return response;
    },
    onSuccess(data, variables, onMutateResult, context) {
      if (data.success) {
        router.push("/manager");
      } else {
        setError("Invalid access secret. Please try again.");
      }
    },
    onError(error, variables, onMutateResult, context) {
      setError("An error occurred. Please try again.");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    mutate(secret);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Manager Access</CardTitle>
          <CardDescription>
            Enter your access secret to access the manager dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secret">Access Secret</Label>
              <Input
                id="secret"
                type="password"
                placeholder="Enter access secret"
                name="secret"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                disabled={isPending}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
