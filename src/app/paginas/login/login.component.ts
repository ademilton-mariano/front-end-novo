import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AutenticadorService } from '../../servicos/autenticador.service';
import { RequisicoesService } from '../../servicos/requisicoes.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private requisicoes: RequisicoesService<any>,
    public formBuilder: FormBuilder,
    public autenticadorService: AutenticadorService
  ) {}

  formularioLogin: FormGroup = new FormGroup({});
  formularioCadastro: FormGroup = new FormGroup({});
  exibirCadastro: boolean = false;
  tiposInvestimento: any[] = [];

  ngOnInit(): void {
    this.formularioLogin = this.formBuilder.group({
      dataLogin: [new Date(), [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
    this.formularioCadastro = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      //confirmarSenha: ['', [Validators.required]],
    });
  }

  get dadosFormulario() {
    return this.formularioLogin.controls;
  }

  Login() {
    const dadosFormulario = {
      email: this.dadosFormulario['email'].value,
      senha: this.dadosFormulario['senha'].value,
    };

    this.requisicoes.criar(`login`, dadosFormulario).subscribe(
      (resposta) => {
        localStorage.setItem('rendimento', resposta.rendimento);
        this.autenticadorService.setToken(resposta.token);
        this.autenticadorService.setUsuario(
          this.dadosFormulario['email']?.value,
          resposta.usuarioId
        );
        this.autenticadorService.UsuarioAutenticado(true);
        this.router.navigate(['/pagina-inicial']);
      },
      (error) => {
        console.error('Erro no login', error);
      }
    );
  }

  Cadastro() {
    const dadosFormulario = {
      nome: this.formularioCadastro.controls['nome'].value,
      email: this.formularioCadastro.controls['email'].value,
      senha: this.formularioCadastro.controls['senha'].value,
    };
    this.requisicoes.criar(`cadastro`, dadosFormulario).subscribe(
      (resposta: any) => {
        try {
          const responseJSON = JSON.parse(resposta);
          console.log(responseJSON.mensagem);
        } catch (error) {
          console.error('Erro ao analisar a resposta JSON:', error);
        }
      },
      (error) => {
        console.error('Erro no cadastro', error);
      }
    );
  }

  AbreCadastro() {
    this.exibirCadastro = true;
  }

  FechaCadastro() {
    this.formularioCadastro.reset();
    this.exibirCadastro = false;
  }
}
