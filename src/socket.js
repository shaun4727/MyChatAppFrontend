import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
  connected: false,
  id: null,
  fooEvents: [],
  barEvents: []
});

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:5000";

export const socket = io(URL);

socket.on("connect", () => {
    state.id = socket.id;
});

socket.on("disconnect", () => {
  state.connected = false;
});

socket.on("foo", (...args) => {
  state.fooEvents.push(args);
});

socket.on("bar", (...args) => {
  state.barEvents.push(args);
});