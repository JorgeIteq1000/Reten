import { Student } from "@/types/student";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentCardProps {
  student: Student;
  onViewProfile: (student: Student) => void;
  onSendMessage: (student: Student) => void;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case "low":
      return "bg-success text-success-foreground";
    case "medium":
      return "bg-warning text-warning-foreground";
    case "high":
      return "bg-danger text-danger-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getRiskLabel = (level: string) => {
  switch (level) {
    case "low":
      return "Engajado";
    case "medium":
      return "Atenção";
    case "high":
      return "Risco Alto";
    default:
      return "Indefinido";
  }
};

export const StudentCard = ({ student, onViewProfile, onSendMessage }: StudentCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-foreground mb-1">{student.name}</h3>
          <p className="text-sm text-muted-foreground">{student.course}</p>
        </div>
        <Badge className={cn("ml-4", getRiskColor(student.riskLevel))}>
          {getRiskLabel(student.riskLevel)}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progresso do Curso</span>
            <span className="font-medium text-foreground">
              {student.completedSubjects}/{student.totalSubjects} disciplinas
            </span>
          </div>
          <Progress value={student.engagementPercentage} className="h-2" />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Score de Risco</span>
          <span className={cn("font-semibold", {
            "text-success": student.riskScore >= 80,
            "text-warning": student.riskScore >= 60 && student.riskScore < 80,
            "text-danger": student.riskScore < 60
          })}>
            {student.riskScore}/100
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Situação Financeira</span>
          <span className={cn("font-medium", {
            "text-success": student.financialStatus === "ok",
            "text-warning": student.financialStatus === "warning",
            "text-danger": student.financialStatus === "overdue"
          })}>
            {student.overdueMonths === 0 ? "Em dia" : `${student.overdueMonths} meses atraso`}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewProfile(student)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Ver Perfil
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          className="flex-1"
          onClick={() => onSendMessage(student)}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Mensagem
        </Button>
      </div>
    </Card>
  );
};
