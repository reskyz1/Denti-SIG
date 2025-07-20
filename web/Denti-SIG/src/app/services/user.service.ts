/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'; // ajuste se mover o arquivo

/*──────────────────────── DTOs ────────────────────────*/
export interface RegisterDentistDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
  cro: string;
}

export interface RegisterSecretaryDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
  matricula: string;
}

export interface RegisterPatientDTO {
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  senha: string;
  data_nascimento: string; // 'YYYY-MM-DD'
  endereco?: string;
  sexo?: string;
}

export interface LoginDSDTO {
  email: string;
  senha: string;
  tipo: string;
}

export interface LoginDTO{
  email: String;
  senha: String;
  tipo: String
}

export interface LoginPatientDTO {
  email_ou_cpf: string; 
  senha: string;
}

/*─────────────────────── Models (resposta) ─────────────*/
export interface UsuarioToken {
  mensagem: string;
  token: string;
}

export interface MensagemResposta {
  mensagem: string;
}

export interface Dentista {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  telefone?: string;
  especialidade?: string;
  cro?: string;
}

export interface Paciente {
  id: number;                          // ID do paciente, gerado automaticamente pelo banco de dados
  nome: string;                        // Nome completo do paciente
  email: string;                       // Email do paciente
  cpf: string;                         // CPF do paciente
  data_nascimento: string;             // Data de nascimento no formato 'YYYY-MM-DD'
  telefone?: string;                   // Telefone do paciente, opcional
  endereco?: string;                   // Endereço do paciente, opcional
  sexo?: string;                       // Sexo do paciente, opcional (pode ser 'Masculino', 'Feminino', etc.)
  alergias?: string;                   // Alergias do paciente, opcional
  doencas_cronicas?: string;           // Doenças crônicas, opcional
  medicacoes_uso_continuo?: string;    // Medicamentos em uso contínuo, opcional
  historico_cirurgico?: string;        // Histórico cirúrgico, opcional
  queixa_principal?: string;           // Queixa principal do paciente, opcional
  historico_tratamento_odontologico?: string; // Histórico de tratamentos odontológicos, opcional
  higiene_bucal?: string;              // Informações sobre higiene bucal, opcional
  observacoes_gerais?: string;
  estadoCivil?: String;        // Observações gerais, opcional

  problema_cardiaco?: boolean;         // Se o paciente tem problema cardíaco
  diabetico?: boolean;                 // Se o paciente é diabético
  fumante?: boolean;                   // Se o paciente é fumante
  gestante?: boolean;                  // Se o paciente está gestante
  aparelho_ortodontico?: boolean;      // Se o paciente usa aparelho ortodontico
  usa_protese?: boolean;               // Se o paciente usa prótese
  responsavel?: string;                // Nome do responsável pelo paciente, opcional
  convenio?: string;                   // Convênio médico do paciente, opcional
  numero_convenio?: string;            // Número do convênio do paciente, opcional
}


/*─────────────────────── Service ───────────────────────*/
@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private readonly http = inject(HttpClient);
  /** Ex.: http://127.0.0.1:5000/api/user  */
  private readonly base = environment.apiBase;

  /* -------- Registros -------- */
  registerDentist(dto: RegisterDentistDTO): Observable<MensagemResposta> {
    return this.http.post<MensagemResposta>(`${this.base}/register/dentist`, dto);
  }

  registerSecretary(dto: RegisterSecretaryDTO): Observable<MensagemResposta> {
    return this.http.post<MensagemResposta>(`${this.base}/register/secretary`, dto);
  }

  registerPatient(dto: RegisterPatientDTO): Observable<MensagemResposta> {
    return this.http.post<MensagemResposta>(`${this.base}/register/patient`, dto);
  }

  /* ---------- Listagens ---------- */
  listarDentistas(): Observable<Dentista[]> {
    return this.http.get<Dentista[]>(`${this.base}/dentistas`);
  }

  listarPacientes(): Observable<Paciente[]> {
    return this.http.get<Paciente[]>(`${this.base}/pacientes`);
  }

  pacientePorCpf(cpf: string | number): Observable<Paciente> {
    return this.http.get<Paciente>(`${this.base}/pacientes/${cpf}`);
  }
    
  editarPacienteInfoMedica(cpf: string, dados: Partial<Paciente>): Observable<MensagemResposta> {
    return this.http.put<MensagemResposta>(`${this.base}/paciente/${cpf}`, dados);
  }
}

/*──────────────────── ConsultasApiService ───────────────────*/
@Injectable({ providedIn: 'root' })
export class ConsultasApiService {
  private readonly http = inject(HttpClient);
  private readonly base = environment.apiBase;

  criarConsulta(body: any): Observable<MensagemResposta> {
    return this.http.post<MensagemResposta>(`${this.base}/consultas`, body);
  }

  atualizarConsulta(id: number, body: any): Observable<MensagemResposta> {
    return this.http.put<MensagemResposta>(`${this.base}/consultas/${id}`, body);
  }

  deletarConsulta(id: number): Observable<MensagemResposta> {
    return this.http.delete<MensagemResposta>(`${this.base}/consultas/${id}`);
  }

  listarConsultas(params?: Record<string, string>): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/consultas`, { params });
  }

  consultasProximas(pacienteId: number): Observable<any> {
    return this.http.get(`${this.base}/consultas/proximas/${pacienteId}`);
  }

  listarConsultasPaciente(pacienteId: number): Observable<any> {
    return this.http.get(`${this.base}/consultas/paciente/${pacienteId}`);
  }

  listarConsultasDentistaPorData(dentistaId: number, dataISO: string): Observable<any> {
    const params = new HttpParams()
      .set('dentista_id', dentistaId)
      .set('data', dataISO); // 'YYYY-MM-DD'
    return this.http.get(`${this.base}/consultas/dentista`, { params });
  }
}