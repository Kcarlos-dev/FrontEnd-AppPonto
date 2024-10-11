class VariaveisStaticas {
    static EmailValue = ""
    static permissao = false;

    static getpermissao() {
        return this.permissao;
    }
    static setpermissao(value) {
        this.permissao = value;
    }
    static SetEmail(email) {
        this.EmailValue = email
    }
    static GetEmail() {
        return this.EmailValue
    }

}

export default VariaveisStaticas;