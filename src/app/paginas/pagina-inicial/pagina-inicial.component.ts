import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RequisicoesService } from '../../servicos/requisicoes.service';
import { AutenticadorService } from '../../servicos/autenticador.service';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.component.html',
  styleUrls: ['./pagina-inicial.component.scss'],
})
export class PaginaInicialComponent {
  conta = {
    id: 0,
    saldo: 0,
    ativo: '',
    usuarioClienteNome: '',
    criadoDataHora: '',
    investimentoNome: '',
    investimentoId: 0,
    investimentoRendimentoEmPorcentagem: 0,
    investimentoResgate: 0,
    diasInvestimento: 0,
  };

  mostrarInvestirForm: boolean = false;
  mostrarResgatarForm: boolean = false;
  formularioInvestir: FormGroup;
  rendimento = localStorage.getItem('rendimento');
  mensagemAlerta: string = '';
  mostrarAlerta: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private requisicoes: RequisicoesService<any>,
    public autenticadorService: AutenticadorService
  ) {
    this.formularioInvestir = this.formBuilder.group({
      valorInvestimento: ['', [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.BuscarConta();
  }

  AbrirInvestirForm() {
    this.mostrarInvestirForm = true;
  }

  FecharInvestirForm() {
    this.mostrarInvestirForm = false;
  }

  Investir() {
    const dadosFormulario = {
      valor: this.formularioInvestir.get('valorInvestimento')?.value,
      id: this.conta.id,
      tipo: 'Investimento',
    };

    this.requisicoes.criar(`movimentacao`, dadosFormulario).subscribe(
      (resposta) => {
        this.ngOnInit();
        this.FecharInvestirForm();
      },
      (error) => {
        console.error('Erro ao investir', error);
      }
    );
  }

  AbrirResgatarForm() {
    if (this.conta.diasInvestimento < this.conta.investimentoResgate) {
      this.MostrarAlerta('Ainda não é possível resgatar o investimento');
      return;
    }
    this.mostrarResgatarForm = true;
  }

  BuscarConta() {
    const usuarioId = this.ObterUsuarioId();

    this.requisicoes.listar('conta', usuarioId).subscribe(
      (resposta: any) => {
        this.conta = resposta;
        this.conta.ativo = resposta.ativo === true ? 'Ativa' : 'Inativa';
        this.conta.criadoDataHora = new Date(resposta.criadoDataHora)
          .getDate()
          .toString();
      },
      (error) => {
        console.error('Erro ao buscar conta', error);
      }
    );
  }

  FecharResgatarForm() {
    this.mostrarResgatarForm = false;
  }

  Resgatar() {
    const dadosFormulario = {
      valor: this.conta.saldo,
      id: this.conta.id,
      tipo: 'Resgate',
    };

    this.requisicoes.criar(`movimentacao`, dadosFormulario).subscribe(
      (resposta) => {
        this.ngOnInit();
        this.FecharResgatarForm();
      },
      (error) => {
        console.error('Erro ao investir', error);
      }
    );
  }

  MostrarAlerta(mensagem: string) {
    this.mensagemAlerta = mensagem;
    this.mostrarAlerta = true;

    setTimeout(() => {
      this.mostrarAlerta = false;
    }, 8000);
  }

  public ObterUsuarioId(): number {
    const idUsuario = this.autenticadorService.getUsuario()?.id;

    if (!idUsuario) {
      return 0;
    }

    return parseInt(idUsuario, 10);
  }
}
