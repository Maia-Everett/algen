<template>
    <div class="app">
        <h1>Генератор картинок башенной Лиги</h1>
        <image-loader v-if="!background" @load="onImageLoaded" />
        <image-generator v-else :background="background" />
    </div>
</template>

<script lang="ts">
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import Component from 'vue-class-component';
import ImageLoader from './ImageLoader.vue';
import ImageGenerator from './ImageGenerator.vue';
import Background from './model/Background';

@Component({
    components: {
        'image-loader': ImageLoader,
        'image-generator': ImageGenerator
    }
})
export default class App extends Vue {
    background: Background|null = null

    onImageLoaded(background: Background) {
        this.background = background;
    }
}
</script>

<style>
body {
    font-family: Alegreya;
}

h1, h2, h3, h4, h5, h6 {
    font-family: Alegreya SC;
}

.app {
    margin: auto;
    margin-top: 1rem;
    width: 1200px;
}
</style>
