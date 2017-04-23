<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <ul class="nav navbar-nav">
                <li><a v-link="'signup'">Sign Up</a></li>
            </ul>
        </div>
    </nav>
    <div class="container-fluid">
        <router-view></router-view>
    </div>
</template>