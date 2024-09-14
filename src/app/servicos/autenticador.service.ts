
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})

export class AutenticadorService {
    private usuarioAutenticadoPortal: boolean = false;
    private token: any;
    private usuario: any;

    constructor(private httpClient: HttpClient) {
    }

    checkToken() {
        return Promise.resolve(true);
    }

    UsuarioAutenticado(status: boolean) {
        localStorage.setItem('usuarioAutenticadoPortal', JSON.stringify(status));
        this.usuarioAutenticadoPortal = status;
    }

    UsuarioEstaAutenticado(): Promise<boolean> {
        this.usuarioAutenticadoPortal = localStorage.getItem('usuarioAutenticadoPortal') == 'true';
        return Promise.resolve(this.usuarioAutenticadoPortal);
    }

    setToken(token: string) {
        localStorage.setItem('token', token);
        this.token = token;
    }

    getToken() {
        this.token = localStorage.getItem('token');
        return this.token;
    }

    limparToken() {
        this.token = null;
        this.usuario = null;
    }

    limparDadosUsuario() {
        this.UsuarioAutenticado(false);
        this.limparToken();
        localStorage.clear();
        sessionStorage.clear();
    }

    setUsuario(email: string, id: string) {
        localStorage.setItem('emailUsuario', email);
        localStorage.setItem('usuarioId', id);
    }

    getUsuario() {
      const email = localStorage.getItem('emailUsuario');
      const id = localStorage.getItem('usuarioId');

      if (email && id) {
          return { email, id };
      } else {
          this.limparDadosUsuario();
          return null; // Retorna null quando os dados não estão presentes
      }
  }
}
