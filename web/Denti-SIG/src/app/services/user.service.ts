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
}

export interface LoginPatientDTO {
  email_ou_cpf: string; // backend aceita email **ou** cpf
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
}

export interface Paciente {
  nome: string;
  email: string;
  cpf: string;
  data_nascimento: string;
  telefone?: string;
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

  /* ---------- Login ---------- */
  loginDentistOrSecretary(dto: LoginDSDTO): Observable<UsuarioToken> {
    return this.http.post<UsuarioToken>(`${this.base}/login/ds`, dto);
  }

  loginPatient(dto: LoginPatientDTO): Observable<UsuarioToken> {
    return this.http.post<UsuarioToken>(`${this.base}/login/patient`, dto);
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
