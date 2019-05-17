<template>
    <div id="app" v-if="true">
        <font-awesome-icon class="margin-left-and-right" icon="user-secret"></font-awesome-icon>
        <input type="password" v-model="typedPassword">

        <div v-if="typedPassword === firebasePassword">
            <hr/>
            <div>
                <h1>Next Appointment?</h1>
                <h2>When?</h2><input id="datepicker" type="datetime-local" v-model="whenContent">
                <h2>What?</h2><input type="text" v-model="whatContent">
                <h2>Where?</h2><input type="text" v-model="whereContent">

                <br>
                <button @click="storeAppointment">save</button>
            </div>
            <hr/>

            <h1>Upcoming Events</h1>

            <div v-bind:key="appointment.id" v-for="appointment in shownAppointments">

                <div v-if="appointment === currentEditedAppointment">
                    <textarea v-model="editedContent" />
                    <font-awesome-icon class="margin-left-and-right" @click="cancelEditing" icon="ban"></font-awesome-icon>
                    <font-awesome-icon @click="updateAppointment" icon="save"></font-awesome-icon>
                    <div v-html="locationLinkFor(appointment)"></div>
                </div>

                <div v-else>
                    {{appointment.originalContent}}
                    <font-awesome-icon class="margin-left-and-right" @click="edit(appointment)" icon="edit"></font-awesome-icon>
                    <font-awesome-icon @click="remove(appointment)" icon="trash-alt"></font-awesome-icon>
                    <div v-html="locationLinkFor(appointment)"></div>
                </div>
                <hr/>
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
                whereContent: '',
            };
        },
        computed: {
            combinedContent: {
                get: function () {
                    let date = this.whenContent.split("T")[0];
                    date = date.split("-").reverse().join(".");
                    let time = this.whenContent.split("T")[1];
                    let formattedDateTime = date.concat(", ").concat(time).concat("h");
                    return formattedDateTime + ': ' + this.whatContent + ' at ' + this.whereContent;
                },
            }
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
            },
            locationLinkFor(appointment) {
                let locationForGoogleMaps = appointment.originalContent.split("at")[1];
                let googleMapsLink = `<a href="http://maps.google.com/maps?saddr=My+Location&daddr=${locationForGoogleMaps}" target=_blank><button>Travel</button></a>`;
                return googleMapsLink;
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
        border-style: solid;
        border-width: 1px;
        width: 30%;
        margin: auto auto;
        padding: 2% 10%;
    }
    .margin-left-and-right {
        margin-left: 10px;
        margin-right: 10px;
    }
</style>
