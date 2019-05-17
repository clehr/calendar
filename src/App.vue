<template>
    <div id="app" v-if="true">
        Passwort:
        <input type="password" v-model="typedPassword">

        <div v-if="typedPassword === firebasePassword">
            <div>
                <h1>Next Appointment?</h1>
                <h2>When?</h2><input type="text" v-model="whenContent">
                <h2>What?</h2><input type="text" v-model="whatContent">
                <h2>Where?</h2><input type="text" v-model="whereContent">

                <br>
                <button @click="storeAppointment">save</button>
            </div>

            <div v-bind:key="appointment.id" v-for="appointment in shownAppointments">

                <div v-if="appointment === currentEditedAppointment">
                    <input type="text" v-model="editedContent">
                    <a @click="cancelEditing" href="#"> cancel </a>
                    <a @click="updateAppointment" href="#"> update </a>
                </div>

                <div v-else>
                    {{appointment.originalContent}}
                    <span @click="edit(appointment)"> Edit </span>
                    <span @click="remove(appointment)"> X </span>
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
                originalContent: '',
                currentEditedAppointment: null,
                editedContent: '',
                whenContent: '',
                whatContent: '',
                whereContent: ''
            };
        },
        computed: {
            combinedContent: {
                get: function () {
                    return this.whenContent + ' ' + this.whatContent + ' ' + this.whereContent;
                },
            },
        },
        methods: {
            storeAppointment() {
                storedAppointments.push({originalContent: this.combinedContent});
                this.originalContent = '';
                this.whenContent = '';
                this.whereContent = '';
                this.whatContent = '';
            },
            remove(appointment) {
                storedAppointments.child(appointment.id).remove();
            },
            edit(appointment) {
                this.currentEditedAppointment = appointment;
                this.editedContent = appointment.originalContent;
            },
            cancelEditing() {
                this.currentEditedAppointment = null;
                this.editedContent = '';
            },
            updateAppointment() {
                storedAppointments.child(this.currentEditedAppointment.id).update({originalContent: this.editedContent});
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
                const updatedAppointment = this.shownAppointments.find(appointment => appointment.id === storedAppointment.key);
                updatedAppointment.originalContent = storedAppointment.val().originalContent
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
