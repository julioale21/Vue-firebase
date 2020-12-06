<template>
<article class="section">
    <div class="container">
        <div class="columns">
            <div class="column is-half is-offset-one-quarter">
                <h1 class="title has-text-centered">Profile</h1>

                <!-- User Profile form -->
                <form v-if="user" @submit.prevent="updateProfile">
                    <div class="field">
                        <label class="label">Name</label>
                        <p class="control has-icons-left">
                            <input
                                :placeholder="user.displayName"
                                v-model="userData.name"
                                type="text" 
                                class="input"
                            >
                            <span class="icon is-small is-left">
                                <i class="fas fa-user"></i>
                            </span>
                        </p>
                    </div>

                    <div class="field">
                        <label class="label">Email</label>
                        <p class="control has-icons-left">
                            <input 
                                :placeholder="user.email"
                                v-model="userData.email"
                                type="email" 
                                class="input"
                            >
                            <span class="icon is-small is-left">
                                <i class="fas fa-envelope"></i>
                            </span>
                        </p>
                    </div>

                    <div class="field">
                        <label class="label">Password</label>
                        <p class="control has-icons-left">
                            <input 
                                v-model="userData.password"
                                type="password" 
                                class="input"
                            >
                            <span class="icon is-small is-left">
                            <i class="fas fa-lock"></i>
                            </span>
                        </p>
                    </div>

                    <div class="field has-text-right">
                        <div class="control">
                            <button 
                                class="button is-primary"
                                type="submit"
                                :disabled="!hasDataChanged"
                                :class="{ 'is-loading': isLoading }"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </form>
                <!-- End User porfile form -->
            </div>
        </div>
    </div>
</article>
  
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
    name: 'UserProfileView',
    data() {
        return {
            isLoading: false,
            userData: {
                name: '',
                email: '',
                password: ''
            }
        }
    },
    methods: {
        ...mapActions('user', ['updateProfileAction']),
        async updateProfile() {
            this.isLoading = true;

            try {
                await this.updateProfileAction({
                    name: this.userData.name,
                    email: this.userData.email,
                    password: this.userData.password
                });
                this.$toast.success('Account data updated');
                this.userData.name = this.userData.email = this.userData.password = ''
            } catch (error) {
                this.$toast.error(error.message);
                console.log(error);
            } finally {
                this.isLoading = false;
            }

        }
    },
    computed: {
        ...mapState('user', ['user']),
        hasDataChanged() {
            return (
                (this.userData.name && this.userData.name !== this.user.dispayName) ||
                (this.userData.email && this.userData.email !== this.user.email) ||
                this.userData.password.length
            );
        }
    }
}
</script>
