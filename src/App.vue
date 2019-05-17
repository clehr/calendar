<template>
    <div id="app" v-if="true">
        Passwort:
        <input type="password" v-model="password">

        <div v-for="singleEntry in appointmentEntries">{{singleEntry.content}}</div>

        <div>
            <textarea v-model="content" @keyup.enter="addEntry" />
        </div>

        <div v-if="password == 'test'">
            <h1>hidden section</h1>
        </div>
        <button @click="storeEntry">Save</button>
    </div>
</template>

<script>
    import {db} from './config/db';

    const storedEntries = db.ref('appointmentEntries');

    export default {
        name: 'app',
        data: function () {
            return {
                password: '',
                appointmentEntries: [],
                content: ''
            };
        },
        methods: {
            storeEntry() {
                storedEntries.push({content: this.content});
                this.content = '';
            }
        },
        created () {
            storedEntries.on('child_added', appointmentEntry => this.appointmentEntries.push(appointmentEntry.val()))
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
