import { Card } from "@/components/ui/card";
import { Student } from "@/types/student";
import { Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface StatsCardsProps {
  students: Student[];
}

export const StatsCards = ({ students }: StatsCardsProps) => {
  const totalStudents = students.length;
  const engagedStudents = students.filter(s => s.riskLevel === "low").length;
  const atRiskStudents = students.filter(s => s.riskLevel === "high").length;
  const averageScore = Math.round(
    students.reduce((acc, s) => acc + s.riskScore, 0) / totalStudents
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total de Alunos</p>
            <p className="text-3xl font-bold text-foreground mt-1">{totalStudents}</p>
          </div>
          <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Engajados</p>
            <p className="text-3xl font-bold text-success mt-1">{engagedStudents}</p>
          </div>
          <div className="h-12 w-12 bg-success/10 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Em Risco</p>
            <p className="text-3xl font-bold text-danger mt-1">{atRiskStudents}</p>
          </div>
          <div className="h-12 w-12 bg-danger/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-danger" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Score Médio</p>
            <p className="text-3xl font-bold text-foreground mt-1">{averageScore}</p>
          </div>
          <div className="h-12 w-12 bg-warning/10 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-warning" />
          </div>
        </div>
      </Card>
    </div>
  );
};
