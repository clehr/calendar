<template>
    <div id="app" v-if="true">
        <font-awesome-icon class="margin-left-and-right" icon="user-secret"></font-awesome-icon>
        <input type="password" v-model="typedPassword">

        <div v-if="typedPassword === firebasePassword">
            <hr/>
            <div>
                <h2>Enter your Next Appointment</h2>
                <h3>When?</h3><input id="datepicker" type="datetime-local" v-model="whenContent">
                <font-awesome-icon class="margin-left-and-right grow" icon="history"
                                   @click="resetDateTime"></font-awesome-icon>

                <h3>What?</h3><input type="text" v-model="whatContent">
                <h3>Where?</h3><input type="text" v-model="whereContent">

                <br><br>
                <button class="grow" @click="storeAppointment">save</button>
            </div>
            <hr/>

            <h2>Upcoming Events:</h2>

            <div v-bind:key="appointment.id" v-for="appointment in appointmentsSortedByDate">

                <b>{{appointment.title}}</b>
                <font-awesome-icon v-if="isSoon(appointment)" class="margin-left-and-right red" icon="exclamation"></font-awesome-icon>
                <font-awesome-icon v-if="isPast(appointment)" class="margin-left-and-right lightblue" icon="hourglass-end"></font-awesome-icon>

                <div v-if="appointment === currentEditedAppointment">
                    <input v-model="editedTitle"/>
                    <textarea v-model="editedContent"/>
                    <font-awesome-icon class="margin-left-and-right grow" @click="cancelEditing"
                                       icon="ban"></font-awesome-icon>
                    <font-awesome-icon @click="updateAppointment" icon="save" class="grow"></font-awesome-icon>
                    <div v-html="locationLinkFor(appointment)"></div>
                </div>

                <div v-else>
                    {{appointment.originalContent}}
                    <font-awesome-icon class="margin-left-and-right grow" @click="edit(appointment)"
                                       icon="edit"></font-awesome-icon>
                    <font-awesome-icon @click="remove(appointment)" icon="trash-alt" class="grow"></font-awesome-icon>
                    <div v-html="locationLinkFor(appointment)"></div>
                </div>
                <hr/>
            </div>
        </div>
    </div>
</template>

<script>
    import {db} from './config/db';
    import moment from "moment";

    const storedAppointments = db.ref('shownAppointments');

    export default {
        name: 'app',
        data: function () {
            return {
                typedPassword: '',
                firebasePassword: {},
                shownAppointments: [],
                originalContent: '',
                title: '',
                editedTitle: '',
                currentEditedAppointment: null,
                editedContent: '',
                whenContent: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
                whatContent: '',
                whereContent: '',
            };
        },
        computed: {
            combinedContent: {
                get: function () {
                    let date = moment(this.whenContent).locale("de");
                    return date.calendar() +' - ' + this.whereContent + ' (' + date.fromNow() + ')';
                },
            },
            appointmentsSortedByDate: {
                get: function () {
                    //it is not possible to directly return the sort function it has to be called first
                    //and after that the list can be returned normally
                    this.sort(this.shownAppointments);
                    return this.shownAppointments;
                }
            }
        },
        methods: {
            storeAppointment() {
                storedAppointments.push({title: this.whatContent, originalContent: this.combinedContent, date: this.whenContent});
                this.originalContent = '';
                this.title = '';
                this.whenContent = moment().format(moment.HTML5_FMT.DATETIME_LOCAL);
                this.whereContent = '';
                this.whatContent = '';
            },
            remove(appointment) {
                storedAppointments.child(appointment.id).remove();
            },
            edit(appointment) {
                this.currentEditedAppointment = appointment;
                this.editedContent = appointment.originalContent;
                this.editedTitle = appointment.title;
            },
            cancelEditing() {
                this.currentEditedAppointment = null;
                this.editedContent = '';
                this.editedTitle = '';
            },
            updateAppointment() {
                storedAppointments.child(this.currentEditedAppointment.id).update({title: this.editedTitle, originalContent: this.editedContent});
                this.cancelEditing();
            },
            locationLinkFor(appointment) {
                let locationForGoogleMaps = appointment.originalContent.split("-")[1].split("(")[0];
                let googleMapsLink = `<a href="http://maps.google.com/maps?saddr=My+Location&daddr=${locationForGoogleMaps}" target=_blank><button class="grow">Travel</button></a>`;
                return googleMapsLink;
            },
            sort(appointments) {
                appointments.sort(this.compare)
            },
            compare(appointmentA, appointmentB) {
                let dateA = appointmentA.date;
                let dateB = appointmentB.date;

                if (dateA < dateB) {
                    return -1;
                }
                if (dateA > dateB) {
                    return 1;
                }
                return 0;
            },
            resetDateTime() {
                this.whenContent = moment().format(moment.HTML5_FMT.DATETIME_LOCAL);
            },
            isSoon(appointment) {
                let now = new moment();
                let dateOfAppointment = new moment(appointment.date);
                let diff = moment.duration(dateOfAppointment.diff(now)).minutes();
                return diff < 480 && diff > 0;
            },
            isPast(appointment) {
                let now = new moment();
                let dateOfAppointment = new moment(appointment.date);
                let isSoon = moment.duration(dateOfAppointment.diff(now)).minutes() <= 0;
                return isSoon;
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
                updatedAppointment.originalContent = storedAppointment.val().originalContent;
                updatedAppointment.title = storedAppointment.val().title;
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

    .red {
        color: red;
    }

    .lightblue {
        color: lightblue;
    }

    @media (max-width: 500px) {
        #app {
            width: 70%;
        }
    }

    .grow {
        transition: transform 0.2s ease-in-out;
    }
    .grow:hover {
        /*  Making button bigger on hover  */
        transform: scale(1.6) perspective(1px);
    }
</style>
