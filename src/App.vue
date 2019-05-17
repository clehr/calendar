<template>
    <div id="app" v-if="true">
        Passwort:
        <input v-model="typedPassword">

        <div v-for="appointment in appointments">{{appointment.content}}</div>

        <div>
            <textarea v-model="content" @keyup.enter="storeAppointment"/>
        </div>

        <div v-if="typedPassword === firebasePassword">
            <h1>hidden section</h1>
        </div>
        <button @click="storeAppointment">Save</button>
    </div>
</template>

<script>
    import {db} from './config/db';

    const storedAppointments = db.ref('appointments');

    export default {
        name: 'app',
        data: function () {
            return {
                typedPassword: '',
                firebasePassword: {},
                appointments: [],
                content: ''
            };
        },
        methods: {
            storeAppointment() {
                storedAppointments.push({content: this.content});
                this.content = '';
            }
        },
        created() {
            storedAppointments.on('child_added', appointment => this.appointments.push(appointment.val())),
                db.ref('password').once('value', storedPassword => this.firebasePassword = JSON.stringify(storedPassword));
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
