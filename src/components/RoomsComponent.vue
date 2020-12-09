<template>
    <div v-if="!isLoading">
        <h1 v-if="!rooms.length" class="subtitle has-text-centered mt-2">
            No rooms available
            <router-link :to="{name: 'createRoom'}">Create one</router-link>
        </h1> 
        <div v-else class="columns is-multiline">
            <div v-for="room in rooms" :key="room.id" class="column is-one-third">
                <router-link :to="{ name: 'view', params: { id: room.id }}">
                    <div class="card">
                        <div class="card-image">
                            <figure class="image is-16by9">
                                <img 
                                src="https://bulma.io/images/placeholders/1280x960.png" 
                                alt="Placeholder image"
                                />
                            </figure>
                        </div>

                        <div class="card-content">
                            <div class="media">
                                <div class="media-content">
                                    <p class="title is-4">{{ room.name }}</p>
                                    <p class="subtitle is-6">By {{ room.adminName }}</p>
                                </div>
                            </div>
                            <div class="content">
                                {{ room.description }}
                            </div>
                            <nav class="buttons is-right">
                                <router-link 
                                    :to="{ name: 'update',  params: { id: room.id }}"
                                    class="button is-small"
                                    v-if="room.adminUid === $store.getters['user/getUserUid']"
                                >
                                    Edit
                                </router-link>
                            </nav>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: 'RoomsComponent',
    props: {
        rooms: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapState(['isLoading']),
    }
}
</script>

<style>

</style>