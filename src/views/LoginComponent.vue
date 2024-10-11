<template>
    <main id="login">

        <div class=" container">

            <div class="container d-flex justify-content-center  row" style="position: fixed;"
                id="liveAlertPlaceholder">
            </div>
            <div id="login-row" class="row justify-content-center align-items-center">
                <div id="login-column" class="col-md-6">
                    <div id="login-box" class="col-md-12">
                        <div id="login-form">
                            <div class="text-azul Gerenciar-tipo row">
                                <button @click="BtnAdministrador"
                                    :class="'col btn-generic text-azul ' + Administrador">Administrador</button>
                                <button @click="BtnColaborador"
                                    :class="'col btn-generic text-azul ' + Colaborador">Colaborador</button>
                            </div>
                            <br>
                            <h3 class="text-center text-azul">Login</h3>
                            <div class="form-group">
                                <label for="username" class="text-azul">Email:</label><br>
                                <input v-model="CampoEmail" type="text" name="username" id="username"
                                    class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="password" class="text-azul">Senha:</label><br>
                                <input v-model="CampoSenha" type="password" name="password" id="password"
                                    class="form-control">
                                <button v-show="Tipo == 'Administrador'" @click="Modal_Criar_Adm"
                                    class="btn btn-link">Criar Conta</button>
                            </div>
                            <br v-show="Tipo == 'Colaborador'">
                            <div class="alinhar-final">
                                <button @click="Login" class="btn btn-success">Login</button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <div v-if="Tela == 'modal'">

                <div id="CadastroInput"
                    class="modal  bg-dark-subtle d-flex flex-column  p-2 justify-content-center  align-items-center">
                    <div style="position: fixed;" id="Alertas"></div>
                    <div style="background-color:#060854 ;" class="p-4 rounded text-light justify-content-center ">
                        <h3>Cadastrar Empregador</h3>
                        <div>
                            <label>Email</label>
                            <br>
                            <input v-model="CampoEmail" placeholder="Ex:. Email@email.com"
                                class="w-100 text-start input-group-text" type="text">
                        </div>
                        <div class="d-flex flex-column ">
                            <label>Senha</label>
                            <div class="d-flex">
                                <input maxlength="10" placeholder="Ex:. Sua senha" v-model="CampoSenha"
                                    class="w-100 input-group-text text-start" :type="TipoSenha">
                                <button @click="visualizarSenha" class="BtnVisivel"><i :class="iconSenha"></i></button>
                            </div>
                        </div>
                        <div>
                            <label>CPF/CNPJ</label>
                            <br>
                            <MaskInput v-model="CampoCpf" mask='###.###.###-##' placeholder="Ex:. 000.000.000-00"
                                class="w-100 input-group-text text-start" type="text" />
                        </div>
                        <div>
                            <label>Nome</label>
                            <br>
                            <input v-model="CampoNome" placeholder="Ex:. Fulano da silva"
                                class="w-100 text-start input-group-text" type="text">
                        </div>
                        <div>
                            <label>Empresa</label>
                            <br>
                            <input v-model="CampoEmpresa" placeholder="Ex:. Lojas Europeias"
                                class="w-100 text-start input-group-text" type="text">
                        </div>
                        <div class="my-3 d-flex justify-content-between">
                            <button @click="Tela = '', CampoEmail = '', CampoSenha = ''"
                                class="btn btn-danger ">Sair</button>
                            <button @click="cadastrar" class="btn btn-success ">Cadastrar</button>
                        </div>
                    </div>
                </div>

            </div>


        </div>
    </main>
</template>

<script>
import variaveis from '@/store/VariaveisStaticas.js';
import axios from 'axios';

export default {
    components: {

    },
    data() {
        return {
            url: 'http://192.168.100.220:8001',
            CampoEmail: "",
            CampoSenha: "",
            CampoCpf: "",
            CampoNome: "",
            CampoEmpresa: "",
            Administrador: "",
            Colaborador: "Colaborador",
            Tipo: "Colaborador",
            TipoSenha: 'password',
            iconSenha: 'bi bi-eye-slash-fill',
            liberarAcesso: '',
            Tela: "",
        }
    },

    methods: {
        BtnAdministrador() {
            this.Administrador = "Administrador"
            this.Tipo = "Administrador"
            if (this.Administrador == "Administrador") {
                this.Colaborador = ""
            }
        },
        BtnColaborador() {
            this.Colaborador = "Colaborador"
            this.Tipo = "Colaborador"
            if (this.Colaborador == "Colaborador") {
                this.Administrador = ""
            }
        },
        ValidacaoAdm() {
            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            axios
                .post(`${this.url}/api/exibirEmpregador`, { email: this.CampoEmail, senha: this.CampoSenha })
                .then(({ data }) => {
                    this.liberarAcesso = data.senha
                    if (this.liberarAcesso == true) {
                        variaveis.setpermissao(true)
                        variaveis.SetEmail(this.CampoEmail)
                        this.$router.push('/cadastro')
                    } else {
                        let message = "Administrador não encontrado"
                        const wrapper = document.createElement('div')
                        wrapper.innerHTML = [
                            `<div style="width: 75vmin;" class="my-0  m-auto alert alert-danger alert-dismissible" role="alert">`,
                            `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                            '</div>'
                        ].join('')
                        alertPlaceholder.append(wrapper)

                        return
                    }
                })
                .catch((err) => {
                    console.log(err)
                })

        },
        ValidacaoColaborador() {
            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            axios
            .post(`${this.url}/api/exibirColaborador`,{ email: this.CampoEmail, senha: this.CampoSenha })
            .then(({data})=>{
                this.liberarAcesso = data.senha
                if (this.liberarAcesso == true) {
                    variaveis.setpermissao(true)

                    variaveis.SetEmail(this.CampoEmail)
                    this.$router.push('/colaborador');
                } else {
                    let message = "Colaborador não encontrado"
                    const wrapper = document.createElement('div')
                    wrapper.innerHTML = [
                        `<div style="width: 75vmin;" class="my-0  m-auto alert alert-danger alert-dismissible" role="alert">`,
                        `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                        '</div>'
                    ].join('')
                    alertPlaceholder.append(wrapper)

                    return
                }
            })
            .catch((err)=>{
                console.log(err)
            })


            
        },

        Login() {
            const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            if (this.CampoEmail.trim().length <= 0 || this.CampoSenha.trim().length <= 0) {
                let message = "Preencha todos os campos"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div style="width: 75vmin;" class="my-0  m-auto alert alert-danger alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)

                return
            }
            if (!emailRegex.test(this.CampoEmail)) {

                let message = "O campo email deve conter um formato de email valido"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div style="width: 75vmin;" class="my-0 login-conteiner m-auto alert alert-danger alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)
                return
            }
            if (this.Tipo == "Administrador") {
                this.ValidacaoAdm()
            }
            if (this.Tipo == "Colaborador") {
                this.ValidacaoColaborador()
            }



        },
        Modal_Criar_Adm() {
            this.Tela = "modal"
        },
        visualizarSenha() {

            if (this.TipoSenha == 'password') {
                this.TipoSenha = 'text'
                this.iconSenha = 'bi bi-eye-fill'
            } else {
                this.TipoSenha = 'password'
                this.iconSenha = 'bi bi-eye-slash-fill'
            }
        },
        cadastrar() {
            const alertPlaceholder = document.getElementById('Alertas')

            const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

            let CadastroInput = document.querySelectorAll('#CadastroInput input')
            for (const i of CadastroInput) {
                if (i.value.length <= 0) {
                    let message = "Preencha todos os campos"
                    const wrapper = document.createElement('div')
                    wrapper.innerHTML = [
                        `<div style="width: 75vmin;" class="my-0  m-auto alert alert-danger alert-dismissible" role="alert">`,
                        `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                        '</div>'
                    ].join('')
                    alertPlaceholder.append(wrapper)
                    return

                }
            }
            if (!emailRegex.test(this.CampoEmail)) {

                let message = "O campo email deve conter um formato de email valido"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div style="width: 75vmin;" class="my-0 login-conteiner m-auto alert alert-danger alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)
                return
            }
            let dados = {
                email: this.CampoEmail,
                senha: this.CampoSenha,
                cpf: this.CampoCpf,
                nome: this.CampoNome,
                empresa: this.CampoEmpresa
            }
            axios
                .post(`${this.url}/api/addEmpregador`, dados)
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            this.Tela = ''


        }
    }
}
</script>
<style scoped>
main {
    margin: 0;
    padding: 0;
    background-color: #060854;
    height: 100vh;
}

.BtnVisivel {
    background: none;
    border: none;
    color: white;
}

.btn-generic {
    background: none;
    border: none;

}

.Colaborador {
    border-bottom: solid 2px rgb(50, 175, 50);
}

.Administrador {
    border-bottom: solid 2px rgb(50, 175, 50);
}

#login .container #login-row #login-column #login-box {
    margin-top: 120px;
    max-width: 600px;
    height: 320px;
    border: 1px solid #9C9C9C;
    background-color: #EAEAEA;
}

#login .container #login-row #login-column #login-box #login-form {
    padding: 20px;
}

.text-azul {
    color: #060854;
}

.alinhar-final {
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: end;
}

.modal {
    position: fixed;
}
</style>