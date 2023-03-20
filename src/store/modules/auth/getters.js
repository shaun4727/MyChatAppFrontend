import { GET_USER_OBJECT } from "@/store/storeconstants"
export default {
    [GET_USER_OBJECT](state){
        return state.userObject;
    }
}