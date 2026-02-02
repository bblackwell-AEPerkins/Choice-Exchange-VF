import { BrokerShell } from "@/components/shells/BrokerShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  UserPlus, 
  Users, 
  TrendingUp, 
  ArrowRight, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Building2,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for broker dashboard
const stats = {
  activeClients: 47,
  pendingEnrollments: 12,
  completedThisMonth: 8,
  earningsThisMonth: 4250,
  earningsYTD: 38400,
  groupsManaged: 6,
};

const recentActivity = [
  { id: 1, type: "enrollment", client: "Sarah M.", group: "Acme Corp", status: "completed", time: "2 hours ago" },
  { id: 2, type: "enrollment", client: "John D.", group: "TechStart Inc", status: "pending", time: "4 hours ago" },
  { id: 3, type: "group", group: "Metro Services", action: "New group added", time: "Yesterday" },
  { id: 4, type: "enrollment", client: "Lisa K.", group: "Acme Corp", status: "in_review", time: "Yesterday" },
];

const pendingTasks = [
  { id: 1, task: "Complete enrollment for John D.", priority: "high", dueIn: "2 days" },
  { id: 2, task: "Submit documentation for TechStart group", priority: "medium", dueIn: "5 days" },
  { id: 3, task: "Review voluntary benefits options for Metro Services", priority: "low", dueIn: "1 week" },
];

export default function BrokerHome() {
  return (
    <BrokerShell>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Broker Console
          </h1>
          <p className="text-muted-foreground">
            Manage enrollments, track commissions, and grow your book of business.
          </p>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Clients</p>
                  <p className="text-2xl font-bold text-foreground">{stats.activeClients}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">{stats.pendingEnrollments}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-light flex items-center justify-center">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Groups</p>
                  <p className="text-2xl font-bold text-foreground">{stats.groupsManaged}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Earnings (MTD)</p>
                  <p className="text-2xl font-bold text-foreground">${stats.earningsThisMonth.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">YTD: ${stats.earningsYTD.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">New Enrollment</h3>
                  <p className="text-sm text-muted-foreground">Start ICHRA or voluntary</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6">
              <Link to="/broker/groups" className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Add Employer Group</h3>
                  <p className="text-sm text-muted-foreground">Onboard a new company</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-colors cursor-pointer group">
            <CardContent className="pt-6">
              <Link to="/broker/reporting" className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-light flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Commission Report</h3>
                  <p className="text-sm text-muted-foreground">View earnings breakdown</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Action Required
              </CardTitle>
              <CardDescription>Tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        task.priority === 'high' ? 'bg-destructive' :
                        task.priority === 'medium' ? 'bg-amber-500' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm text-foreground">{task.task}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {task.dueIn}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest enrollments and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {activity.status === 'completed' ? (
                        <CheckCircle className="h-4 w-4 text-accent" />
                      ) : activity.status === 'pending' ? (
                        <Clock className="h-4 w-4 text-amber-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-primary" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {activity.client ? `${activity.client} - ${activity.group}` : activity.group}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.action || `Enrollment ${activity.status}`}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BrokerShell>
  );
}
