<template>
    <viewRouteVue @log-out="logoutEvent"/>

    <div class="manageUser-container">
      <div id="title">
        <h2>Manage Users</h2>
      </div>

      <div class="new-message-container new-user">
        <a href="#" @click="openModal()">+</a>
      </div>

      <div id="users-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Manage</th>
            </tr>
          </thead>
          <tbody id="users-table">
            <tr id="">
              <td class="name">
                <img src="@/assets/images/user1.png" />
                <span>User 1</span>
              </td>
              <td>email@email.com</td>
              <td class="manage">
                <img src="@/assets/images/trash.png" alt="Delete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal-wrapper" id="add-user-modal">
      <div class="modal">
        <a href="#" @click="closeModal()" class="modal-close">+</a>
        <div class="modal-title">
          <h2>Create New User</h2>
        </div>
        <div class="modal-body">
          <form id="add-user-form">
            <input type="text" placeholder="enter name" name="name" />
            <p class="error show">This is error</p>
            <input type="text" placeholder="enter email" name="email" />
            <input type="text" placeholder="enter mobile" name="mobile" />
            <input
              type="password"
              placeholder="enter password"
              name="password"
            />
            <input type="file" name="avatar" />
            <input type="submit" value="Submit" />
          </form>
        </div>
      </div>
    </div>
</template>
  
  <script>
import viewRouteVue from '@/components/viewRoute.vue';
import { getUser } from '@/services/user/user';


  
  export default {
    name: 'UserView',
    components: {
        viewRouteVue,
    },
    data(){
        return {
            users: []
        }
    },
    computed: {

    },
    created(){
        this.usersList();
    },
    methods:{
        logoutEvent(){
            this.$emit("logged-out");
        },
        openModal(){
            const modal = document.querySelector("#add-user-modal");
            modal.style.display = "block";
        },
        closeModal(){
            const modal = document.querySelector("#add-user-modal");
            modal.style.display = "none";
        },
        async usersList(){
            try{
                const res = await getUser();
                this.users = res.data.users || [];
            }catch(err){
                console.log(err);
            }
        }

    }
  }
  </script>
  
<style scoped>

</style>