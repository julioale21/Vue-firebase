<template>
    <div>
        <article class="section">
            <div class="container">
                <div class="columns">
                    <div v-if="room" class="column is-half is-offset-one-quarter">
                        <h1 class="title has-text-centered">{{ room.name }}</h1>
                        <div class="messages content" ref="messages">
                            <div v-for="message in roomMessages" :key="message.id">
                                <MessageComponent 
                                    :message="message"
                                    @delete-message="deleteMessageAsync"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        <ControlBarComponent :isLoading="isLoading" @create-message="createMessage"/>
    </div>
    
</template>

<script>

import { mapState, mapActions } from "vuex";
import MessageComponent from '../components/MessageComponent';
import ControlBarComponent from '../components/ControlBarComponent';

export default {
    name: 'ViewRoom',
    components: {
        MessageComponent,
        ControlBarComponent
    },

    data() {
        return {
            audioURL: null,
            isLoading: false,
            photoURL: null,
            room: null,
            userUid: null, 
        }
    },

    props: {
        id: {
            type: String,
            required: true
        }
    },

    async created() {
        this.userUid = this.$store.state.user.user.uid;
        try {
            this.room = await this.$store.dispatch('rooms/getRoomAction', this.id);
            this.updateMetaAction({
                roomID: this.id,
                exit: false,
                uid: this.userUid
            });
        } catch (error) {
            console.error(error.message);
            this.$toast.error(error.message);
            this.$router.push({ name: 'rooms'});
        }
    },

    destroyed() {
        this.updateMetaAction({
            roomID: this.id,
            exit: true,
            uid: this.userUid
        });
    },

    computed: {
        ...mapState('messages', ['messages']),

        roomMessages() {
            return this.messages.filter(message => message.roomId === this.id);
        }
    },
    
    methods: {
        ...mapActions('messages', [
                'createMessageAction',
                'uploadMessageFile',
                'deleteFile',
                'deleteMessage']),

        ...mapActions('user', ['updateMetaAction']),

        ...mapActions('utils', ['requestConfirmation']),

        scrollDown() {
            const messages = this.$refs.messages;
            this.$nextTick(() => {
                const height = messages.scrollHeight;
                window.scrollTo({
                    top: height,
                    behavior: 'smooth'
                });
            });
        },

        async createMessage({message, photo, audio, filter}) {
            this.isLoading = true;
            try {
                if (photo) {
                    this.photoURL = await this.uploadMessageFile({
                        roomID: this.id,
                        file: photo,
                        type: 'photo'
                    });
                }

                if (audio) {
                    this.audioURL = await this.uploadMessageFile({
                        roomID: this.id,
                        file: audio,
                        type: 'audio'
                    })
                }

                await this.createMessageAction({
                    roomID: this.id,
                    message: message,
                    photo: this.photoURL,
                    audio: this.audioURL,
                    filter: filter
                });

                this.photoURL = this.audioURL = null;
                this.scrollDown();
            } catch (error) {
                console.error(error.message);
                this.$toast.error(error.message);
            } finally {
                this.isLoading = false;
            }
        },

        async deleteMessageAsync(messageID) {
            try {
                await this.requestConfirmation({
                    props: { message: 'Delete message?' },
                    component: 'ConfirmationModal'
                });

                const message = this.roomMessages.find(message => message.id === messageID);
                
                if (message.photo) {
                    await this.deleteFile(message.photo);
                }

                if (message.audio) {
                    await this.deleteFile(message.audio);
                }

                await this.deleteMessage({
                    roomID: this.id,
                    messageID
                });

                this.$toast.success('Message deleted');
            } catch (error) {
                console.error(error.message);
                this.$toast.error(error.message);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.messages {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    padding-bottom: 90px;
}
</style>