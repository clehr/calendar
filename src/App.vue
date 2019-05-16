<template>
    <div id="app" v-if="true">
        Gib dein Passwort ein:
        <input type="password" v-model="password">
        {{this.firebasepassword}}

        <div v-if="password == 'test'">
            <ul>
                <li><input></li>
                <li><input></li>
                <li><input></li>
            </ul>
        </div>
        <button @click="savePassword">Save</button>
    </div>
</template>

<script>
    import {db} from './config/db';

    export default {
        name: 'app',
        firebase: {
            entries: db.ref('entries'),
            firebasepassword: db.ref('firebasepassword')
        },
        data: function () {
            return {
                password: ''
            };
        },
        methods: {
            savePassword() {
                this.$firebaseRefs.firebasepassword.push({
                    firebasepassword: this.password
                });
            }

        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
