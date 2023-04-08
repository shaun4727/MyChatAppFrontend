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
                    <div>
                        <img :src="conversation?.participant?.url" alt="image" />
                        <span style="color:red; position:absolute;" v-if="NewMsg.conversation_id == conversation.id">*</span> 
                    </div>
                    <div style="display:flex; flex-direction: column;">
                        <div style="display:flex;">
                            <div class="title-text">{{ conversation.participant.name }} </div>
                            <div class="created-date"> {{ conversation.created_at }} </div>
                        </div>
                        <div class="conversation-message" v-show="conversation.last_msg.length"> <span v-if="getUserObject?.id == conversation?.last_msg[0]?.sender.id">You:</span> <span v-else>{{ conversation?.last_msg[0]?.sender?.name?.split(" ")[0] }}:</span>{{ conversation?.last_msg[0]?.text }}</div>
                    </div>
                </div>
                <div class="conversation" :class="{active: conversation.id == currentParticipant.id}" @click="setNewConversation(conversation)" v-else>
                    <div>
                        <img :src="conversation?.creator?.url" alt="image" />
                        <span style="color:red; position: absolute;" v-if="NewMsg.conversation_id == conversation.id">*</span>
                    </div>
                    <div style="display:flex; flex-direction: column;">
                        <div style="display:flex;">
                            <div class="title-text">{{ conversation.creator.name }} </div>
                            <div class="created-date"> {{ conversation.created_at }} </div>
                        </div>
                        <div class="conversation-message" v-show="conversation.last_msg.length"> <span v-if="getUserObject?.id == conversation?.last_msg[0]?.sender.id">You:</span> <span v-else>{{ conversation?.last_msg[0]?.sender?.name?.split(" ")[0] }}:</span>{{ conversation?.last_msg[0]?.text }}</div>
                    </div>
                </div>
            </template>
		</div>
		<div id="new-message-container">
			<a href="#">+</a>
		</div>
		<div id="chat-title">
			<span>{{ currentParticipant?.participant?.name || '' }} </span>
            <i class="material-icons call" @click="callUser(currentParticipant?.participant?.id)" v-show="currentParticipant?.participant?.name">call</i>
		</div>
		<div id="chat-message-list">
			<template v-for="(message,index) in GotMessages" :key="index">
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
    <div class="video">
        <video width="320" height="240" autoplay id="videoElement">
        </video>
    </div>
</template>

<script>
	import { getUser } from '@/services/user/user';
	import { mapGetters } from 'vuex';
	import { GET_USER_OBJECT } from '@/store/storeconstants';
    import { addConversation,getConversations,getMessages,deliverMessages} from '@/services/inbox/inbox'
    // import { socket,state } from "@/socket";
    import { io } from "socket.io-client";
    import Peer from "simple-peer";


	export default {
		name: 'InboxView',
		data() {
			return {
				users: [],
                conversations: [],
                searchText: '',
                currentParticipant:{},
                currentConversation: [],
                messages: [],
                currentMessage: "",
                NewMsg:"",
                newMessage: "",
                getMessageFromSocket: false,
                socketId: null,
                videoTag: null,
                callState:{
                    me: null,
                    stream: null,
                    receivingCall: null,
                    caller: null,
                    callerSignal: null,
                    callAccepted: null,
                    idTocall: null,
                    callEnded: null,
                    name: null,
                    myVideo: null,
                    userVideo: null,
                    connection: null
                }
			};
		},
		async mounted() {
            this.videoTag = document.querySelector("#videoElement");
			await this.usersList();
            await this.getConversations();
            this.acceptMsg();
            // this.videoCall();
		},
        unmounted(){
            this.stopBothVideoAndAudio(this.callState.myVideo);
        },
		computed: {
           socket(){
                return io("http://localhost:5000");
           },
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
            },
            GotMessages(){
                return this.currentConversation.last_msg;
            }
		},
		methods: {
            acceptMsg(){
                this.socket.on(`test-msg`,(arg)=>{
                    this.NewMsg = arg;
                    if(arg.receiver.id == this.getUserObject.id){
                        this.messages.unshift(arg);
                    }
                    this.conversations.forEach(conversation => {
                        if(conversation.id == arg.conversation_id){
                            conversation.last_msg.unshift(arg)
                        }
                    })
                })
            },
            stopBothVideoAndAudio(stream) {
                if(!stream) return;
                stream.getTracks().forEach(function(track) {
                    if (track.readyState == 'live') {
                        track.stop();
                    }
                });
            },
            async videoCall(){
                await navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
                    this.callState.stream = stream;
                    this.callState.myVideo = stream;
                    this.videoTag.srcObject = this.callState.myVideo;
                })

                this.socket.on(`me`, (arg) => {
                    this.callState.me = arg;
                })

                this.socket.on("call user", (data) => {
                    this.callState.receivingCall = true;
                    this.callState.caller = data.from;
                    this.callState.name = data.name;
                    this.callState.callerSignal = data.signal;
                })
            },
            callUser(id){
                
                const peer = new Peer({
                    initiator: true,
                    trickle: false,
                    stream: this.callState.stream
                })
                peer.on("signal", (data) => {
                    this.socket.emit("callUser", {
                        userToCall: id,
                        signalData: data,
                        from: this.me,
                        name: this.name
                    })
                })
                peer.on("stream", (stream) => {
                    this.callState.userVideo = stream
                })
                this.socket.on("callAccepted", (signal) => {
                    this.callState.callAccepted = true;
                    peer.signal(signal)
                })

                this.callState.connection = peer
            },
            answerCall(){
                this.callState.callAccepted = true;
                const peer = new Peer({
                    initiator: false,
                    trickle: false,
                    stream: this.callState.stream
                })
                peer.on("signal", (data) => {
                    this.socket.emit("answerCall", { signal: data, to: this.callState.caller })
                })
                peer.on("stream", (stream) => {
                    this.callState.userVideo = stream
                })

                peer.signal(this.callState.callerSignal)
                this.callState.connection = peer
            },
            leaveCall(){
                this.callState.callEnded = true;
                this.callState.connection = null;
            },
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
                this.currentConversation = conversation;
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
                        const msg = {
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
                        };
                        console.log(msg)
                        // this.messages.unshift(msg);

                        // this.conversations.forEach(conversation => {
                        //     if(conversation.id == this.currentParticipant.id){
                        //         conversation.last_msg.unshift(msg)
                        //     }
                        // })

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
    .call:hover{
        cursor: pointer;
    }



</style>
