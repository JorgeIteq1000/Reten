import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Student } from "@/types/student";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { StudentCard } from "@/components/StudentCard";
import { StudentProfile } from "@/components/StudentProfile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LogOut, RefreshCw } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedRisk, setSelectedRisk] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      
      // Set up auth listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!session) {
          navigate("/auth");
        }
      });

      return () => subscription.unsubscribe();
    };

    checkAuth();
  }, [navigate]);

  // Fetch students data
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-students');
      
      if (error) throw error;
      
      if (data?.students) {
        setStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados dos alunos. Verifique a configuração da API.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStudents();
    setRefreshing(false);
    toast({
      title: "Dados atualizados",
      description: "Os dados foram sincronizados com o Google Sheets.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cpf.includes(searchTerm) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCourse =
      selectedCourse === "all" || student.course === selectedCourse;

    const matchesRisk =
      selectedRisk === "all" || student.riskLevel === selectedRisk;

    return matchesSearch && matchesCourse && matchesRisk;
  });

  const handleViewProfile = (student: Student) => {
    setSelectedStudent(student);
    setProfileOpen(true);
  };

  const handleSendMessage = (student: Student) => {
    toast({
      title: "Mensagem agendada",
      description: `Mensagem para ${student.name} será enviada via Bitrix24`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <DashboardHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCourse={selectedCourse}
              onCourseChange={setSelectedCourse}
              selectedRisk={selectedRisk}
              onRiskChange={setSelectedRisk}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <StatsCards students={students} />

        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Alunos ({filteredStudents.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onViewProfile={handleViewProfile}
                onSendMessage={handleSendMessage}
              />
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Nenhum aluno encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </div>

      <StudentProfile
        student={selectedStudent}
        open={profileOpen}
        onOpenChange={setProfileOpen}
      />
    </div>
  );
};

export default Index;
