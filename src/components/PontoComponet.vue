<template>
    <div>
        <nav>
            <h1 class="CorPrincipal text-center p-4">Seus colaboradores</h1>
            <div id="liveAlertPlaceholder"></div>
        </nav>
        <div>
            <button @click="AddColaborador" class="btn-add text-center"><i style="font-size: 3em;"
                    class="bi-plus"></i></button>
        </div>
        <addclientes @msg_sucesso="sucesso = $event" @FecharTela="tela = $event" v-if="tela == 'AdicionarColaborador'">
        </addclientes>

    </div>
</template>

<script>
import addclientes from '../views/AddClienteComponent.vue'
export default {
    components: {
        addclientes
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
            }
        }
    },
    data() {
        return {
            tela: "",
            NomeColaborador: "",
            EmailColaborador: "",
            sucesso: "",

        }
    },
    methods: {
        AddColaborador() {
            this.tela = "AdicionarColaborador"
        },

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
</style>
