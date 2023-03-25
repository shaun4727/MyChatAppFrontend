<template>

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
            <tr id="" v-for="(user,index) in users" :key="index">
              <td class="name">
                <img :src="user.url" />
                <span>{{ user.name }}</span>
              </td>
              <td>{{ user.email }}</td>
              <td class="manage">
                <span @click="RemoveUser(user.id)"><img src="@/assets/images/trash.png" alt="Delete" /></span>
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
          <div id="add-user-form">
            <input type="text" placeholder="enter name" v-model="userInformation.name" />
            <!-- <p class="error show">This is error</p> -->
            <input type="text" placeholder="enter email" v-model="userInformation.email" />
            <input type="text" placeholder="enter mobile" v-model="userInformation.mobile" />
            <input
              type="password"
              placeholder="enter password"
              v-model="userInformation.password"
            />
            <input type="file"  @change="handleAttachment"/>
            <input type="submit" value="Submit" @click="addNewUser" />
          </div>
        </div>
      </div>
    </div>
</template>
  
  <script>
import { getUser,addUser,removeUser } from '@/services/user/user';


  
  export default {
    name: 'UserView',
    components: {
    },
    data(){
        return {
            users: [],
            userInformation: {
                name: "",
                email: "",
                mobile: null,
                password: "",
                fileName: ""
            }
        }
    },
    created(){
        this.usersList();
    },
    methods:{
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
        },

        // file handling start
        handleAttachment(e){
            this.userInformation.fileName = "";

            if(e.target.files.length > 0){
                let files = e.target.files;
                this.convertAndSaveFilesToBase64(files);
            }
        },
        async convertAndSaveFilesToBase64(files) {
            this.userInformation.fileName = await this.getBase64(files[0]);
        },
        getBase64(file) {
            let reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onabort = () => {
                    reject({ name: 'Error', message: 'Could not read file' });
                };

                reader.onloadend = () => {
                    resolve({
                        name: file.name,
                        base64: reader.result,
                        size: file.size,
                    });
                };

                reader.readAsDataURL(file);
            });
        },
        // file handling done
        async addNewUser(){
            let user = {
                ...this.userInformation,
                image: this.userInformation?.fileName?.base64
            }
            try{
                const newUser = await addUser(user);
                this.users.push(newUser.data.user);
                this.closeModal();
            }catch(err){
                console.log(err)
            }
        },
        async RemoveUser(id){
            try{
                await removeUser(id);
                this.users.splice(this.users.findIndex(item => item.id == id),1);
            }catch(err){
                console.log(err)
            }
        }
    }
  }
  </script>
  
<style scoped>

</style>