<template>
    <article class="section">
        <div class="container">
            <div class="columns">
                <div class="column is-half is-offset-one-quarter">
                    <h1 class="title has-text-centered">Create Room</h1>
                    <form @submit.prevent="createRoom">
                        <div class="field">
                            <label class="label">Name</label>
                            <div class="control">
                                <input 
                                    v-model="roomData.name"
                                    type="text" 
                                    class="input"
                                    placeholder="e.g. Black Cat mania 😼"
                                    required
                                >
                            </div>
                        </div>

                        <div class="field">
                            <label class="label">Description</label>
                            <div class="control">
                                <textarea 
                                    v-model="roomData.description"
                                    class="textarea"
                                    placeholder="e.g. Let's talk about why Black Cat's are fucking awsome"
                                    required
                                ></textarea>
                            </div>
                        </div>

                        <div class="field has-text-right">
                            <div class="control">
                                <button 
                                    type="submit"
                                    class="button is-primary"
                                    :class="{ 'is-loading': isLoading }"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </article>
</template>

<script>

import { mapActions } from "vuex";

export default {
    name: 'CreateRomm',
    data() {
        return {
            isLoading: false,
            roomData: {
                name: '',
                description: ''
            }
        }
    },
    methods: {
        ...mapActions('rooms', ['createRoomAction']),
        async createRoom() {
            this.isLoading = true;

            try {
                await this.createRoomAction({
                    name: this.roomData.name,
                    description: this.roomData.description
                })
                this.$toast.success('Room successfuly created');
                this.roomData.name = this.roomData.description = '';
                setTimeout(() => {
                    this.$router.push({ name: 'rooms'})
                }, 1000);
            } catch (error) {
                console.error(error.message);
                this.$toast.error(error.message);
            } finally {
                this.isLoading = false
            }
        }
    }
}
</script>

<style>

</style>