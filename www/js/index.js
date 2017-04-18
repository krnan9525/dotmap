/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Vue.component('todo-item', {
//     props: ['todo'],
//     template: '<li>{{ todo.text }}</li>'
// });
//
// let storage = window.localStorage;
// let logged_in = storage.getItem("isLoggedin"); // Pass a key name to get its value.
//
// console.log("logged"+logged_in);
// if(logged_in)
// {
//     let app = new Vue({
//         el: '#app',
//         data: {
//             message: 'Hello Vue!',
//             groceryList: [
//                 { text: 'Vegetables' },
//                 { text: 'Cheese' },
//                 { text: 'Whatever else humans are supposed to eat' }
//             ]
//         }
//     });
// }else {
//     let app = new Vue({
//         el: '#app',
//         template:"",
//         data: {
//             message: 'Not Logged in',
//             groceryList: [
//                 { text: 'Vegetables' },
//                 { text: 'Cheese' },
//                 { text: 'Whatever else humans are supposed to eat' }
//             ]
//         }
//     });
// }

import Vue from 'vue'
import App from './components/App.vue'
import Home from './components/Home.vue'
// import SecretQuote from './components/SecretQuote.vue'
// import Signup from './components/Signup.vue'
import Login from './components/Login.vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
Vue.use(VueResource);
Vue.use(VueRouter);

export var router = new VueRouter();

// Set up routing and match routes to components
router.map({
    '/home': {
        component: Home
    },
    // 'secretquote': {
    //     component: SecretQuote
    // },
    '/login': {
        component: Login
    },
    // '/signup': {
    //     component: Signup
    // }
});

// Redirect to the home route if any routes are unmatched
router.redirect({
    '*': '/home'
});

// Start the app on the #app div
router.start(App, '#app');