<template>
  <div class="home">
      <div class="section">
        <div class="container">
          <template v-if="!user">
            <h1>Home</h1>
            <button 
              class="button is-primary"
              @click="loginWithGoogle"
            >Login with Google</button>  
          </template>
          <template v-else>
            <h1>Hi {{user.displayName}}</h1>
            <button
              class="button is-primary"
              @click="logout"
            >Logout</button>
          </template>
        </div>
      </div>
  </div>
</template>

<script>

import {fb, auth} from '../firebase';

export default {
  name: 'RoomsView',
  data() {
    return {
      user: null
    }
  },
  methods: {
    async loginWithGoogle() {
      try {
        var provider = new fb.auth.GoogleAuthProvider();
        const { user } = await auth.signInWithPopup(provider);
        this.user = user;
      } catch (error) {
        console.log(error.message)
      } 
    },
    async logout() {
      try {
        await auth.signOut();
        this.user = null;
      } catch (error) {
        console.log(error);
      }
    }
  },
}
</script>
