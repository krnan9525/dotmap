<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="col-sm-4 col-sm-offset-4">
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
    </div>
    <div class="col-xs-12" id="map_view"></div>
    <button id="share_btn" class="col-xs-6 col-xs-offset-3 btn btn-success" v-on:click="map_reveal">Start sharing my
        location
    </button>
    <button id="stop_share_btn" class="col-xs-6 col-xs-offset-3 btn btn-danger" v-on:click="map_unreveal"
            style="display: none;">Stop sharing my location
    </button>
    <button id="show_locations" class="col-xs-6 col-xs-offset-3 btn btn-success" v-on:click="get_interest_points">Show
        interest locations
    </button>
    <div class="onoffswitch">
        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" v-model="map_follow">
        <label class="onoffswitch-label" for="myonoffswitch">
            <span class="onoffswitch-inner"></span>
            <span class="onoffswitch-switch"></span>
        </label>
    </div>
</template>

<script>


    let map;
    let storage = window.localStorage;
    let token = storage.getItem('token');
    let pre_geojson;
    let current_location = {
        "lng": -6.260431,
        "lat": 53.350358
    };
    let geo_watcher_id = 0;
    export default {
        name: 'MapView',
        data() {
            return {
                credentials: {
                    username: '',
                    password: ''
                },
                error: '',
                json_return: '',
                map_follow: true
            }
        },

        watch:{

          map_follow:function(){
              console.log('map follow clicked')
              console.log(Map) ;
          }

        },
        methods: {
            map_reveal: function () {
                    var vm = this ;
                // onSuccess Callback
                //   This method accepts a `Position` object, which contains
                //   the current GPS coordinates
                //
                function onSuccess(position) {
                    console.log('Latitude: ' + position.coords.latitude + '<br />' +
                        'Longitude: ' + position.coords.longitude + '<br />' +
                        '<hr />');
                    $.getJSON({
                        async: true,
                        crossDomain: true,
                        type: "POST",
                        url: "http://138.68.171.182/api/submit_location/",
                        dataType: 'json',
                        headers: {
                            "authorization": "Token " + token
                        },
                        data: {
                            'location_1': position.coords.longitude,
                            'location_2': position.coords.latitude
                        },
                        success: function (res) {
                            console.log("submit successfully");
                            update_map();
                            //optional
                            if (vm.map_follow == true){
                                map.setView([position.coords.latitude, position.coords.longitude]);
                            }


                            current_location = {
                                "lng": position.coords.longitude,
                                "lat": position.coords.latitude
                            };
                        }
                    });
                }

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    alert('code: ' + error.code + '\n' +
                        'message: ' + error.message + '\n');
                }

                // Options: throw an error if no update is received every 30 seconds.
                //
                geo_watcher_id = navigator.geolocation.watchPosition(onSuccess, onError, {timeout: 30000});
                $("#share_btn").addClass('hidden');
                $("#stop_share_btn").removeClass('hidden').show();
            },

            get_interest_points() {
                get_int_ppoints();
            },

            map_unreveal() {
                navigator.geolocation.clearWatch(geo_watcher_id);
                $("#share_btn").removeClass('hidden');
                $("#stop_share_btn").addClass('hidden');
            }
        },
        ready: function () {
            map = L.map('map_view').setView([13.19048, 1.64441], 13);
            update_map();
            get_int_ppoints();
        }
    }

    function get_int_ppoints() {

        $.ajax({
            async: true,
            crossDomain: true,
            type: "POST",
            url: "http://138.68.171.182/api/fetch_interest_locations/",
            dataType: 'json',
            headers: {
                "authorization": "Token " + token
            },
            data: current_location,
            success: function (res) {
                var myIcon = L.icon({
                    iconUrl: 'img/dot.png',
                    iconSize: [10, 10]
                });
                for (let i = 0; i < res.features.length; i++) {
//                            console.log([res.features[i].geometry.coordinates[1], res.features[i].geometry.coordinates[0]]);
                    let marker = L.marker([res.features[i].geometry.coordinates[1], res.features[i].geometry.coordinates[0]], {
                        icon: myIcon,
                        zIndexOffset: 1000
                    });
                    marker.bindPopup("<b>" + res.features[i].properties.name + " (with " + res.features[i].properties.check_in_num + " times check in)</b><br>"
                        + res.features[i].properties.information).addTo(map);
                }
                let geojson = L.geoJson(res, {
                    invert: true,
                    popup: "hey",
                    icon: myIcon
                });

                map.fitBounds(geojson.getBounds());
            }
        });
    }

    function update_map() {

        $.getJSON({
            async: true,
            crossDomain: true,
            type: "POST",
            url: "http://138.68.171.182/api/fetch_location/",
            dataType: 'json',
            headers: {
                "authorization": "Token " + token
            },
            data: {
                "user_id": 1
            },
            success: function (res) {
                let osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors';

                if (pre_geojson != null)
                    map.removeLayer(pre_geojson);

                let myStyle = {
                    "color": "#ffffff",
                    'fillColor': "#000000",
                    'fillOpacity': 0.95,
                    "weight": 40,
                    "opacity": 0.05
                };

                this.json_return = res;
                console.log(res);
                let worldLatlngs = [[
                    [180, 90],
                    [-180, 90],
                    [-180, -90],
                    [180, -90]]
                ];
                res.features[0].geometry.coordinates.push(worldLatlngs);
                pre_geojson = L.geoJson(res, {
                    invert: true,
                    style: myStyle
                }).addTo(map);

//                    map.fitBounds(geojson.getBounds());
                let osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    attribution: osmAttribution,
                    maxZoom: 19
                }).addTo(map);

            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("Map reveal error!");
            }
        });

    }
</script>