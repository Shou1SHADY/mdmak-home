
"use client";

import { useLanguageContext } from '@/components/LanguageProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';

export function CustomerSpendChart() {
  const { lang } = useLanguageContext();
  const isAr = lang === 'ar';

  const data = [
    { month: isAr ? 'يناير' : 'Jan', spend: 4500, savings: 800 },
    { month: isAr ? 'فبراير' : 'Feb', spend: 5200, savings: 950 },
    { month: isAr ? 'مارس' : 'Mar', spend: 3800, savings: 600 },
    { month: isAr ? 'أبريل' : 'Apr', spend: 6500, savings: 1200 },
    { month: isAr ? 'مايو' : 'May', spend: 4800, savings: 1100 },
    { month: isAr ? 'يونيو' : 'Jun', spend: 5900, savings: 1300 },
  ];

  return (
    <Card className="rounded-[2.5rem] border-0 shadow-sm bg-white p-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <CardTitle className="text-xl font-bold">{isAr ? 'تحليل المشتريات الشهري' : 'Monthly Spending Analytics'}</CardTitle>
          <CardDescription>{isAr ? 'مقارنة بين الإنفاق والتوفير المحقق' : 'Spend vs. Savings over the last 6 months'}</CardDescription>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs font-bold text-muted-foreground">{isAr ? 'الإنفاق' : 'Spend'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent" />
            <span className="text-xs font-bold text-muted-foreground">{isAr ? 'التوفير' : 'Savings'}</span>
          </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 'bold', fill: '#888' }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fill: '#888' }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip 
              cursor={{ stroke: '#f0f0f0', strokeWidth: 2 }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="spend" 
              stroke="hsl(var(--primary))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorSpend)" 
            />
            <Area 
              type="monotone" 
              dataKey="savings" 
              stroke="hsl(var(--accent))" 
              strokeWidth={4}
              fillOpacity={1} 
              fill="url(#colorSavings)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
