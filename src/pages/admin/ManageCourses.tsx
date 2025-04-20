
import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash, Eye, RefreshCcw } from 'lucide-react';
import { courseService } from '@/services/api';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const ManageCourses = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    thumbnail: ""
  });
  
  // Fetch courses
  const { 
    data: coursesResponse, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['adminCourses'],
    queryFn: courseService.getAllCourses,
  });

  const courses = coursesResponse?.data || [];
  
  // Filter courses based on search query
  const filteredCourses = courses.filter((course) => 
    course.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Add new course mutation
  const createCourseMutation = useMutation({
    mutationFn: courseService.createCourse,
    onSuccess: () => {
      toast.success("Thêm khóa học thành công");
      setIsAddDialogOpen(false);
      setNewCourse({ title: "", description: "", thumbnail: "" });
      refetch();
    },
    onError: () => {
      toast.error("Không thể thêm khóa học");
    }
  });
  
  // Handle add course form submission
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title) {
      toast.error("Vui lòng nhập tiêu đề khóa học");
      return;
    }
    createCourseMutation.mutate(newCourse);
  };
  
  // Handle opening the add course dialog
  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="page-container">
          <h1 className="text-3xl font-bold mb-8">Quản Trị Hệ Thống</h1>
          
          <Card className="p-6">
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="mb-8 w-full justify-start">
                <TabsTrigger value="dashboard" asChild>
                  <Link to="/admin/dashboard">Tổng Quan</Link>
                </TabsTrigger>
                <TabsTrigger value="courses" asChild>
                  <Link to="/admin/courses">Khóa Học</Link>
                </TabsTrigger>
                <TabsTrigger value="users" asChild>
                  <Link to="/admin/users">Người Dùng</Link>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Quản Lý Khóa Học</h2>
                <Button onClick={handleOpenAddDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Khóa Học Mới
                </Button>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Tìm kiếm khóa học..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" onClick={() => refetch()} className="ml-2">
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Tải lại
                </Button>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Đang tải khóa học...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12 border rounded-md bg-muted/10">
                  <h3 className="text-lg font-medium mb-2">Không thể tải danh sách khóa học</h3>
                  <p className="text-muted-foreground mb-4">Đã xảy ra lỗi khi tải dữ liệu</p>
                  <Button onClick={() => refetch()}>
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Thử lại
                  </Button>
                </div>
              ) : filteredCourses.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Tên Khóa Học</TableHead>
                      <TableHead className="hidden md:table-cell">Danh Mục</TableHead>
                      <TableHead className="hidden md:table-cell">Học Viên</TableHead>
                      <TableHead className="hidden md:table-cell">Thời Gian Tạo</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.course_id}>
                        <TableCell className="font-medium">{course.course_id}</TableCell>
                        <TableCell>{course.title || "Không có tiêu đề"}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.category || "Chung"}</TableCell>
                        <TableCell className="hidden md:table-cell">{course.students || 0}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {course.created_at ? new Date(course.created_at).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              onClick={() => navigate(`/courses/${course.course_id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => navigate(`/admin/courses/edit/${course.course_id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 border rounded-md bg-muted/10">
                  <h3 className="text-lg font-medium mb-2">Chưa có khóa học nào</h3>
                  <p className="text-muted-foreground mb-4">Thêm khóa học mới để bắt đầu</p>
                  <Button onClick={handleOpenAddDialog}>
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm Khóa Học Mới
                  </Button>
                </div>
              )}
            </Tabs>
          </Card>
        </div>
      </section>

      {/* Add Course Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Thêm Khóa Học Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin cho khóa học mới của bạn.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddCourse}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề khóa học <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                  placeholder="Nhập tiêu đề khóa học"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  placeholder="Nhập mô tả khóa học"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Liên kết hình ảnh</Label>
                <Input
                  id="thumbnail"
                  value={newCourse.thumbnail}
                  onChange={(e) => setNewCourse({...newCourse, thumbnail: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button 
                type="submit" 
                disabled={createCourseMutation.isPending}
              >
                {createCourseMutation.isPending ? "Đang xử lý..." : "Thêm khóa học"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ManageCourses;
