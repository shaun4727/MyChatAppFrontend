<template>
    <component :is="resolveComponent" 
        @logged-in="userLoggedIn"
        @logged-out="userLoggedOut"
    >
        <router-view/>
    </component>
</template>

<script>
import LoginView from "@/views/login/login.vue"
import UserView from "@/views/users/user.vue"
import { mapMutations } from 'vuex'
import {SET_USER_OBJECT_MUTATION} from '@/store/storeconstants';

export default{
    components:{
        LoginView,
        UserView
    },
    data(){
        return {
            userDetail: {}
        }
    },
    computed: {
        resolveComponent(){
            if(this.userDetail.username){
                return "UserView"
            }
            return "LoginView"
        }
    },
    created(){
        this.userDetail = window.localStorage.getItem('userDetail')?JSON.parse(window.localStorage.getItem('userDetail')):{username:null};
        this.updateUserDetail();
    },
    methods:{
        ...mapMutations('auth',{
            updateUserObject: SET_USER_OBJECT_MUTATION // map `this.add()` to `this.$store.commit('increment')`
        }),
        userLoggedIn(){
            this.userDetail = JSON.parse(window.localStorage.getItem('userDetail'));
        },
        userLoggedOut(){
            this.userDetail = {username:null}
        },
        async updateUserDetail(){
            try{
                this.updateUserObject(this.userDetail);
            }catch(err){
                console.log(err)
            }
        }
    }

}
</script>

<style scoped>

</style>
