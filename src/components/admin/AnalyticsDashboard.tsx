import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, startOfDay, eachDayOfInterval } from "date-fns";
import { TrendingUp, TrendingDown, Users, Mail, FileText, CheckCircle } from "lucide-react";

interface AnalyticsDashboardProps {
  submissions: { created_at: string }[];
  subscribers: { created_at: string; verified: boolean }[];
  blogPosts: { created_at: string; published: boolean }[];
}

function buildDailyData(
  items: { created_at: string }[],
  days: number
) {
  const now = new Date();
  const interval = eachDayOfInterval({
    start: subDays(startOfDay(now), days - 1),
    end: startOfDay(now),
  });

  const counts = new Map<string, number>();
  interval.forEach((d) => counts.set(format(d, "yyyy-MM-dd"), 0));

  items.forEach((item) => {
    const key = format(new Date(item.created_at), "yyyy-MM-dd");
    if (counts.has(key)) counts.set(key, (counts.get(key) || 0) + 1);
  });

  let cumulative = 0;
  // Count items before the window
  const windowStart = subDays(startOfDay(now), days - 1);
  items.forEach((item) => {
    if (new Date(item.created_at) < windowStart) cumulative++;
  });

  return interval.map((d) => {
    const key = format(d, "yyyy-MM-dd");
    const count = counts.get(key) || 0;
    cumulative += count;
    return {
      date: format(d, "MMM d"),
      count,
      total: cumulative,
    };
  });
}

function GrowthStat({
  label,
  value,
  change,
  icon: Icon,
}: {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
}) {
  const isPositive = change >= 0;
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-gold" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <div className={`flex items-center gap-1 text-xs mt-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{isPositive ? "+" : ""}{change} last 7 days</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsDashboard({ submissions, subscribers, blogPosts }: AnalyticsDashboardProps) {
  const days = 30;

  const submissionData = useMemo(() => buildDailyData(submissions, days), [submissions]);
  const subscriberData = useMemo(() => buildDailyData(subscribers, days), [subscribers]);

  const last7 = (items: { created_at: string }[]) => {
    const cutoff = subDays(new Date(), 7);
    return items.filter((i) => new Date(i.created_at) >= cutoff).length;
  };

  const prev7 = (items: { created_at: string }[]) => {
    const cutoff7 = subDays(new Date(), 7);
    const cutoff14 = subDays(new Date(), 14);
    return items.filter((i) => {
      const d = new Date(i.created_at);
      return d >= cutoff14 && d < cutoff7;
    }).length;
  };

  const subChange = last7(submissions) - prev7(submissions);
  const subscriberChange = last7(subscribers) - prev7(subscribers);

  const verifiedCount = subscribers.filter((s) => s.verified).length;
  const verificationRate = subscribers.length > 0 ? Math.round((verifiedCount / subscribers.length) * 100) : 0;

  const chartTooltipStyle = {
    backgroundColor: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    color: "hsl(var(--foreground))",
    fontSize: "12px",
  };

  return (
    <div className="space-y-6">
      {/* Growth Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GrowthStat label="Contact Submissions" value={submissions.length} change={subChange} icon={Mail} />
        <GrowthStat label="Total Subscribers" value={subscribers.length} change={subscriberChange} icon={Users} />
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verification Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{verificationRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">{verifiedCount} of {subscribers.length} verified</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Published Posts</CardTitle>
            <FileText className="h-4 w-4 text-gold" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{blogPosts.filter((p) => p.published).length}</div>
            <p className="text-xs text-muted-foreground mt-1">{blogPosts.length} total posts</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Contact Submissions (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={submissionData}>
                <defs>
                  <linearGradient id="gradSubmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="total" stroke="hsl(43, 74%, 49%)" fill="url(#gradSubmissions)" strokeWidth={2} name="Total" />
                <Bar dataKey="count" fill="hsl(43, 74%, 49%)" opacity={0.5} name="Daily" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Subscriber Growth (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={subscriberData}>
                <defs>
                  <linearGradient id="gradSubscribers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(160, 60%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} allowDecimals={false} />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="total" stroke="hsl(160, 60%, 45%)" fill="url(#gradSubscribers)" strokeWidth={2} name="Total" />
                <Bar dataKey="count" fill="hsl(160, 60%, 45%)" opacity={0.5} name="Daily" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
