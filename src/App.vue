<template>
    <component :is="resolveComponent">
        <router-view/>
    </component>
</template>

<script>
import LoginView from "@/views/login/login.vue"

export default{
    components:{
        LoginView
    },
    computed: {
        resolveComponent(){
            
            return "LoginView"
        }
    },
}
</script>

<style scoped>

</style>
