<template>
    <div class="menu">
      <div class="menu-item"><button @click="inboxView" class="btn-chat">Inbox</button></div>
      <div class="menu-item"><button @click="userView" class="btn-chat">Users</button></div>
      <div class="menu-item"><button @click="doLogout" class="btn-chat">Logout({{ getUserObject.username }})</button></div>
    </div>
</template>

<script>
import { LOGOUT } from '@/services/login_logout/login_logout';
import { mapGetters } from 'vuex';
import { GET_USER_OBJECT } from '@/store/storeconstants';

export default{
    name: "viewRoute",
    computed:{
        ...mapGetters('auth', {
                getUserObject: GET_USER_OBJECT,
        }),
    },
    methods: {
        async doLogout(){
            try{
                await LOGOUT();
                window.localStorage.removeItem('userDetail');
                this.$emit("log-out");
            }catch(err){
                console.log(err)
            }
        },
        userView(){
            this.$emit("to-user");
        },
        inboxView(){
            this.$emit("to-inbox");
        }
    },
}
</script>
<style></style>