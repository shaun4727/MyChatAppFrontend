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
    },
    methods:{
        userLoggedIn(){
            this.userDetail = JSON.parse(window.localStorage.getItem('userDetail'));
        },
        userLoggedOut(){
            this.userDetail = {username:null}
        }
    }

}
</script>

<style scoped>

</style>
