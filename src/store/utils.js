import Vue from 'vue';

const actions = {
    requestConfirmation(context, { props, component }) {
        const Component = () => import(`../components/${component}Component`);
        return new Promise((resolve, reject) => {
            const dialog = new Vue({
                methods: {
                    actionHandle(fn, arg) {
                        return function() {
                            fn(arg);
                            dialog.$destroy();
                            dialog.$el.remove();
                        };
                    }
                },
                render(h) {
                    return h(Component, {
                        props,
                        on: {
                            confirm: data => {
                                this.actionHandle(resolve, data)();
                            },
                            cancel: this.actionHandle(reject, new Error('Action cancelled'))
                        }
                    });
                }
            }).$mount();
            document.getElementById('app').appendChild(dialog.$el);
        });
    }
}

export default {
    namespaced: true,
    actions
};