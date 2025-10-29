import { Student } from "@/types/student";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  GraduationCap, 
  Calendar, 
  CreditCard, 
  TrendingUp,
  Mail,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface StudentProfileProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

export const StudentProfile = ({ student, open, onOpenChange }: StudentProfileProps) => {
  if (!student) return null;

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Perfil do Aluno</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
              <p className="text-muted-foreground">{student.cpf}</p>
            </div>
            <Badge className={cn("text-sm", getRiskColor(student.riskLevel))}>
              Score: {student.riskScore}/100
            </Badge>
          </div>

          <Separator />

          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações de Contato
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {student.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{student.email}</span>
                </div>
              )}
              {student.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{student.phone}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Academic Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Informações Acadêmicas
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Curso</span>
                <span className="font-medium text-foreground">{student.course}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Data de Início</span>
                <span className="font-medium text-foreground">{formatDate(student.startDate)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Disciplinas Concluídas</span>
                <span className="font-medium text-foreground">
                  {student.completedSubjects}/{student.totalSubjects}
                </span>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium text-foreground">{student.engagementPercentage}%</span>
                </div>
                <Progress value={student.engagementPercentage} className="h-2" />
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Informações Financeiras
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Último Pagamento</span>
                <span className="font-medium text-foreground">{formatDate(student.lastPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor Último Pagamento</span>
                <span className="font-medium text-foreground">
                  {formatCurrency(student.lastPaymentValue)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Meses em Atraso</span>
                <span className={cn("font-semibold", {
                  "text-success": student.overdueMonths === 0,
                  "text-warning": student.overdueMonths > 0 && student.overdueMonths <= 2,
                  "text-danger": student.overdueMonths > 2
                })}>
                  {student.overdueMonths === 0 ? "Em dia" : `${student.overdueMonths} meses`}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Risk Analysis */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Análise de Risco
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className="text-2xl font-bold text-foreground">
                  {student.engagementPercentage}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Engajamento</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className={cn("text-2xl font-bold", {
                  "text-success": student.financialStatus === "ok",
                  "text-warning": student.financialStatus === "warning",
                  "text-danger": student.financialStatus === "overdue"
                })}>
                  {student.financialStatus === "ok" ? "OK" : "Alerta"}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Situação</div>
              </div>
              <div className="text-center p-4 bg-accent rounded-lg">
                <div className={cn("text-2xl font-bold", {
                  "text-success": student.riskScore >= 80,
                  "text-warning": student.riskScore >= 60 && student.riskScore < 80,
                  "text-danger": student.riskScore < 60
                })}>
                  {student.riskScore}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Score Total</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
