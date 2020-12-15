import { db, storage } from '../firebase';

const state = {
    messages: [],
    messagesListener: () => {},
    filters: [
        { name: "normal" },
        { name: "clarendon" },
        { name: "gingham" },
        { name: "moon" },
        { name: "lark" },
        { name: "reyes" },
        { name: "juno" },
        { name: "slumber" },
        { name: "aden" },
        { name: "perpetua" },
        { name: "mayfair" },
        { name: "rise" },
        { name: "hudson" },
        { name: "valencia" },
        { name: "xpro2" },
        { name: "willow" },
        { name: "lofi" },
        { name: "inkwell" },
        { name: "nashville" }
    ]
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

    async createMessageAction({ rootState }, { roomID, message, audio, photo, filter }) {
        await db.collection('rooms').doc(roomID).collection('messages').add({
            userId: rootState.user.user.uid,
            userName: rootState.user.user.displayName,
            roomId: roomID,
            message,
            audio,
            photo,
            filter,
            createdAt: Date.now()
        })
    },

    async uploadMessageFile({rootGetters}, { roomID, file, type }) {
        const timestamp = Date.now();
        const userUID = rootGetters['user/getUserUid'];

        const extension = type === 'photo' ? 'jpg' : 'wav';
        const uploadPhoto = () => {
            let fileName = `rooms/${roomID}/messages/${userUID}-${timestamp}.${extension}`;
            return storage.ref(fileName).put(file);
        }

        function getDownloadURL(ref) {
            return ref.getDownloadURL();
        }

        try {
            let upload = await uploadPhoto();
            return await getDownloadURL(upload.ref);
        } catch (error) {
            throw Error(error);
        }
    },

    async deleteFile(context, file) {
        const fileRef = storage.refFromURL(file);
        await fileRef.delete();
    },

    async deleteMessage(context, {roomID, messageID}) {
        await db
            .collection('rooms')
            .doc(roomID)
            .collection('messages')
            .doc(messageID)
            .delete();
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