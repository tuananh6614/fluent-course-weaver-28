
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, BookOpen, BookMarked, Award, Settings, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { authService, courseService } from "@/services/api";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the proper type for profile data
interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  bio: string;
}

// Define the proper type for the updateProfile function parameter
interface UpdateProfileParams {
  full_name: string;
  phone?: string;
  bio?: string;
}

// Schema for password change form
const passwordSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Mật khẩu hiện tại phải có ít nhất 6 ký tự",
  }),
  newPassword: z.string().min(6, {
    message: "Mật khẩu mới phải có ít nhất 6 ký tự",
  }),
  confirmPassword: z.string().min(6, {
    message: "Xác nhận mật khẩu phải có ít nhất 6 ký tự",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Mật khẩu xác nhận không khớp với mật khẩu mới",
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    bio: ''
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Password change form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch user profile
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: authService.getProfile,
  });

  // Fetch enrolled courses
  const { data: enrolledCoursesData } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: courseService.getEnrolledCourses,
    enabled: !!userData, // Only fetch when user data is available
  });
  
  const enrolledCourses = enrolledCoursesData?.data || [];

  // Update profile mutation with correct types
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileParams) => authService.updateProfile(data),
    onSuccess: () => {
      toast.success("Thông tin đã được cập nhật");
    },
    onError: (error: any) => { // Use any for now to handle different error shapes
      toast.error("Lỗi cập nhật thông tin", { 
        description: error.response?.data?.message || "Vui lòng thử lại"
      });
    }
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string, newPassword: string }) => 
      authService.changePassword(data),
    onSuccess: () => {
      toast.success("Mật khẩu đã được thay đổi thành công");
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast.error("Lỗi thay đổi mật khẩu", { 
        description: error.response?.data?.message || "Vui lòng thử lại"
      });
    }
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (userData?.data) {
      setFormData({
        full_name: userData.data.full_name || '',
        email: userData.data.email || '',
        phone: userData.data.phone || '',
        bio: userData.data.bio || ''
      });
    }
  }, [userData]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // Handle form submission with proper type
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      full_name: formData.full_name,
      phone: formData.phone,
      bio: formData.bio
    });
  };

  // Handle password form submission
  const onPasswordSubmit = (data: PasswordFormValues) => {
    changePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: 'currentPassword' | 'newPassword' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="py-12 px-4 md:py-16 page-container">
          <div className="flex justify-center items-center min-h-[400px]">
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Layout>
        <div className="py-12 px-4 md:py-16 page-container">
          <div className="flex flex-col justify-center items-center min-h-[400px]">
            <p className="text-red-500 mb-4">Không thể tải thông tin người dùng</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (!formData.full_name) return "U";
    return formData.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Layout>
      <section className="py-12 px-4 md:py-16">
        <div className="page-container">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full md:w-1/4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <Avatar className="h-24 w-24 mb-4">
                      <AvatarImage src={userData?.data?.avatar_url} alt="Ảnh đại diện" />
                      <AvatarFallback>
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="text-xl font-bold">{formData.full_name}</h2>
                    <p className="text-sm text-muted-foreground mt-1">{formData.email}</p>
                  </div>
                  
                  <nav className="space-y-1">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#profile">
                        <User className="mr-2 h-4 w-4" />
                        Thông Tin Cá Nhân
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#security">
                        <Lock className="mr-2 h-4 w-4" />
                        Bảo Mật
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#courses">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Khóa Học Của Tôi
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#favorites">
                        <BookMarked className="mr-2 h-4 w-4" />
                        Khóa Học Yêu Thích
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#certificates">
                        <Award className="mr-2 h-4 w-4" />
                        Chứng Chỉ
                      </a>
                    </Button>
                    <Separator className="my-2" />
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="#settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Cài Đặt
                      </a>
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <Tabs defaultValue="profile">
                <TabsList className="mb-8">
                  <TabsTrigger value="profile">Thông Tin Cá Nhân</TabsTrigger>
                  <TabsTrigger value="security">Bảo Mật</TabsTrigger>
                  <TabsTrigger value="courses">Khóa Học</TabsTrigger>
                  <TabsTrigger value="certificates">Chứng Chỉ</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông Tin Cá Nhân</CardTitle>
                      <CardDescription>
                        Quản lý thông tin cá nhân của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="grid gap-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                          <Label htmlFor="full_name">Họ và tên</Label>
                          <Input 
                            id="full_name" 
                            placeholder="Họ và tên"
                            value={formData.full_name}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            value={formData.email} 
                            disabled 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Số điện thoại</Label>
                          <Input 
                            id="phone" 
                            placeholder="0123456789"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="bio">Giới thiệu bản thân</Label>
                          <textarea 
                            id="bio" 
                            className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Giới thiệu ngắn về bản thân bạn..."
                            value={formData.bio}
                            onChange={handleChange}
                          />
                        </div>
                      
                        <div className="flex justify-end">
                          <Button 
                            type="submit"
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security">
                  <Card>
                    <CardHeader>
                      <CardTitle>Bảo Mật</CardTitle>
                      <CardDescription>
                        Quản lý cài đặt bảo mật và mật khẩu của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...passwordForm}>
                        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                          <FormField
                            control={passwordForm.control}
                            name="currentPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mật khẩu hiện tại</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={showPassword.currentPassword ? "text" : "password"}
                                      placeholder="Nhập mật khẩu hiện tại"
                                      {...field}
                                    />
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => togglePasswordVisibility('currentPassword')}
                                  >
                                    {showPassword.currentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="newPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Mật khẩu mới</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={showPassword.newPassword ? "text" : "password"}
                                      placeholder="Nhập mật khẩu mới"
                                      {...field}
                                    />
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => togglePasswordVisibility('newPassword')}
                                  >
                                    {showPassword.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={passwordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                <div className="relative">
                                  <FormControl>
                                    <Input
                                      type={showPassword.confirmPassword ? "text" : "password"}
                                      placeholder="Xác nhận mật khẩu mới"
                                      {...field}
                                    />
                                  </FormControl>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => togglePasswordVisibility('confirmPassword')}
                                  >
                                    {showPassword.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end">
                            <Button 
                              type="submit"
                              disabled={changePasswordMutation.isPending}
                            >
                              {changePasswordMutation.isPending ? 'Đang xử lý...' : 'Thay Đổi Mật Khẩu'}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Courses Tab */}
                <TabsContent value="courses">
                  <Card>
                    <CardHeader>
                      <CardTitle>Khóa Học Của Tôi</CardTitle>
                      <CardDescription>
                        Các khóa học bạn đã đăng ký
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {enrolledCourses.length > 0 ? (
                        <div className="grid gap-4">
                          {enrolledCourses.map((enrollment) => (
                            <div key={enrollment.enrollment_id} className="flex items-center justify-between p-4 border rounded-md">
                              <div>
                                <h3 className="font-medium">{enrollment.course?.title || "Khóa học"}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {enrollment.progress_percent}% hoàn thành
                                </p>
                              </div>
                              <Button asChild variant="outline">
                                <a href={`/courses/${enrollment.course_id}`}>
                                  Tiếp tục
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-muted-foreground">Bạn chưa đăng ký khóa học nào.</p>
                          <Button className="mt-4" asChild>
                            <a href="/courses">Khám Phá Khóa Học</a>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Certificates Tab */}
                <TabsContent value="certificates">
                  <Card>
                    <CardHeader>
                      <CardTitle>Chứng Chỉ</CardTitle>
                      <CardDescription>
                        Chứng chỉ bạn đã đạt được
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">Bạn chưa có chứng chỉ nào.</p>
                        <p className="text-sm mt-2">Hoàn thành các khóa học để nhận chứng chỉ.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
