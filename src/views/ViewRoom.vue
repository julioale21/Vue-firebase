<template>
    <div>
        <article class="section">
            <div class="container">
                <div class="columns">
                    <div v-if="room" class="column is-half is-offset-one-quarter">
                        <h1 class="title has-text-centered">{{ room.name }}</h1>
                        <div class="messages content" ref="messages">
                            <div 
                                v-for="message in roomMessages"
                                :key="message.id"
                                class="message"
                                :class="{
                                    'message--own' :
                                        message.userId === $store.getters['user/getUserUid']
                                }"
                            >

                                <div 
                                    v-if="message.photo"
                                    class="message_photo"
                                    :class="message.filter"
                                    :style="{ 'background-image': `url(${message.photo})`}"
                                ></div>

                                <div v-if="message.audio" class="message_audio">
                                    <audio :src="message.audio" controls>y</audio>
                                </div>

                                <p class="has-text-left">
                                    {{ message.message }}
                                    <span 
                                        v-if="message.userId !== $store.getters['user/getUserUid']"
                                    >   
                                        <br>
                                        <small class="message__time">
                                            <i >{{ message.userName }} - {{ message.createdAt | timeAgo }} ago</i>
                                        </small>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        <section class="send">
            <form @submit.prevent="createMessage" class="form">
                <div class="control">
                    <textarea
                        v-model="message"
                        class="textarea form__textarea"
                        placeholder="Write your message here..."
                    ></textarea>
                </div>

                <div 
                    v-if="photo"
                    @click="photo = null"
                    class="photo-preview"
                    :style="{ 'background-image': `url(${messagePhoto})`}"
                ></div>

                <div v-if="audio" class="audio-preview">
                    <a href="#" @click="audio = null" class="close">X</a>
                    <audio :src="messageAudio" controls></audio>
                </div>

                <div class="control">
                    <button 
                        @click="recordAudio"
                        :disabled="isLoading"
                        type="button"
                        class="button mr-1"
                    >
                        <i class="fas fa-microphone-alt"></i>
                    </button>
                </div>

                <div class="control">
                    <button 
                        @click="$refs.file.click()"
                        :disabled="isLoading"
                        class="button mr-1"
                        type="button"
                    >
                        <i class="fas fa-camera"></i>
                    </button>

                    <input 
                        @change="onFileChange"
                        ref="file"
                        type="file" 
                        class="inputFile"
                        style="display: none !important;"
                    >
                </div>

                <div class="control">
                    <button
                        :disabled="!message && !photo"
                        type="submit"
                        class="button is-info"
                        :class="{ 'is-loading': isLoading }"
                    >
                        Send
                    </button>
                </div>
            </form>
        </section>
    </div>
    
</template>

<script>

import { mapState, mapActions } from "vuex";
const dayjs = require('dayjs');
var relativeTime = require('dayjs/plugin/relativeTime');
dayjs.extend(relativeTime);

export default {
    name: 'ViewRoom',

    data() {
        return {
            audio: null,
            audioURL: null,
            filter: null,
            isLoading: false,
            photo: null,
            photoURL: null,
            message: '',
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
        },

        messagePhoto() {
            return URL.createObjectURL(this.photo);
        },

        messageAudio() {
            return URL.createObjectURL(this.audio);
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

        async createMessage() {
            this.isLoading = true;
            try {
                if (this.photo) {
                    this.photoURL = await this.uploadMessageFile({
                        roomID: this.id,
                        file: this.photo,
                        type: 'photo'
                    });
                }

                if (this.audio) {
                    this.audioURL = await this.uploadMessageFile({
                        roomID: this.id,
                        file: this.audio,
                        type: 'audio'
                    })
                }

                await this.createMessageAction({
                    roomID: this.id,
                    message: this.message,
                    photo: this.photoURL,
                    audio: this.audioURL,
                    filter: this.filter
                });
                this.message ='';
                this.photo = this.photoURL = this.audio = this.audioURL = this.filter = null;
                this.scrollDown();
            } catch (error) {
                console.error(error.message);
                this.$toast.error(error.message);
            } finally {
                this.isLoading = false;
            }
        },

        async onFileChange(event) {
            this.photo = event.target.files[0];
            this.$refs.file.value = null;

            try {
                this.filter = await this.$store.dispatch('utils/requestConfirmation',{
                    props: {
                        message: 'Select your filter',
                        file: this.messagePhoto,
                        filters: this.$store.state.messages.filters
                    },
                    component: 'FilterModal'
                });
            } catch (error) {
                console.error(error.message);
                this.$toast.error(error.message);
            }
        },

        async recordAudio() {
            try {
                this.audio = await this.$store.dispatch('utils/requestConfirmation', {
                   props: {
                       message: 'Record your message'
                   },
                   component: 'RecordModal'
                })
            } catch (error) {
                this.$toast.error(error.message);
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

            } catch (error) {
                console.error(error.message);
                this.$toast.error(error.message);
            }
        }
    },
    filters: {
        timeAgo(timestamp) {
            const date = new Date(timestamp);
            return dayjs().from(dayjs(date), true);
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

.message {
    padding: 1rem;
    width: 75%;
    &--own {
        background-color: #baffc5;
        width: 75%;
        align-self: flex-end;
    }
    &__time {
        color: gray;
        font-size: 12px;
    }
    &_photo {
        height: 20vmax;
        background-size: cover;
        background-position: center;
    }
}

.send {
  background-color: gray;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}

.audio-preview {
    margin-right: 1rem;
    cursor: pointer;
    position: relative;
    .close {
        position: absolute;
        top: 0;
        right: 0;
        padding: 1rem;
        font-weight: bold;
        background-color:black;
        color: white;
        text-decoration: none;
        z-index: 1;
    }
}

.photo-preview {
    width: 5rem;
    height: 5rem;
    border: 1px solid;
    background-position: center;
    background-size: cover;
    margin-right: 1rem;
    border-radius: 1rem;
    cursor: pointer;
}

.form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    & > *:first-child {
        flex-grow: 1;
        margin-right: 1rem;
    }
}

.textarea.form__textarea {
    min-height: 4rem;
}
</style>