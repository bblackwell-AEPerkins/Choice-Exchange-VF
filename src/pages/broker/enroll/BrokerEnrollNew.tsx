import { useSearchParams, Navigate } from "react-router-dom";
import { useBrokerEnrollment } from "@/hooks/useBrokerEnrollment";
import { VOLUNTARY_BENEFITS_ENABLED } from "@/lib/brokerMockData";
import BrokerEnrollStep1 from "./BrokerEnrollStep1";
import BrokerEnrollStep2 from "./BrokerEnrollStep2";
import BrokerEnrollStep3 from "./BrokerEnrollStep3";
import BrokerEnrollStep4 from "./BrokerEnrollStep4";
import BrokerEnrollStep5 from "./BrokerEnrollStep5";
import BrokerEnrollStep6 from "./BrokerEnrollStep6";

export default function BrokerEnrollNew() {
  const [searchParams] = useSearchParams();
  const step = parseInt(searchParams.get("step") || "1");

  // If voluntary benefits disabled, step 5 becomes step 6
  const adjustedStep = !VOLUNTARY_BENEFITS_ENABLED && step >= 5 ? step + 1 : step;

  // Render appropriate step component
  switch (step) {
    case 1:
      return <BrokerEnrollStep1 />;
    case 2:
      return <BrokerEnrollStep2 />;
    case 3:
      return <BrokerEnrollStep3 />;
    case 4:
      return <BrokerEnrollStep4 />;
    case 5:
      // Skip step 5 if voluntary benefits disabled
      if (!VOLUNTARY_BENEFITS_ENABLED) {
        return <Navigate to="/broker/enroll/new?step=6" replace />;
      }
      return <BrokerEnrollStep5 />;
    case 6:
      return <BrokerEnrollStep6 />;
    default:
      return <BrokerEnrollStep1 />;
  }
}
