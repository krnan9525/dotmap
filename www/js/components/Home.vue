
<template xmlns:v-on="http://www.w3.org/1999/xhtml">
    <div class="col-sm-6 col-sm-offset-3">
        <h1>Welcome to DotMap</h1>
        <button class="btn btn-primary col-xs-4 col-xs-offset-4" v-on:click="show_modal()">Already a user?<br>Log in here</button>
        <div class="quote-area" v-if="quote">
            <h2>
                <blockquote>{{ quote }}</blockquote>
            </h2>
        </div>
    </div>

    <div class="modal" hidden id="login_modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                    <h4 class="modal-title">Dotmap login</h4>
                </div>
                <div class="modal-body">
                    <h2>Log In</h2>
                    <p>Log in to your account to get some great quotes.</p>
                    <div class="alert alert-danger" v-if="error">
                        <p>{{ error }}</p>
                    </div>
                    <div class="form-group">
                        <input
                                type="text"
                                class="form-control"
                                placeholder="Enter your username"
                                v-model="credentials.username"
                        >
                    </div>
                    <div class="form-group">
                        <input
                                type="password"
                                class="form-control"
                                placeholder="Enter your password"
                                v-model="credentials.password"
                        >
                    </div>
                    <button class="btn btn-primary" v-on:click="get_token()">Access</button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                quote: '',
                credentials: {
                    username: '',
                    password: ''
                },
                error: ''
            }
        },
        methods: {
            get_token() {
                var base_code = "Basic " + btoa(this.credentials.username+':'+this.credentials.password);
                console.log(base_code);
                $.ajax({
                    async: true,
                    crossDomain: true,
                    type: "GET",
                    method: "GET",
                    url: "http://138.68.171.182/api/token/",
                    dataType: 'json',
                    headers: {
                        "authorization": base_code
                    },
                    success: function (res) {
                        console.log(res.token);
                        var storage = window.localStorage;
                        storage.setItem('token', res.token);
                        window.location.assign("/index.html#!/mapview")
                    },
                    error: function(xhr, textStatus, errorThrown){
                        console.log("login error");
                    }
                });
            },
            show_modal(){
                $("#login_modal").modal('show')
            }
        }
    }
</script>