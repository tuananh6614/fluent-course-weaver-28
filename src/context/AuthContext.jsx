
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
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      setLoading(true);
      const response = await authService.getProfile();
      
      if (response.data && response.data.success) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth error:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authService.login({ email, password });
      
      if (response.data && response.data.success) {
        localStorage.setItem('token', response.data.token);
        
        // Store user data in localStorage for persistence
        if (response.data.user) {
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
        
        setUser(response.data.user);
        
        toast.success('Đăng nhập thành công', {
          description: `Chào mừng ${response.data.user.full_name} quay trở lại!`
        });
        
        return true;
      } else {
        setError(response.data?.message || 'Đăng nhập không thành công');
        
        toast.error('Đăng nhập thất bại', {
          description: response.data?.message || 'Đăng nhập không thành công'
        });
        
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Đăng nhập không thành công');
      
      toast.error('Đăng nhập thất bại', {
        description: error.response?.data?.message || 'Đăng nhập không thành công'
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
      
      // Ensure correct format for the userData depending on what backend expects
      const formattedUserData = {
        full_name: userData.full_name,
        email: userData.email, 
        password: userData.password
      };
      
      const response = await authService.register(formattedUserData);
      
      if (response.data && response.data.success) {
        toast.success('Đăng ký thành công', {
          description: 'Vui lòng đăng nhập để tiếp tục.'
        });
        return true;
      } else {
        const errorMessage = response.data?.message || 'Đăng ký không thành công';
        setError(errorMessage);
        
        toast.error('Đăng ký thất bại', {
          description: errorMessage
        });
        
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || 'Đăng ký không thành công';
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
