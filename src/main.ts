import Vue from 'vue';
import App from './App.vue';

document.addEventListener("DOMContentLoaded", e => {
	new Vue({
		el: '#app',
		render: h => h(App)
	});
});
