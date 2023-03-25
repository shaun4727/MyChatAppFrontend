<template>
	<div id="chat-container" @click="hideList" >
		<div id="search-container">
			<input type="text" placeholder="Search" @click.stop="displayList" v-model="searchText"/>
			<ul id="list">
				<li v-for="(participant, index) in filteredParticipants" :key="index">
					<div class="list-contact" @click.stop="addConversation(participant)">
						<img :src="participant.url" alt="" />
						<p>{{ participant.name }}</p>
					</div>
				</li>
			</ul>
		</div>
		<div id="conversation-list" >
			<template v-for="(conversation,index) in conversations" :key="index" >
                <div class="conversation" :class="{active: conversation?.id == currentParticipant?.id}" @click="setNewConversation(conversation)" v-if="getUserObject.id != conversation?.participant?.id">
                    <img :src="conversation.participant.url" alt="image" />
                    <div class="title-text">{{ conversation.participant.name }}</div>
                    <di class="created-date"> {{ conversation.created_at }} </di>
                    <div class="conversation-message">This is a message</div>
                </div>
                <div class="conversation" :class="{active: conversation.id == currentParticipant.id}" @click="setNewConversation(conversation)" v-else>
                    <img :src="conversation.creator.url" alt="image" />
                    <div class="title-text">{{ conversation.creator.name }}</div>
                    <di class="created-date"> {{ conversation.created_at }} </di>
                    <div class="conversation-message">This is a message</div>
                </div>
            </template>
		</div>
		<div id="new-message-container">
			<a href="#">+</a>
		</div>
		<div id="chat-title">
			<span>{{ currentParticipant?.participant?.name || '' }} </span>
			<img src="@/assets/images/trash.png" alt="Delete Conversation" />
		</div>
		<div id="chat-message-list">
			<template v-for="(message,index) in messages" :key="index">
                <div class="message-row you-message" v-if="message.sender.id == getUserObject.id">
                    <div class="message-content" >
                        <div class="message-text">{{ message.text }}</div>
                        <div class="message-time">{{ message.createdAt }}</div>
                    </div>
                </div>
                <div class="message-row other-message" v-else>
                    <div class="message-content">
                        <img :src="currentParticipant?.participant?.url" alt="user" />
                        <div class="message-text">{{ message.text }}</div>
                        <div class="message-time">{{ message.createdAt }}</div>
                    </div>
                </div>
                
            </template>
		</div>
		<div id="chat-form">
			<img src="@/assets/images/attachment.png" alt="Add Attachment" />
			<input type="text" placeholder="Type a message" v-model="currentMessage" @keyup.enter="sendMessage" />
		</div>
	</div>

	<div class="modal-wrapper" id="add-conversation-modal">
		<div class="modal">
			<a href="#" class="modal-close">+</a>
			<div class="modal-title">
				<h2>Create New Conversation</h2>
			</div>
			<div class="modal-body">
				<form>
					<input type="text" placeholder="Name" />
					<input type="text" placeholder="Username" />
					<input type="button" value="Submit" />
				</form>
			</div>
		</div>
	</div>
</template>

<script>
	import { getUser } from '@/services/user/user';
	import { mapGetters } from 'vuex';
	import { GET_USER_OBJECT } from '@/store/storeconstants';
    import { addConversation,getConversations,getMessages,deliverMessages} from '@/services/inbox/inbox'
    import { socket } from "@/socket";


	export default {
		name: 'InboxView',
		data() {
			return {
				users: [],
                conversations: [],
                searchText: '',
                currentParticipant:{},
                messages: [],
                currentMessage: "",
                getMessageFromSocket: false,
                socketId: null
			};
		},
		async mounted() {
            socket.connect();
			await this.usersList();
            await this.getConversations();
            socket.on("test-msg",(arg)=>{
                    if(arg.receiver.id == this.getUserObject.id){
                        this.messages.unshift(arg);
                    }
                })
		},
		computed: {
           
			...mapGetters('auth', {
				getUserObject: GET_USER_OBJECT,
			}),
			participants() {
				return this.users.filter((user) => user.email.toString() != this.getUserObject.email.toString());
			},
            filteredParticipants(){
                if(this.searchText){
                    return this.participants.filter(item => Object.entries(item)
                            .reduce((result,[,value]) => !(value instanceof Object)? result += `${value}`:result,'').toLowerCase()
                            .includes(this.searchText.toString().toLowerCase()))
                }
                return this.participants;
            }
		},
		methods: {
			async usersList() {
                
				try {
					const res = await getUser();
					this.users = res.data.users || [];
				} catch (err) {
					console.log(err);
				}
			},
			async addConversation(participant) {
                
                const data = {
                    "participant": participant.name,
                    "id": participant.id,
                    "url": participant.url 
                }

                try{
                    const existingUser = this.conversations.filter(item => participant.id == item.creator.id || participant.id == item.participant.id);
                    if(!existingUser.length){
                        const res = await addConversation(data);
                        if(res.data.response_code == 200){
                            this.conversations.push(res.data.newConversation);
                        }
                    }
                }catch(err){
                    console.log(err);
                }
                this.hideList();
			},
            displayList(){
                document.querySelector("#list").style.display = "block";
            },
            hideList(){
                console.log("hide")
                document.querySelector("#list").style.display = "none";
            },
            async getConversations(){
                
                try{
                    const res = await getConversations();
                    this.conversations = res.data.conversations;
                }catch(err){
                    console.log(err)
                }
            },
            async setNewConversation(conversation){
                if(this.getUserObject.id == conversation.participant.id){
                    this.currentParticipant = {
                        id: conversation.id,
                        creator:{...conversation.participant},
                        participant:{...conversation.creator},
                        created_at: conversation.created_at
                    }
                }else{
                    this.currentParticipant = {...conversation};
                }
                this.getMessages(conversation.id);
            },
            async getMessages(id){
                try{
                    const res = await getMessages(id);
                    if(res.data.response_code == 200){
                        this.messages = res.data.messages;
                    }
                }catch(err){
                    console.log(err);
                }
            },
            async sendMessage(){
                
                try{
                    if(this.currentMessage){
                        const data = {
                            message: this.currentMessage,
                            receiverId: this.currentParticipant.participant.id,
                            receiverName: this.currentParticipant.participant.name,
                            avatar: this.currentParticipant.participant.url,
                            conversationId: this.currentParticipant.id
                        }

                        this.messages.unshift({
                            sender:{
                                avatar: null,
                                id: this.getUserObject.id,
                                name: this.getUserObject.username
                            },
                            receiver:{
                                id: this.currentParticipant.participant.id,
                                name: this.currentParticipant.participant.name,
                                avatar: this.currentParticipant.participant.url
                            },
                            id: this.currentParticipant.id,
                            text: this.currentMessage,
                            date_time: Date.now(),
                            createdAt: Date.now()
                        });

                        await deliverMessages(data);
                        this.currentMessage = '';
                        
                    }
                }catch(err){
                    console.log(err);
                }
            }

		},
	};
</script>

<style scoped>
	ul#list {
		list-style-type: none;
		background: var(--secondary);
		height: 300px;
		max-height: 300px;
		border: 1px solid #000;
		overflow-y: scroll !important;
		position: absolute;
		top: 105px;
		left: 263px;
		display: none;
		width: 243px;
	}
	.list-contact {
		display: flex;
		flex-direction: row;
		border-bottom: 1px solid black;
		padding: 5px 10px;
		cursor: pointer;
	}
	#list .list-contact img {
		width: 30px;
	}
	#list .list-contact p {
		color: white;
		font-size: 14px;
		margin: 5px 0 0 5px;
	}


</style>
