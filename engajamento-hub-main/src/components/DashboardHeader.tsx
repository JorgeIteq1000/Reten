import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCourse: string;
  onCourseChange: (value: string) => void;
  selectedRisk: string;
  onRiskChange: (value: string) => void;
}

export const DashboardHeader = ({
  searchTerm,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedRisk,
  onRiskChange,
}: DashboardHeaderProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Painel de Alunos</h1>
        <p className="text-muted-foreground">
          Acompanhamento acadêmico e financeiro em tempo real
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF ou curso..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCourse} onValueChange={onCourseChange}>
            <SelectTrigger className="w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Cursos</SelectItem>
              <SelectItem value="Administração">Administração</SelectItem>
              <SelectItem value="Gestão Comercial">Gestão Comercial</SelectItem>
              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
              <SelectItem value="Logística">Logística</SelectItem>
              <SelectItem value="Marketing Digital">Marketing Digital</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRisk} onValueChange={onRiskChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Nível de Risco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Níveis</SelectItem>
              <SelectItem value="low">🟢 Engajado</SelectItem>
              <SelectItem value="medium">🟡 Atenção</SelectItem>
              <SelectItem value="high">🔴 Risco Alto</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
