import React from 'react';
import { 
  Microscope, 
  TestTube, 
  Stethoscope,
  Activity,
  Beaker,
  FileText,
  BarChart3,
  TrendingUp,
  Zap,
  Heart,
  Brain,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductIconProps {
  product: string;
  className?: string;
  variant?: 'default' | 'outline' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

// Product icon mapping
const getProductIcon = (product: string) => {
  const productLower = product.toLowerCase();
  
  if (productLower.includes('urinalysis') || productLower.includes('eclair')) {
    return <Microscope className="h-full w-full" />;
  }
  if (productLower.includes('fcm') || productLower.includes('delphic')) {
    return <TestTube className="h-full w-full" />;
  }
  if (productLower.includes('poc') || productLower.includes('handheld')) {
    return <Stethoscope className="h-full w-full" />;
  }
  if (productLower.includes('coagulation') || productLower.includes('hemostasis')) {
    return <Activity className="h-full w-full" />;
  }
  if (productLower.includes('immunochemistry') || productLower.includes('serology')) {
    return <Shield className="h-full w-full" />;
  }
  if (productLower.includes('molecular') || productLower.includes('genetics')) {
    return <Brain className="h-full w-full" />;
  }
  if (productLower.includes('hematology') || productLower.includes('blood')) {
    return <Heart className="h-full w-full" />;
  }
  if (productLower.includes('chemistry') || productLower.includes('biochemistry')) {
    return <Beaker className="h-full w-full" />;
  }
  if (productLower.includes('software') || productLower.includes('lis')) {
    return <FileText className="h-full w-full" />;
  }
  if (productLower.includes('analytics') || productLower.includes('data')) {
    return <BarChart3 className="h-full w-full" />;
  }
  if (productLower.includes('automation') || productLower.includes('robotic')) {
    return <Zap className="h-full w-full" />;
  }
  
  // Default icon for unknown products
  return <TrendingUp className="h-full w-full" />;
};

// Product color mapping
const getProductColor = (product: string) => {
  const productLower = product.toLowerCase();
  
  if (productLower.includes('urinalysis') || productLower.includes('eclair')) {
    return 'text-blue-600';
  }
  if (productLower.includes('fcm') || productLower.includes('delphic')) {
    return 'text-green-600';
  }
  if (productLower.includes('poc') || productLower.includes('handheld')) {
    return 'text-purple-600';
  }
  if (productLower.includes('coagulation') || productLower.includes('hemostasis')) {
    return 'text-red-600';
  }
  if (productLower.includes('immunochemistry') || productLower.includes('serology')) {
    return 'text-orange-600';
  }
  if (productLower.includes('molecular') || productLower.includes('genetics')) {
    return 'text-pink-600';
  }
  if (productLower.includes('hematology') || productLower.includes('blood')) {
    return 'text-rose-600';
  }
  if (productLower.includes('chemistry') || productLower.includes('biochemistry')) {
    return 'text-teal-600';
  }
  if (productLower.includes('software') || productLower.includes('lis')) {
    return 'text-indigo-600';
  }
  if (productLower.includes('analytics') || productLower.includes('data')) {
    return 'text-violet-600';
  }
  if (productLower.includes('automation') || productLower.includes('robotic')) {
    return 'text-yellow-600';
  }
  
  return 'text-primary';
};

export function ProductIcon({ 
  product, 
  className, 
  variant = 'default', 
  size = 'md' 
}: ProductIconProps) {
  const icon = getProductIcon(product);
  const color = getProductColor(product);
  
  const sizeClasses = {
    sm: 'h-4 w-4 p-1',
    md: 'h-6 w-6 p-1.5',
    lg: 'h-8 w-8 p-2'
  };
  
  const variantClasses = {
    default: 'bg-background/10 border border-primary/20',
    outline: 'border-2 border-current bg-transparent',
    glass: 'glass-card bg-background/20 backdrop-blur-sm border border-white/20'
  };
  
  return (
    <div className={cn(
      'rounded-lg flex items-center justify-center transition-colors duration-200',
      sizeClasses[size],
      variantClasses[variant],
      color,
      className
    )}>
      {icon}
    </div>
  );
}