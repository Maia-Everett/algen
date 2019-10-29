<template>
	<div class="image-loader" @click="promptLoad">
		Выберите картинку.
		<input v-show="false" type="file" ref="uploader" @change="onFileSelected" />
		<img v-show="false" ref="image" @load="onImageLoaded" @error="onImageError" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import Background from './model/Background';

@Component({})
export default class ImageLoader extends Vue {
	promptLoad() {
		(this.$refs.uploader as HTMLInputElement).click();
	}

	onFileSelected() {
		const files = (this.$refs.uploader as HTMLInputElement).files;

		if (!files || files.length === 0) {
			return;
		}

		const reader = new FileReader();

		reader.onload = () => {
			(this.$refs.image as HTMLImageElement).src = reader.result as string;
		}

		reader.onerror = () => {
			alert('Ошибка загрузки изображения:\n\n' + reader.error!.message);
		}

		reader.readAsDataURL(files[0]);
	}

	onImageLoaded() {
		const img = this.$refs.image as HTMLImageElement;

		this.$emit('load', <Background>{
			width: img.naturalWidth || img.width,
			height: img.naturalHeight || img.height,
			url: img.src
		});
	}

	onImageError() {
		alert('Ошибка загрузки изображения');
	}
}
</script>

<style>
.image-loader {
	background: #f0f0f0;
	height: 150px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-size: 20px;
}
</style>