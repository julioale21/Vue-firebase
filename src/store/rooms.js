import { db } from "../firebase";

const state = {
    rooms: [],
    roomsListener: () => {}
}

const mutations = {
    setRoomsListener(state, listener) {
        if (listener) {
            state.roomsListener = listener;
        } else {
            state.roomsListener();
        }
    },
    setRooms(state, rooms) {
        state.rooms = rooms;
    },
    createRoom(state, { roomData, id }) {
        roomData.id = id;
        state.rooms.unshift(roomData);
    },
    updateRoom(state, { index, roomData, id}) {
        roomData.id = id;
        state.rooms[index] = roomData;
    },
    removeRoom(state, index) {
        state.rooms.splice(index, 1);
    }
}

const actions = {
    async createRoomAction({ rootState }, { name, description }) {
        await db.collection('rooms').add({
            name,
            description,
            createdAt: Date.now(),
            adminUid: rootState.user.user.uid,
            adminName: rootState.user.user.displayName
        })
    },
    async getRoomsAction({ commit }) {
        const query = db.collection('rooms')
            .orderBy('createdAt', 'desc')
            .onSnapshot(doSnapshot);
        
        commit('setRoomsListener', query);

        function doSnapshot(querySnapshot) {
            commit('setLoading', true, { root: true});

            querySnapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    commit('createRoom', {
                        roomData: change.doc.data(),
                        id: change.doc.id
                    });
                }

                if (change.type === 'modified') {
                    commit('updateRoom', {
                        index: change.newIndex,
                        roomData: change.doc.data(),
                        id: change.doc.id
                    });
                } 

                if (change.type=== 'removed') {
                    commit('removeRoom',change.oldIndex);
                }
            });

            commit('setLoading', false, { root: true });

        }
    },
    async getRoomAction({ getters }, roomID) {
        let room = getters['getRoom'](roomID);

        if (!room) {
            room = await db
                .collection('rooms')
                .doc(roomID)
                .get();

            if (!room.exists) throw new Error('Could not find room');
            room = room.data();
        }

        return room;
    },
    async updateRoomAction(context, { roomID, name, description }) {
        const roomData = {};

        if (name) roomData.name = name;

        if (description) roomData.description = description;

        await db
            .collection('rooms')
            .doc(roomID)
            .update(roomData);
    }
}

const getters = {
    getRoom: state => id => {
        return state.rooms.find(room => room.id === id);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};