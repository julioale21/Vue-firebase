<template>
  <div class="section">
    <div class="container">
      <h1 class="title has-text-centered">Rooms</h1>
      <rooms-component :rooms="roomsByDate" :unreadMessages="unreadMessages"/>      
    </div>
  </div>
</template>

<script>
//import RoomsComponent from '../components/RoomsComponent.vue';
const RoomsComponent = () => import('../components/RoomsComponent.vue');

import { mapState, mapGetters } from "vuex";
import { db } from '../firebase';

export default {
    
  name: 'RoomsView',
  components: { 
    RoomsComponent 
  },
  computed: {
    ...mapGetters('rooms', ['roomsByDate']),
    ...mapState('rooms', ['rooms']),
    ...mapState('messages', ['messages']),
    ...mapState('user', ['meta']),
    unreadMessages() {
      return this.messages.filter(message => {
        return (
          // User participated
          this.meta.joined[message.roomId] &&
          // Message sent after user last connection
          this.meta.joined[message.roomId] < message.createdAt
        );
      });
    }
  }
}
</script>
