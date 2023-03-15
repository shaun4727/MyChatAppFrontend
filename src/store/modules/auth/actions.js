import { LOGIN_ACTION,SET_USER_OBJECT_MUTATION } from "@/store/storeconstants";
import {LOGIN} from '@/services/login_logout/login_logout';

export default {
    async [LOGIN_ACTION](context, payload){
        await LOGIN(payload).then(res => {
            if(res.status){
                context.commit(SET_USER_OBJECT_MUTATION,res.data.data);
                window.localStorage.setItem("userDetail",JSON.stringify(res.data.data));
            }else{console.log("Login response status is not 200")}
        }).catch(err => console.log(err))
    }
}