<template>
	<div class="image-generator">
		<div class="image-generator__form">

		</div>
		<svg class="image-generator__svg" xmlns="http://www.w3.org/2000/svg" :width="`${IMAGE_WIDTH}px`" :height="`${IMAGE_HEIGHT}px`" :viewBox="`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`" @mousedown="onDragStart" @mousemove="onDragMove" @wheel="onWheel">
			<image :x="bgX" :y="bgY" :width="background.width * scale" :height="background.height * scale" :xlink:href="background.url" image-rendering="optimizeQuality" />
		</svg>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Background from './model/Background'

const IMAGE_WIDTH = 1189;
const IMAGE_HEIGHT = 585;

@Component({})
export default class ImageGenerator extends Vue {
	@Prop({ type: Object, required: true }) readonly background!: Background

	IMAGE_WIDTH = IMAGE_WIDTH
	IMAGE_HEIGHT = IMAGE_HEIGHT

	bgX = 0
	bgY = 0
	scale = 1.0

	mouseDownX = 0
	mouseDownY = 0

	created() {
		// Stretch so that image covers entire SVG
		const { width, height } = this.background;
		const aspectRatio = width / height;

		if (IMAGE_WIDTH / width * height >= IMAGE_HEIGHT) {
			this.scale = IMAGE_WIDTH / width;
		} else {
			this.scale = IMAGE_HEIGHT / height;
		}

		const newWidth = width * this.scale;
		const newHeight = height * this.scale;
		this.bgX = (IMAGE_WIDTH - newWidth) / 2;
		this.bgY = (IMAGE_HEIGHT - newHeight) / 2;
	}

	onWheel(e: WheelEvent) {
		let newScale;

		if (e.deltaY < 0) {
			newScale = this.scale + 0.05;
		} else {
			newScale = this.scale - 0.05;
		}

		const { width, height } = this.background;

		if (width * newScale < IMAGE_WIDTH) {
			newScale = IMAGE_WIDTH / width;
		}

		if (height * newScale < IMAGE_HEIGHT) {
			newScale = IMAGE_HEIGHT / height;
		}

		const oldWidth = width * this.scale;
		const oldHeight = height * this.scale;
		const newWidth = width * newScale;
		const newHeight = height * newScale;

		this.bgX += (oldWidth - newWidth) / 2;
		this.bgY += (oldHeight - newHeight) / 2;

		this.scale = newScale;
		this.clampBGOffset();
	}

	onDragStart(e: MouseEvent) {
		this.mouseDownX = e.screenX;
		this.mouseDownY = e.screenY;
	}

	onDragMove(e: MouseEvent) {
		if (e.buttons === 0) {
			return;
		}

		this.bgX += e.screenX - this.mouseDownX;
		this.bgY += e.screenY - this.mouseDownY;
		this.clampBGOffset();
		this.mouseDownX = e.screenX;
		this.mouseDownY = e.screenY;
	}

	clampBGOffset() {
		const { width, height } = this.background;

		if (this.bgX > 0) {
			this.bgX = 0;
		}

		if (this.bgY > 0) {
			this.bgY = 0;
		}

		if (this.bgX < IMAGE_WIDTH - (width * this.scale)) {
			this.bgX = IMAGE_WIDTH - (width * this.scale);
		}

		if (this.bgY < IMAGE_HEIGHT - (height * this.scale)) {
			this.bgY = IMAGE_HEIGHT - (height * this.scale);
		}
	}
}
</script>

<style>
.image-generator__svg {
	cursor: grab;
}

.image-generator__svg:active {
	cursor: grabbing;
}
</style>