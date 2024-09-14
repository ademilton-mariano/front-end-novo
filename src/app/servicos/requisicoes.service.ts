import { HttpClient, HttpHandler, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environment';
import { AutenticadorService } from './autenticador.service';

@Injectable({
  providedIn: 'root',
})
export class RequisicoesService<T> {
  private readonly baseUrl = environment['apiUrl'];

  constructor(
    private http: HttpClient,
    private autenticador: AutenticadorService
  ) {}

  intercept(requisicao: HttpRequest<any>, next: HttpHandler) {
    const token = this.autenticador.getToken();

    if (token) {
      requisicao = requisicao.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(requisicao);
  }

  listarTudo(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`);
  }

  listar(endpoint: string, id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }

  criar(endpoint: string, item: T, resposta?: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, item);
  }

  atualizar(endpoint: string, id: number, item: T): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, item, httpOptions);
  }

  apagar(endpoint: string, id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
