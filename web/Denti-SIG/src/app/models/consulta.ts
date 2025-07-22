export interface Consulta {
  id?: number;              // opcional, pois só existe após o cadastro
  data: string;             // formato: "YYYY-MM-DD"
  hora: string;             // formato: "HH:mm"
  duracao: number;          // em minutos, ex: 30
  paciente_id: number;
  dentista_id: number;
  observacoes?: string;
  status?: 'agendada' | 'confirmada' | 'cancelada' | 'realizada'; // ou string livre se não for enum
  procedimento?: string;
}
