<template>
    <viewRoute @log-out="logoutEvent" @to-user="loadUserComp" @to-inbox="loadInboxComp"/>
    <component :is="load_comp" :coProps="CompProps"/>
</template>
  
  <script>
import UserView from '@/views/users/user.vue';
import viewRoute from '@/components/viewRoute.vue';
import InboxView from './inbox/inbox.vue';

  export default {
    name: 'ChatView',
    components: {
        UserView,
        viewRoute,
        InboxView
    },
    data(){
        return {
            load_comp: "UserView"
        }
    },
    computed: {
        CompProps(){
            return ""
        }
    },
    created(){

    },
    methods:{
        logoutEvent(){
            this.$emit("logged-out");
        },
        loadUserComp(){
            this.load_comp = "UserView";
        },
        loadInboxComp(){
            this.load_comp = "InboxView";
        }
    }
  }
  </script>
  
<style scoped>

</style>