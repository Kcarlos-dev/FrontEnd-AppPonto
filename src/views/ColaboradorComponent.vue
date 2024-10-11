<template>
    <main>
        <div class="CorPrincipal p-1">
            <img class="mx-2" src="/img/colaborador.png" alt="Foto colaborador">
            <label class="mx-2">{{ ColaboradorEmail }}</label>
        </div>
        <div class="container-fluid d-flex justify-content-center  row" style="position: fixed;"
            id="liveAlertPlaceholder">
        </div>
        <section class="d-flex justify-content-center">
            <div v-show="Tela == 'ponto'" class=" contener-fixed container rounded CorPrincipal px-2 py-3">
                <div>
                    <label>CPF</label>
                    <input class="input-group" type="text" :value="cpf">
                </div>
                <div>
                    <label>Data</label>
                    <input class="input-group" type="text" :value="DataAtual">
                </div>
                <div>
                    <label>Hora</label>
                    <input ref="hora" class="input-group" type="text" :value="Hora">
                </div>
                <div class="alinhar-final">
                    <button @click="Cancelar" class="btn btn-danger my-2 mx-1">Cancelar</button>
                    <button @click="Confirmar" class="btn btn-success my-2">Confirmar</button>
                </div>
            </div>
        </section>
        <div style="height:100vh ; " class="d-flex align-items-center justify-content-center ">
            <button @click="BaterPonto" type="button" class="btn btn-success">bater ponto</button>
        </div>
    </main>
</template>

<script>
import variaveis from '@/store/VariaveisStaticas.js';
import axios from 'axios';
export default {
    data() {
        return {
            Tela: "",
            url:'http://192.168.100.220:8001',
            ColaboradorEmail: "",
            DataAtual: "",
            Hora: "",
            cpf:"",
            
        }
    },
    components: {
        
    },
    mounted() {
        let dados = ""
        document.querySelectorAll('input').forEach(input => {
            input.disabled = true;
        });

        axios
        .get(`http://worldtimeapi.org/api/timezone/America/Belem`)
        .then((res)=>{
            dados = res.data.datetime
            const date = new Date(dados)

            this.DataAtual = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
            this.Hora = date.getHours()+":"+date.getMinutes() 

        })
        .catch((err)=>{
            console.log(err)
        })

        this.ColaboradorEmail = variaveis.GetEmail()
        axios
            .post(`${this.url}/api/ColaboradorExpecifico`,{email:this.ColaboradorEmail})
            .then((res) => {
                res.data.forEach((e)=>{
                   this.cpf = e.cpf
                })
                console.log("200 => Colaboradores recebidos com sucesso!!!")
            })
            .catch((erro) => {
                console.log(erro);
            })
    },
    methods: {
        BaterPonto() {
            this.Tela = "ponto"
        },
        Cancelar() {
            this.Tela = ""
        },
        Confirmar() {
            if(this.$refs.hora.value.trim().length <= 0){
                return
            }
            const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
            axios
                .post(`${this.url}/api/ReceberPonto`, {
                    Email: this.ColaboradorEmail,
                    Hora: this.Hora,
                    Data: this.DataAtual,
                    cpf: this.cpf
                })
                .then((res) => {
                    console.log(res)
                })
                .catch((error) => {
                    console.log(error);
                    return
                });
            this.Tela = ""
            let message = "Ponto cadastrado com sucesso!!"
            const wrapper = document.createElement('div')
            wrapper.innerHTML = [
                `<div style="width: 75vmin;" class=" m-auto alert alert-success alert-dismissible" role="alert">`,
                `   <div><i class="px-2 bi bi-check-circle "></i>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('')
            alertPlaceholder.append(wrapper)
        }
    }


}
</script>
<style scoped>
.CorPrincipal {
    background-color: #060854;
    color: aliceblue;
}

.contener-fixed {
    position: absolute;
    top: 20%;
}

.alinhar-final {
    margin: 0px;
    padding: 0px;
    display: flex;
    justify-content: end;
}
</style>