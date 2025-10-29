export type RiskLevel = "low" | "medium" | "high";

export type Student = {
  id: string;
  name: string;
  cpf: string;
  course: string;
  startDate: string;
  completedSubjects: number;
  totalSubjects: number;
  lastPayment: string;
  lastPaymentValue: number;
  overdueMonths: number;
  riskScore: number;
  riskLevel: RiskLevel;
  engagementPercentage: number;
  financialStatus: "ok" | "warning" | "overdue";
  phone?: string;
  email?: string;
};
