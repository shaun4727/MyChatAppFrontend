import {SET_USER_OBJECT_MUTATION} from '@/store/storeconstants'

export default {
    [SET_USER_OBJECT_MUTATION](state,payload){
        state.userObject = payload;
    }
}