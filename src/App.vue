<template>
    <div id="app" v-if="true">
        Passwort:
        <input type="password" v-model="typedPassword">

        <div>
            <h1>Next Appointment?</h1>
            <textarea v-model="content" @keyup.enter="storeAppointment"/>
            <button @click="storeAppointment">Save</button>
        </div>

        <div v-if="typedPassword === firebasePassword">
            <div v-for="appointment in shownAppointments">{{appointment.content}} <span>   Edit   </span> <span @click="removeAppointment(appointment)">X</span></div>
        </div>
    </div>
</template>

<script>
    import {db} from './config/db';

    const storedAppointments = db.ref('shownAppointments');

    export default {
        name: 'app',
        data: function () {
            return {
                typedPassword: '',
                firebasePassword: {},
                shownAppointments: [],
                content: ''
            };
        },
        methods: {
            storeAppointment() {
                storedAppointments.push({content: this.content});
                this.content = '';
            },
            removeAppointment(appointment) {
                storedAppointments.child(appointment.id).remove();
            }
        },
        created() {
            storedAppointments.on('child_added', storedAppointment => this.shownAppointments.push({...storedAppointment.val(), id: storedAppointment.key}));
            storedAppointments.on('child_removed', storedAppointment => {
                const appointmentToDelete = this.shownAppointments.find(appointment => appointment.id === storedAppointment.key);
                const index = this.shownAppointments.indexOf(appointmentToDelete);
                this.shownAppointments.splice(index, 1);
            });

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
