<template>
	<g>
		<text
			:x="x"
			:y="y"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white; stroke: #f31521; stroke-width: 6"
			stroke-linecap="round"
			stroke-linejoin="round"
		>{{text}}</text>
		<rect
			:x="rectX"
			:y="rectY"
			:width="rectWidth"
			:height="rectHeight"
			style="fill: #231f20; stroke: #f31521; stroke-width: 2"
		/>
		<rect
			:x="rectX"
			:y="rectY"
			:width="rectWidth"
			:height="rectHeight"
			style="fill: #231f20"
		/>
		<text
			:x="x"
			:y="y"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white; stroke: #231f20; stroke-width: 4"
			stroke-linecap="round"
			stroke-linejoin="round"
		>{{text}}</text>
		<text
			ref="unstrokedText"
			:x="x"
			:y="y"
			text-anchor="middle"
			alignment-baseline="bottom"
			style="font-family: 'Nodesto Cyrillic'; font-size: 60pt; text-transform: uppercase; fill: white"
		>{{text}}</text>
	</g>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component({})
export default class ModuleNameText extends Vue {
	@Prop({ type: Number, required: true }) readonly x!: number;
	@Prop({ type: Number, required: true }) readonly y!: number;
	@Prop({ type: String, required: true }) readonly text!: string;
	@Prop({ type: Boolean, required: true }) readonly hasPrevLine: boolean;

	rectX = 0
	rectY = 0
	rectWidth = 0
	rectHeight = 0

	mounted() {
		Vue.nextTick(() => this.recalculateRect());
	}

	@Watch('text')
	onTextChange() {
		Vue.nextTick(() => this.recalculateRect());
	}

	recalculateRect() {
		const textEl = this.$refs.unstrokedText as SVGTextElement;
		const bounds = textEl.getBoundingClientRect();

		this.rectWidth = Math.max(bounds.width - 20, 0);
		this.rectHeight = 55;
		this.rectX = this.x - this.rectWidth / 2;
		this.rectY = this.y - this.rectHeight;
	}
}
</script>

<style>

</style>