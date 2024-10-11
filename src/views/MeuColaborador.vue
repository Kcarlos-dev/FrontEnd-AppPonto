<template >
    <div >
        <h3 class="text-center"><b>FOLHA DE PONTO</b></h3>
        <div  class="Conteinerbordas">
            <ul class="py-1 px-2">
                <li>EMPREGADOR - {{ this.dadosPessoal.empregador }}</li>
                <li>EMPREGADO - {{ this.dadosPessoal.colaborador }}</li>
                <li>Cargo - {{ this.dadosPessoal.funcao }}</li>
                <li><b>Horario de trabalho:</b></li>
                <li>De segunda a sexta - das 08:00 às 16:00 hs.</li>
                <li>Sábado - das 08:00 às 12:00 hs.</li>
            </ul>
        </div>
        <div class="Conteiner-tabela">
            
            <table>
                <thead>
                    <tr>
                        <th scope="col" style="width: 15%;">Data</th>
                        <th scope="col" style="width: 30%;">Nome</th>
                        <th scope="col" style="width: 30%;">Email</th>
                        <th scope="col" style="width: 30%;">CPF</th>
                        <th scope="col">Hora</th>
                    </tr>
                </thead>
                <tbody v-for="(dado, i) in dados" :key="i">
                    <tr>
                        <th class="linhas" scope="row"><input class="InputTabela" type="text" :disabled="desabilitar"  :value="dado.data_ponto"></th>
                        <td class="linhas"><input class="InputTabela" type="text" :disabled="desabilitar" :value="dado.nome"></td>
                        <td class="linhas"><input class="InputTabela" type="text" :disabled="desabilitar" :value="dado.email"></td>
                        <td class="linhas"><input class="InputTabela" type="text" :disabled="desabilitar" :value="dado.cpf"></td>
                        <td class="linhas"><input class="InputTabela" type="text" :disabled="desabilitar" :value=" dado.hora "></td>
                    </tr>
                </tbody>

            </table>
        </div>
        <br>
        <div ref="div_button">
            <button class="btn btn-success" @click="imprimir">
                imprimir
            </button>
            <button class="btn btn-danger text-light mx-2" @click="voltar">
                voltar
            </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';



export default {
    data() {
        return {
            url:'http://192.168.100.220:8001',
            dados: "",
            desabilitar:true,
            dadosPessoal:"",
        };
    },
    mounted() {
        const urlParams = new URLSearchParams(location.search);
        const dados = JSON.parse(decodeURIComponent(urlParams.get('dados')))
        axios
            .post(`${this.url}/api/GerarRelatorio`, dados)
            .then((res) => {
                this.dados = res.data
                this.dados.forEach(element => {
                    this.dadosPessoal = {
                        colaborador:element.nome,
                        funcao:element.funcao,
                        empregador:element.EMPREGADOR
                    }
                });
                console.log("200 => SUCESSO")
            })
            .catch((err) => {
                console.log(err)
            })
    },
    methods: {
        imprimir() {
                const botao = this.$refs.div_button
                botao.style.display = 'none'; 
                window.print();
                setTimeout(() => {
                    botao.style.display = 'block';
                }, 100)
        },
        voltar(){
            this.$router.go(-1)
        },
    },
};
</script>

<style scoped>
.InputTabela{
    width: 100%;
    padding-left: 1px;
    text-align: center;
    color: rgba(0, 0, 0, 0.822);
}
.Conteinerbordas {
    border: solid black 1px;

}

.Conteinerbordas li {
    list-style-type: none
}

.Conteiner-tabela {
    
    overflow-x: auto;
}

thead {
    border: solid black 1px;
    border-top: none;
}

thead th {
    padding: 10px;
    border-left: solid black 1px;
    text-align: center;
}

tbody {
    text-align: center;
    border: solid black 1px;
}

tbody td {
    border-left: solid black 1px;
}

.linhas {
    border-bottom: solid black 1px;
}
</style>
