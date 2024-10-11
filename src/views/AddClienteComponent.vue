<template>
    <div class="container d-flex justify-content-center">
        <div class="row rounded generico-modal justify-content-center py-3 px-3">
            <div style="position: fixed;" class="w-75" id="MsgErro"></div>
            <h4 class="h4 text-center text-light">Cadastro</h4>
            <label class="text-light p-0">Nome do Colaborador:</label>
            <input v-model="CampoNome" placeholder="Ex:. Fulano da silva" class="form-control mb-2" type="text">
            <label class="text-light p-0">Email do Colaborador:</label>
            <input v-model="CampoEmail" placeholder="Ex:. Email@email.com" class="form-control" type="email">
            <label class="text-light p-0">Senha:</label>
            <div class="d-flex">
                <input v-model="CampoSenha" placeholder="Ex:.senha" class="form-control" :type="TipoSenha">
                <button @click="visualizarSenha" class="BtnVisivel mx-1"><i :class="iconSenha"></i></button>
            </div>
            <label class="text-light p-0">Email empregador:</label>
            <input id="EmailEmpregador" v-model="CampoEmpregador" placeholder="Ex:. Chefe@empresa.com"
                class="form-control" type="text">
            <label class="text-light p-0">Função:</label>
            <input v-model="CampoFuncao" placeholder="Ex:. Pedreiro" class="form-control" type="text">
            <label class="text-light p-0">CPF do Colaborador:</label>
            <MaskInput mask='###.###.###-##' v-model="CampoCpf" placeholder="Ex:. 000.000.000-00" class="form-control"
                type="text" />

            <label class="text-light p-0">Data de Integração:</label>
            <input v-model="CampoDatadeIntegração" placeholder="Ex:. 00/00/0000" class="form-control" type="date">
            <div class="alinhar-final">
                <button @click="Cancelar" class="btn btn-danger mt-2 mx-2">Cancelar</button>
                <button id="liveAlertBtn" @click="Cadastrar" class="btn btn-success mt-2">Cadastrar</button>
            </div>
        </div>

    </div>
</template>

<script>
import VariaveisStaticas from '@/store/VariaveisStaticas';
import axios from 'axios';
import { MaskInput } from 'vue-3-mask';
export default {
    components: {
        MaskInput,
    },
    data() {
        return {
            url: 'http://192.168.100.220:8001',
            CampoNome: "",
            CampoEmail: "",
            CampoCpf: "",
            CampoFuncao: "",
            CampoSenha: "",
            CampoEmpregador: "",
            CampoDatadeIntegração: "",
            TipoSenha: 'password',
            iconSenha: 'bi bi-eye-slash-fill',
        }
    },
    mounted() {
        const EmailEmpregador = document.getElementById('EmailEmpregador')
        EmailEmpregador.disabled = true
        this.CampoEmpregador = VariaveisStaticas.GetEmail()
    },
    methods: {
        Cancelar() {
            this.$emit('FecharTela', "")
        },
        Cadastrar() {
            const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
            if (this.CampoNome.trim().length <= 0 || this.CampoEmail.trim().length <= 0) {

                const alertPlaceholder = document.getElementById('MsgErro')
                let message = "Preencha todos os campos"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)

                return
            }
            if (!emailRegex.test(this.CampoEmail)) {
                const alertPlaceholder = document.getElementById('MsgErro')
                let message = "O campo email deve conter um formato de email valido"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)
                return
            }
            axios
                .post(`${this.url}/api/addcolaborador`, { nome: this.CampoNome, email: this.CampoEmail, senha: this.CampoSenha, cpf: this.CampoCpf, integracao: this.CampoDatadeIntegração, funcao: this.CampoFuncao, empregador: this.CampoEmpregador })
                .then(({data}) => {
                   if(data == "Email do empregador não consta no banco"){
                    console.log(data)
                    this.$emit('msg_sucesso', "erro")
                    this.$emit('FecharTela', "")
                   }else{
                    this.$emit('Colaboradores', { nome: this.CampoNome, email: this.CampoEmail, cpf: this.CampoCpf, integracao: this.CampoDatadeIntegração })
                    this.$emit('msg_sucesso', "OK")
                    this.$emit('FecharTela', "")
                   }

                })
                .catch((error) => {
                    console.log(error)
                });

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
    }
}
</script>
<style scoped>
* {
    margin: 0px;
    padding: 0px;
}

.BtnVisivel {
    background: none;
    border: none;
    color: white;
}

.generico-modal {
    width: 90vw;
    position: absolute;
    top: 20%;
    background-color: #060854;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
}

.alinhar-final {
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: end;
}
</style>