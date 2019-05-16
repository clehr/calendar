<template>
    <div id="app" v-if="true">
        Passwort:
        <input type="password" v-model="password">

        <div v-bind:key="entry" v-for="entry in entries">{{entry}}</div>

        <div>
            <textarea  v-model="entry" @keyup.enter="addEntry" />
        </div>

        <div v-if="password == 'test'">
            hidden section
        </div>
        <button @click="saveEntries">Save</button>
    </div>
</template>

<script>
    import {db} from './config/db';
    import * as firebase from "firebase";

    const database = firebase.database();

    export default {
        name: 'app',
        firebase: {
            entries: db.ref('entries'),
            firebasepassword: db.ref('firebasepassword')
        },
        data: function () {
            return {
                password: '',
                entries: [],
                entry: ''
            };
        },
        methods: {
            saveEntries() {
                this.$firebaseRefs.entries.push({
                    entries: this.entries
                });
            },
            addEntry() {
                this.entries.push(this.entry);
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
