<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="col-sm-4 col-sm-offset-4">
        <h2>DotMap</h2>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
    </div>
    <div class="col-xs-12" id="map_view"></div>
    <button class="col-xs-6 col-xs-offset-3 btn btn-success" v-on:click="map_reveal">Start sharing my location</button>
    <button class="col-xs-6 col-xs-offset-3 btn btn-success" v-on:click="get_interest_points">Show interest locations
    </button>
</template>

<script>


    var map;
    export default {
        name: 'MapView',
        data() {
            return {
                // We need to initialize the component with any
                // properties that will be used in it
                credentials: {
                    username: '',
                    password: ''
                },
                error: '',
                json_return: ''
            }
        },
        methods: {
            map_reveal: function () {

                // onSuccess Callback
                //   This method accepts a `Position` object, which contains
                //   the current GPS coordinates
                //
                function onSuccess(position) {
                    var element = document.getElementById('geolocation');
                    element.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                        'Longitude: ' + position.coords.longitude     + '<br />' +
                        '<hr />'      + element.innerHTML;
                }

                // onError Callback receives a PositionError object
                //
                function onError(error) {
                    alert('code: '    + error.code    + '\n' +
                        'message: ' + error.message + '\n');
                }

                // Options: throw an error if no update is received every 30 seconds.
                //
                var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
            },

            get_interest_points() {
                get_int_ppoints();
            }
        },
        ready: function () {
            map = L.map('map_view').setView([13.19048, 1.64441], 13);

            var storage = window.localStorage;
            var token = storage.getItem('token');
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
//                    let lngandlat = res.buffer.coordinates;
//                    for (var i = 0 ; i < lngandlat.length; i++)
//                    {
//                        let latlng = [];
//                        for( var j = 0 ; j < lngandlat[i][0].length; j++)
//                        {
//                            latlng.push(new L.LatLng(lngandlat[i][0][j][0],lngandlat[i][0][j][1]) );
//                        }
//                        let polygon = new L.Polygon(latlng);
                    let osmAttribution = 'Map data &copy; 2012 OpenStreetMap contributors';

                    var myStyle = {
                        "color": "#ff7800",
                        'fillColor': "#000000",
                        'fillOpacity': 0.95,
                        "weight": 5,
                        "opacity": 0.65
                    };

                    this.json_return = res;
                    console.log(res);
                    var worldLatlngs = [[
                        [90, 180],
                        [90, -180],
                        [-90, -180],
                        [-90, 180]]
                    ];
                    res.features[0].geometry.coordinates.push(worldLatlngs);
                    let geojson = L.geoJson(res, {
                        invert: true,
                        style: myStyle
                    }).addTo(map);

//                    map.fitBounds(geojson.getBounds());
                    var osm = L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                        attribution: osmAttribution,
                        maxZoom: 19
                    }).addTo(map);

                    get_int_ppoints();
                },
                error: function (xhr, textStatus, errorThrown) {
                    console.log("Map reveal error!");
                }
            });
        }
    }

    function get_int_ppoints() {
        var storage = window.localStorage;
        var token = storage.getItem('token');
        $.ajax({
            async: true,
            crossDomain: true,
            type: "POST",
            url: "http://138.68.171.182/api/fetch_interest_locations/",
            dataType: 'json',
            headers: {
                "authorization": "Token " + token
            },
            data: {
                "lng": -6.260431,
                "lat": 53.350358
            },
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
                        + res.features[i].properties.information).addTo(map).openPopup();
                    var popup = L.popup()
                        .setLatLng([res.features[i].geometry.coordinates[1], res.features[i].geometry.coordinates[0]])
                        .setContent("I am a standalone popup.")
                        .openOn(map);
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
</script>