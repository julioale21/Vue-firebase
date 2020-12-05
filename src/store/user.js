import { auth, fb } from "../firebase";

const state = {
    user: null
}

const getters = {}

const mutations = {
    setUser(state, user) {
        state.user = user;
    }
}

const actions = {
    async doLoginAction({ commit }, { email, password }) {
        await auth.setPersistence(fb.auth.Auth.Persistence.SESSION);
        await auth.signInWithEmailAndPassword(email, password);
        commit('setUser', auth.currentUser);
    },
    async doRegisterAction ({ commit }, { name, email, password }) {
        await auth.setPersistence(fb.auth.Auth.Persistence.SESSION);
        await auth.createUserWithEmailAndPassword(email, password);
        const user = auth.currentUser;
        await user.updateProfile({
            displayName: name
        });
        commit('setUser', user);
    },
    async doLogoutAction({ commit }) {
        await auth.signOut();
        commit('setUser', null);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};