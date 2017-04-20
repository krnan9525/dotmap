<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>DotMap</h2>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
    </div>
    </div>
        <div class="col-xs-12" id="map_view">
    </div>
</template>

<script>
    var map;
    export default {
        data() {
            return {
                // We need to initialize the component with any
                // properties that will be used in it
                credentials: {
                    username: '',
                    password: ''
                },
                error: ''
            }
        },
        methods: {

        },
        ready: function () {
            map = L.map('map_view').setView([51.505, -0.09], 13);
            L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19
            }).addTo(map);
        }
    }
</script>