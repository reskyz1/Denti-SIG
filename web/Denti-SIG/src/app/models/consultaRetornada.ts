export interface ConsultaRetornada{
  id: number;
  data: string;               
  hora: string;                
  duracao: number;            
  paciente_id: number;
  dentista_id: number;
  observacoes?: string;
  status: 'agendada' | 'confirmada' | 'cancelada' | 'realizada';
  procedimento?: string;
  inicio: string;             
  fim: string;                
}