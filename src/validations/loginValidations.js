export default class loginValidation{
    constructor (email, password){
        this.email = email;
        this.password = password;
    }

    checkValidations(){
        let errors = {"email":null,"password":null};
        if(!Validations.checkEmail(this.email)){
            errors.email = "Invalid Email!";
        }
        if(!Validations.minLength(this.password,4)){
            errors.password = "Password is too short!";
        }

        return errors;
    }
}

class Validations{
    static checkEmail(email){
        // eslint-disable-next-line no-useless-escape
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            {
                return (true)
            }
            return (false)
    }

    static minLength(password, minLength){
        if(password.length < minLength){
            return false;
        }
        return true;
    }
}