import React from 'react';
import { cn } from "@/lib/utils"; // Assuming utils exists, standard in Shadcn

const PageContainer = ({ children, className }) => {
  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8", className)}>
      {children}
    </div>
  );
};

export default PageContainer;
