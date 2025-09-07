"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Stethoscope, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Please wait");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const result = await signIn("credentials", {
        ...formData,
        redirect: false,
      });
      if (result.error) {
        setLoading(false);
        toast.error(result.error || "Something went wrong.");
      } else {
        toast.success("Login successful");
        setLoadingText("Redirecting to dashboard");
        // Redirect to the admin dashboard after successful login
        router.replace("/admin/dashboard");
      }
    } catch (error) {
      toast.error(
        error.message || "An unexpected error occurred. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src={"/assets/images/hero-img.png"}
          alt="Medical professionals providing healthcare"
          className="w-full h-full object-cover opacity-20"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 to-primary/60"></div>
      </div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8 text-primary-foreground">
            <h1 className="text-3xl font-bold mb-2">Admin Portal</h1>
            <p>Secure access to your healthcare dashboard</p>
          </div>

          {/* Login Card */}
          <Card className="shadow-medical border-medical-border/50 animate-slide-up">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <Heart className="h-5 w-5 text-medical-green" />
                Login
              </CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="border-medical-border/50 focus:border-medical-blue focus:ring-medical-blue/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="border-medical-border/50 focus:border-medical-blue focus:ring-medical-blue/20 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className={`w-full ${
                    loading && "pointer-events-none opacity-50"
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" />
                      {loadingText}
                    </>
                  ) : (
                    <>
                      <Stethoscope className="h-4 w-4 mr-2" />
                      Login to Dashboard
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-primary-foreground">
            <p>&copy; 2025 HealthCare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
