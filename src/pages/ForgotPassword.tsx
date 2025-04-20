
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { authService } from "@/services/api";
import { toast } from "sonner";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Yêu cầu đặt lại mật khẩu đã được gửi', {
        description: 'Vui lòng kiểm tra email của bạn để được hướng dẫn tiếp theo.'
      });
    } catch (error) {
      // Error is already handled by API interceptor
      console.error('Error requesting password reset:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="py-16 md:py-24 min-h-screen flex items-center">
        <div className="page-container max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Quên mật khẩu</h1>
          <Card className="w-full">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-heading">Đặt lại mật khẩu</CardTitle>
              <CardDescription>
                {isSubmitted
                  ? "Hướng dẫn đặt lại mật khẩu đã được gửi tới email của bạn."
                  : "Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu"}
              </CardDescription>
            </CardHeader>

            {isSubmitted ? (
              <CardContent className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-md border border-primary/20 text-center">
                  <p className="text-sm">
                    Nếu tài khoản với email <span className="font-medium">{email}</span> tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
                    Vui lòng kiểm tra hộp thư đến và thư rác của bạn.
                  </p>
                </div>
              </CardContent>
            ) : (
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                        disabled={isLoading}
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col">
                  <Button
                    type="submit"
                    className="w-full mb-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-r-transparent mr-2"></div>
                        Đang gửi yêu cầu...
                      </div>
                    ) : (
                      "Gửi hướng dẫn đặt lại mật khẩu"
                    )}
                  </Button>
                </CardFooter>
              </form>
            )}
            
            <CardFooter className="flex justify-center">
              <p className="text-center text-sm">
                <Link
                  to="/login"
                  className="text-primary hover:underline"
                >
                  Quay lại đăng nhập
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
