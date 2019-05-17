<template>
    <div id="app" v-if="true">
        Passwort:
        <input type="password" v-model="typedPassword">

        <div v-if="typedPassword === firebasePassword">
            <div>
                <h1>Next Appointment?</h1>
                <textarea v-model="content" @keyup.enter="storeAppointment"/>
                <button @click="storeAppointment">Save</button>
            </div>

            <div v-for="appointment in shownAppointments">

                <div v-if="appointment === editingAppointment">
                    <input type="text" :value="appointment.content">
                </div>

                <div v-else>
                    {{appointment.content}}
                </div>

                <div v-if="appointment !== editingAppointment">
                    <span @click="editAppointment(appointment)">   Edit   </span>
                    <span @click="removeAppointment(appointment)">X</span>
                </div>

                <div v-else>
                    <a @click="cancelEditing" href="#">cancel</a>
                    <a @click="updateAppointment" href="#">update</a>
                </div>

            </div>
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
                content: '',
                editingAppointment: null
            };
        },
        methods: {
            storeAppointment() {
                storedAppointments.push({content: this.content});
                this.content = '';
            },
            removeAppointment(appointment) {
                storedAppointments.child(appointment.id).remove();
            },
            editAppointment(appointment) {
                this.editingAppointment = appointment;
                this.appointmentContent = appointment.content;
            },
            cancelEditing() {
                this.editingAppointment = null;
                this.appointmentContent = '';
            },
            updateAppointment() {
                storedAppointments.child(this.editingAppointment.id).update({content: this.appointmentContent});
                this.cancelEditing();
            }
        },
        created() {
            storedAppointments.on('child_added', storedAppointment => this.shownAppointments.push({
                ...storedAppointment.val(),
                id: storedAppointment.key
            }));
            storedAppointments.on('child_removed', storedAppointment => {
                const appointmentToDelete = this.shownAppointments.find(appointment => appointment.id === storedAppointment.key);
                const index = this.shownAppointments.indexOf(appointmentToDelete);
                this.shownAppointments.splice(index, 1);
            });
            storedAppointments.on('child_changed', storedAppointment => {
                const updatedAppointment = this.shownAppointments.find(appointment => appointment.id === storedAppointment.key)
                updatedAppointment.text = storedAppointment.val().text
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
