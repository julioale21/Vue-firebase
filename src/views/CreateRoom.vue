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

                        <div class="field">
                            <label class="label">Image</label>
                            <div class="control">
                                <div 
                                    class="room_image"
                                    :style="{
                                        'background-image': `url(${roomImage})`
                                    }"
                                >
                                    <a 
                                        href="#"
                                        v-if="image"
                                        @click.prevent="image = roomData.imageURL = null"
                                        class="is-pulled-right button is-small is-danger is-outlined"
                                    >X</a>
                                </div>
                                <div class="file">
                                    <label class="file-label">
                                        <input 
                                            type="file" 
                                            class="file-input"
                                            @change="onFileChange"
                                            ref="file"
                                        />
                                        <span class="file-cta">
                                            <span class="file-label">
                                                Choose a image
                                            </span>
                                        </span>
                                    </label>
                                </div>
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
            image: null,
            roomData: {
                name: '',
                description: '',
                imageURL: ''
            }
        }
    },
    computed: {
        roomImage() {
            return this.image
            ? URL.createObjectURL(this.image)
            : require('@/assets/img/default-image.jpg');
        }
    },
    methods: {
        ...mapActions('rooms', ['createRoomAction', 'getNewRoomId', 'uploadRoomImage']),

        onFileChange() {
            this.image = event.target.files[0];
            this.$refs.file.value = null;
        },

        async createRoom() {
            this.isLoading = true;

            try {
                const newRoom = await this.getNewRoomId();
                const roomID = newRoom.id;

                if(this.image) {
                    this.imageURL = await this.uploadRoomImage({
                        roomID,
                        file: this.image
                    });
                }

                await this.createRoomAction({
                    name: this.roomData.name,
                    description: this.roomData.description,
                    image: this.imageURL,
                    roomID
                })
                this.$toast.success('Room successfuly created');
                this.roomData.name = this.roomData.description = this.imageURL = '';
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

<style lang="scss" scoped>
.room_image {
    height: 20vmax;
    padding: 1rem;
    margin: 1rem 0;
    border: 1px solid;
    background-size: cover;
    background-position: center;
}
</style>