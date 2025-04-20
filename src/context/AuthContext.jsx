
import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { toast } from 'sonner';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      setLoading(true);
      const response = await authService.verifyToken();
      
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('userData', JSON.stringify(response.user));
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login(email, password);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        setUser(response.user);
        
        toast.success('Đăng nhập thành công', {
          description: `Chào mừng ${response.user.full_name} quay trở lại!`
        });
        
        return true;
      } else {
        throw new Error(response.message || 'Đăng nhập không thành công');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập không thành công';
      setError(errorMessage);
      
      toast.error('Đăng nhập thất bại', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success('Đăng ký thành công', {
          description: 'Vui lòng đăng nhập để tiếp tục.'
        });
        return true;
      } else {
        throw new Error(response.message || 'Đăng ký không thành công');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký không thành công';
      setError(errorMessage);
      
      toast.error('Đăng ký thất bại', {
        description: errorMessage
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setUser(null);
    
    toast.success('Đăng xuất thành công', {
      description: 'Bạn đã đăng xuất khỏi hệ thống'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
