<template>
	<g>
		<text
			:x="x"
			:y="y - GAP"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white; stroke: #f31521; stroke-width: 6"
			stroke-linecap="round"
			stroke-linejoin="round"
		>{{line1}}</text>
		<text
			:x="x"
			:y="y"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white; stroke: #f31521; stroke-width: 6"
			stroke-linecap="round"
			stroke-linejoin="round"
		>{{line2}}</text>
		<rect
			:x="rect1.x"
			:y="rect1.y"
			:width="rect1.width"
			:height="rect1.height"
			style="fill: #231f20; stroke: #f31521; stroke-width: 2"
		/>
		<rect
			:x="rect2.x"
			:y="rect2.y"
			:width="rect2.width"
			:height="rect2.height"
			style="fill: #231f20; stroke: #f31521; stroke-width: 2"
		/>
		<rect
			:x="rect1.x"
			:y="rect1.y"
			:width="rect1.width"
			:height="rect1.height"
			style="fill: #231f20"
		/>
		<rect
			:x="rect2.x"
			:y="rect2.y"
			:width="rect2.width"
			:height="rect2.height"
			style="fill: #231f20"
		/>
		<text
			:x="x"
			:y="y - GAP"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white; stroke: #231f20; stroke-width: 4"
			stroke-linecap="round"
			stroke-linejoin="round"
		>{{line1}}</text>
		<text
			ref="unstrokedLine1"
			:x="x"
			:y="y - GAP"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white"
		>{{line1}}</text>
		<text
			:x="x"
			:y="y"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white; stroke: #231f20; stroke-width: 4"
			stroke-linecap="round"
			stroke-linejoin="round"
		>{{line2}}</text>
		<text
			ref="unstrokedLine2"
			:x="x"
			:y="y"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white"
		>{{line2}}</text>
	</g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

interface Rect {
	x: number,
	y: number,
	width: number,
	height: number
}

const GAP = 64;

@Component({})
export default class ModuleNameText extends Vue {
	@Prop({ type: Number, required: true }) readonly x!: number;
	@Prop({ type: Number, required: true }) readonly y!: number;
	@Prop({ type: String, required: true }) readonly line1!: string;
	@Prop({ type: String, required: true }) readonly line2!: string;
	@Prop({ type: Boolean, required: true }) readonly hasPrevLine: boolean;

	GAP = GAP

	rect1 = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}

	rect2 = {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}

	mounted() {
		Vue.nextTick(() => this.recalculateRects());
	}

	@Watch('line1')
	onLine1Change() {
		Vue.nextTick(() => this.recalculateRects());
	}

	@Watch('line2')
	onLine2Change() {
		Vue.nextTick(() => this.recalculateRects());
	}

	recalculateRects() {
		this.recalculateRect(this.rect1, this.$refs.unstrokedLine1 as SVGTextElement, GAP);
		this.recalculateRect(this.rect2, this.$refs.unstrokedLine2 as SVGTextElement, 0);

		if (this.line1 && this.line2) {
			const rectGap = 10;

			if (this.rect1.width < this.rect2.width) {
				this.rect1.height += rectGap;
			} else {
				this.rect2.y -= rectGap;
				this.rect2.height += rectGap;
			}
		}
	}

	recalculateRect(rect: Rect, textEl: SVGTextElement, dy: number) {
		const bounds = textEl.getBoundingClientRect();

		rect.width = Math.max(bounds.width - 20, 0);
		rect.height = 55;
		rect.x = this.x - rect.width / 2;
		rect.y = this.y - dy - rect.height;
	}
}
</script>

<style>

</style>