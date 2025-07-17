/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginDTO {
  email: string;
  senha: string;
  tipo: 'paciente' | 'dentista' | 'secretario';
}

export interface UsuarioToken {
  token: string;
  tipo: string;
  usuario: {
    id: number;
    nome: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = `${environment.apiBase}/login`;

  constructor(private http: HttpClient, private router: Router) {}

  login(dto: LoginDTO): Observable<UsuarioToken> {
    return this.http.post<UsuarioToken>(this.api, dto).pipe(
      tap({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('tipo', res.tipo);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));

          // Redirecionamento
          switch (res.tipo) {
            case 'paciente':
              this.router.navigate(['/paciente']);
              break;
            case 'dentista':
              this.router.navigate(['/dentista']);
              break;
            case 'secretario':
              this.router.navigate(['/secretario']);
              break;
          }
        },
        error: (err) => {
          // Lidar com o erro de autenticação
          alert('Erro ao fazer login: ' + (err.error?.mensagem || 'Tente novamente'));
        }
      })
    );
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTipo(): string | null {
    return localStorage.getItem('tipo');
  }

  getUsuario(): any {
    const raw = localStorage.getItem('usuario');
    return raw ? JSON.parse(raw) : null;
  }

  isLogado(): boolean {
    return !!this.getToken();
  }
}
