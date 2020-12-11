import { db } from '../firebase';

const state = {
    messages: [],
    messagesListener: () => {},
}

const mutations = {
    setMessages(state, messages) {
        state.messages = messages;
    },
    setMessagesListener(state, listener) {
        if (listener) {
            state.messagesListener = listener;
        } else {
            state.messagesListener();
        }
    }
}

const actions = {
    async getMessagesAction ({ commit }) {
        const query = db
            .collectionGroup('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(doSnapshot);

        commit('setMessagesListener', query);
        
        function doSnapshot(querySnapshot) {
            const messages = [];

            querySnapshot.forEach(doc => {
                let message = doc.data();
                message.id = doc.id;
                messages.unshift(message);
            });

            commit('setMessages', messages);
        }
    },
    async createMessageAction({ rootState }, { roomID, message }) {
        await db.collection('rooms').doc(roomID).collection('messages').add({
            userId: rootState.user.user.uid,
            userName: rootState.user.user.displayName,
            roomId: roomID,
            message,
            createdAt: Date.now()
        })
    }
}

const getters = {}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};