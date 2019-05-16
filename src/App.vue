<template>
    <div id="app" v-if="true">
        Gib dein Passwort ein:
        <input type="password" v-model="password">

        <div v-if="password == 'test'">
            <ul>
                <li>19.5.2019 <input/> um 9 Uhr im Hafestuder Weg 23</li>
                <li>14.5.2019 Treffen mit Steffi um 9 Uhr im Macumba</li>
                <li>20.11.2019 Geburtstag planen um 15:30-17:30 Uhr</li>
            </ul>
        </div>
        <button @click="addCoin">Add coin</button>
    </div>
</template>

<script>
    import { db } from './config/db';

    export default {
        name: 'app',
        data: function () {
            return {
                password: ''
            };
        },
        firebase: {
            coins: db.ref('coins')
        },
        methods: {
        addCoin() {
            this.$firebaseRefs.coins.push({
                name: 'test'
            })
            alert("Succeessfully added")
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
