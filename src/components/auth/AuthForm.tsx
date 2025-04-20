import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon, EyeOffIcon, Mail, KeyRound } from "lucide-react";
import { authService } from "@/services/api";
import { toast } from "sonner";

interface AuthFormProps {
  type: "login" | "register";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (type === "login") {
        const response = await authService.login(email, password);
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        
        // Store user data (except sensitive info)
        const userData = {
          id: response.user.user_id,
          full_name: response.user.full_name,
          email: response.user.email,
          role: response.user.role,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        toast.success('Đăng nhập thành công', {
          description: `Chào mừng ${response.user.full_name} quay trở lại!`,
        });
        
        // Redirect based on user role
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Registration
        if (!agreeTerms) {
          toast.error('Vui lòng đồng ý với điều khoản dịch vụ');
          setIsLoading(false);
          return;
        }
        
        await authService.register(name, email, password);
        toast.success('Đăng ký thành công', {
          description: 'Vui lòng đăng nhập để tiếp tục.',
        });
        navigate('/login');
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Error is already handled by the API interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-heading">
          {type === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Nhập thông tin đăng nhập của bạn"
            : "Nhập thông tin để tạo tài khoản mới"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Họ và tên</Label>
              <Input
                id="name"
                placeholder="Nhập họ và tên của bạn"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}
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
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mật khẩu</Label>
              {type === "login" && (
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
                disabled={isLoading}
              />
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                </span>
              </Button>
            </div>
          </div>
          {type === "register" && (
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm">
                Tôi đồng ý với{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Điều khoản dịch vụ
                </Link>{" "}
                và{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Chính sách bảo mật
                </Link>
              </Label>
            </div>
          )}
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
                {type === "login" ? "Đang đăng nhập..." : "Đang tạo tài khoản..."}
              </div>
            ) : type === "login" ? (
              "Đăng nhập"
            ) : (
              "Tạo tài khoản"
            )}
          </Button>
          <p className="text-center text-sm">
            {type === "login" ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
            <Link
              to={type === "login" ? "/register" : "/login"}
              className="text-primary hover:underline"
            >
              {type === "login" ? "Đăng ký" : "Đăng nhập"}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
