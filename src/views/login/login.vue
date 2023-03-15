<template>
    <div id="login-container">
      <div id="left-column"></div>
      <div id="branding">
        <img src="@/assets/images/logo.png" />
        <h1>Login - Chat Application {{ firstName }}</h1>
      </div>
      <div id="login-form">
          <input
            type="text"
            placeholder="enter mobile or email"
            v-model="name"
          />
          <p class="error" v-show="loginErrors.email" >{{ loginErrors.email }}</p>
          <input type="password" v-model="password" placeholder="enter password" />
          <p class="error" v-show="loginErrors.password">{{ loginErrors.password }}</p>
          <input type="submit" value="Login" @click="doLogin"/>
      </div>
    </div>
</template>
  
  <script>
  // @ is an alias to /src
//   import HelloWorld from '@/components/HelloWorld.vue'
    import loginValidations from "@/validations/loginValidations";
import {mapState} from 'vuex';
import { mapActions } from "vuex";
import {LOGIN_ACTION} from '@/store/storeconstants';

  
  export default {
    name: 'LoginView',
    components: {
    },
    data(){
        return {
            name: '',
            password: '',
            loginErrors: {
                "email": null,
                "password": null
            }
        }
    },
    computed: {
        // auth is namespace
        ...mapState('auth',{
             firstName: (state) => state.name
        }),
        

    },
    methods:{
        ...mapActions('auth',{
            login: LOGIN_ACTION,
        }),
        async doLogin(){
            let validations = new loginValidations(this.name,String(this.password));
            this.loginErrors = validations.checkValidations();
            for(let key in this.loginErrors){
                if(this.loginErrors[key]?.length > 0){
                    return
                }
            }
            
            // login functionality
            await this.login({username: this.name,password:this.password});
            const userDetail = window.localStorage.getItem('userDetail')?JSON.parse(window.localStorage.getItem('userDetail')):{username:null};
            if(userDetail.username){
                this.$emit("logged-in")
            }
        }
    }
  }
  </script>
  
<style scoped>

</style>