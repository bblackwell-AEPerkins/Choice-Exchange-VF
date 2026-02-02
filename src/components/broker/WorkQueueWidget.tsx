import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import {
  MOCK_BROKER_ENROLLMENTS,
  getStatusLabel,
  getStatusColor,
  type BrokerEnrollment,
} from "@/lib/brokerMockData";

export function WorkQueueWidget() {
  // Filter to show only in-progress enrollments
  const activeEnrollments = MOCK_BROKER_ENROLLMENTS.filter(
    (e) => e.status !== "completed"
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Work Queue
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {activeEnrollments.length} in progress
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {activeEnrollments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No enrollments in progress
          </p>
        ) : (
          activeEnrollments.slice(0, 5).map((enrollment) => (
            <EnrollmentRow key={enrollment.id} enrollment={enrollment} />
          ))
        )}
        
        {activeEnrollments.length > 5 && (
          <Button variant="ghost" size="sm" className="w-full mt-2" asChild>
            <Link to="/broker/enrollments">
              View all {activeEnrollments.length} enrollments
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function EnrollmentRow({ enrollment }: { enrollment: BrokerEnrollment }) {
  return (
    <Link
      to={`/broker/enroll/${enrollment.id}?step=${enrollment.currentStep}`}
      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-foreground truncate">
            {enrollment.individualName}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground truncate">
            {enrollment.groupName}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            Step {enrollment.currentStep}/{enrollment.totalSteps}: {enrollment.stepStatus}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <Badge className={`text-xs ${getStatusColor(enrollment.status)}`}>
          {getStatusLabel(enrollment.status)}
        </Badge>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
}
