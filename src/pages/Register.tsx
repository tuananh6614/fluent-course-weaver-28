
import React from "react";
import Layout from "@/components/layout/Layout";
import AuthForm from "@/components/auth/AuthForm";

const Register: React.FC = () => {
  return (
    <Layout>
      <div className="py-16 md:py-24 min-h-screen flex items-center">
        <div className="page-container max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8">Đăng ký</h1>
          <AuthForm type="register" />
        </div>
      </div>
    </Layout>
  );
};

export default Register;
