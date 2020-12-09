<template>
  <div class="section">
    <div class="container">
      <h1 class="title has-text-centered">Rooms</h1>
      <rooms-component :rooms="rooms"/>      
    </div>
  </div>
</template>

<script>
//import RoomsComponent from '../components/RoomsComponent.vue';
const RoomsComponent = () => import('../components/RoomsComponent.vue');

import { mapState } from "vuex";
import { db } from '../firebase';

export default {
    
  name: 'RoomsView',
  components: { 
    RoomsComponent 
  },
  computed: {
    ...mapState('rooms', ['rooms']),
  }
}
</script>
