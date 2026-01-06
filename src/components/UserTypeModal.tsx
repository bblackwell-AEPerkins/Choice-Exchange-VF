import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users, Building2, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const userTypes = [
  {
    id: "individual",
    title: "Individual",
    description: "I'm looking for personal health coverage",
    icon: Users,
    href: "/dashboard",
  },
  {
    id: "employer",
    title: "Employer",
    description: "I want to offer benefits to my employees",
    icon: Building2,
    href: "/employer",
  },
  {
    id: "broker",
    title: "Broker",
    description: "I'm a benefits broker or consultant",
    icon: Briefcase,
    href: "/auth",
  },
];

export const UserTypeModal = ({ open, onOpenChange }: UserTypeModalProps) => {
  const navigate = useNavigate();

  const handleSelect = (href: string) => {
    onOpenChange(false);
    navigate(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            How can we help you today?
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {userTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              className="h-auto p-4 justify-start gap-4 hover:bg-accent/10 hover:border-primary"
              onClick={() => handleSelect(type.href)}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <type.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">{type.title}</p>
                <p className="text-sm text-muted-foreground font-normal">
                  {type.description}
                </p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
