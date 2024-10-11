<template>
    <div>
        <nav>
            <h1 class="CorPrincipal text-center p-4">Seus colaboradores</h1>
            <div id="liveAlertPlaceholder"></div>
        </nav>
        <section class="container ">

            <div v-if="tela == 'excluirColaborador'" class="w-100 d-flex justify-content-center  ">
            <div  class="modal p-2 d-flex CorSecundaria rounded   " >
            <div class="row p-3">
            <h3 class="text-center p-0">Apagar colaborador</h3>
            <label>Digite o email do colaborador:</label>
            <br>
            <input v-model="CampoEmail" type="text">
            <br>
            <label>Digite o CPF do colaborador:</label>
            <br>
            <MaskInput v-model="CampoCpf" mask='###.###.###-##' placeholder="Ex:. 000.000.000-00" type="text" />
            <br>
            <div class="alinhar-final my-1">
                <button @click="excluir" class="btn btn-danger">Excluir</button>
                <button @click="cancelarModal" class="btn btn-success mx-2">Cancelar</button>
            </div>
            </div>
        </div>   
            </div>
            <div class="rounded my-2  p-3 CorPrincipal" v-for="(colaborador, i) in Colaboradores" :key="i">
                <div  class=" d-flex align-items-center">
                    <div>
                        <img src="/img/colaborador.png" alt="Foto colaborador">
                     </div>
                    <div class="mx-2 row">

                        <label>{{ colaborador.nome }}</label>
                        <label>{{ colaborador.email }}</label>
                        <label>{{ colaborador.cpf }}</label>
                    </div>
                    
                </div>
                <div class="alinhar-final">
                    <MaskInput class="p-1 w-25 " mask='##/##/####' v-model="CampoData" placeholder="Data especifica" type="text" />
                    <button @click="SelecionarColaborador(colaborador.email)" class="mx-2 btn btn-success">Exibir</button>
                    <button @click="AbrirModalExcluir(colaborador.email)" class="btn btn-danger">Excluir</button>
                </div>
            </div>

        </section>
        <div>
            <button @click="AddColaborador" class="btn-add text-center"><i style="font-size: 3em;"
                    class="bi-plus"></i></button>
        </div>
        <addclientes @Colaboradores="NvColaboradores = $event" @msg_sucesso="sucesso = $event" @FecharTela="tela = $event" v-if="tela == 'AdicionarColaborador'">
        </addclientes>


    </div>
</template>

<script>
import addclientes from './AddClienteComponent.vue'
import variaveis from '@/store/VariaveisStaticas.js';
import axios from 'axios';
export default {
    components: {
        addclientes,
    },
    watch: {
        sucesso(msg) {
            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            if (msg === "OK") {
                let message = "Colaborador cadastrado com sucesso!!"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-success alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-check-circle "></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)
            }else{
                let message = "Email do empregador não consta no banco"
                        const wrapper = document.createElement('div')
                        wrapper.innerHTML = [
                            `<div class="alert alert-danger alert-dismissible" role="alert">`,
                            `   <div><i class="px-2 bi bi-exclamation-triangle"></i>${message}</div>`,
                            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                            '</div>'
                        ].join('')
                        alertPlaceholder.append(wrapper)
            }
        },
        NvColaboradores(dados){
            this.Colaboradores.push(dados)
        },
        Colaboradores(){
           
        }
    },
    data() {
        return {
            url:'http://192.168.100.220:8001',
            tela: "",
            sucesso: "",
            Colaboradores: "",
            NvColaboradores: "",
            CampoData:"",
            CampoEmail:"",
            CampoCpf:""
        }
    },
    mounted() {
        axios
            .post(`${this.url}/api/enviarcolaborador`,{email:variaveis.GetEmail()})
            .then((res) => {
                this.Colaboradores = res.data
                console.log("200 => Colaboradores recebidos com sucesso!!!")
            })
            .catch((erro) => {
                console.log(erro);
            })
    },
    methods: {
        AddColaborador() {
            this.tela = "AdicionarColaborador"
        },
        SelecionarColaborador(i){
            //06/10/2024
            this.$router.push('/SeuColaborador?dados='+encodeURIComponent(JSON.stringify({email:i,data:this.CampoData})));
        },
        AbrirModalExcluir(email){
            this.CampoEmail = email
            this.tela = "excluirColaborador"
        },
        cancelarModal(){
            this.tela = ""
            
        },
        excluir(){
            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            if(this.CampoEmail.trim().length <= 0 ||this.CampoCpf.trim().length <= 0 ){
                return
            }
            axios
            .post(`${this.url}/api/ExcluirColaborador`,{email:this.CampoEmail,cpf:this.CampoCpf})
            .then((res) => {
                if(res.data == "Nada"){
                    let message = "Colaborador não encontrado, Certifique que os dados estão certos!!"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-danger alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-exclamation-triangle "></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)
                console.log(res)
                this.tela = ""
                return
                }
  
                let message = "Registro do colaborador excluido!!"
                const wrapper = document.createElement('div')
                wrapper.innerHTML = [
                    `<div class="alert alert-success alert-dismissible" role="alert">`,
                    `   <div><i class="px-2 bi bi-check-circle "></i>${message}</div>`,
                    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                    '</div>'
                ].join('')
                alertPlaceholder.append(wrapper)
                console.log(res)
                this.tela = ""
            })
            .catch((erro) => {
                console.log(erro);
            })   
        }

    }

}
</script>


<style scoped>
* {
    margin: 0px;
    padding: 0px;
}


.CorPrincipal {
    background-color: #060854;
    color: aliceblue;
}
.CorSecundaria{
    background-color: #2b157e;
    color: aliceblue;
}

.btn-add {

    position: fixed;
    background-color: #060854;
    color: aliceblue;
    width: 20vw;
    height: 10vh;
    border: none;
    border-radius: 10px;
    left: 75vw;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    top: 88%;
}
.alinhar-final {
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: end;
}
.modal{
    width: 340px;
    height: 250px;
    position: fixed;
    top: 15%;
    justify-content: center;
    align-items: center;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    left: auto

}
</style>
