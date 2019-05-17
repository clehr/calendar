<template>
    <div id="app" v-if="true">
        Passwort:
        <input type="password" v-model="password">

        <div v-for="entry in entries">{{entry.entry}}</div>

        <div>
            <textarea  v-model="entry" @keyup.enter="addEntry" />
        </div>

        <div v-if="password == 'test'">
            <h1>hidden section</h1>
        </div>
        <button @click="storeEntry">Save</button>
    </div>
</template>

<script>
    import {db} from './config/db';

    const storedEntries = db.ref('entries');

    export default {
        name: 'app',
        data: function () {
            return {
                password: '',
                entries: [],
                entry: ''
            };
        },
        methods: {
            storeEntry() {
                storedEntries.push({entry: this.entry});
                this.entry = '';
            }
        },
        created () {
            storedEntries.on('child_added', snapshot => this.entries.push(snapshot.val()))
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
