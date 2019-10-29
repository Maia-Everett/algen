<template>
    <div class="image-generator">
        <div class="image-generator__form">
            <div>
                <b-form-group label="Логотип Лиги">
                    <b-form-radio-group v-model="alLogoPos" name="al-logo-pos">
                        <b-form-radio value="LEFT">Слева</b-form-radio>
                        <b-form-radio value="CENTER">По центру</b-form-radio>
                        <b-form-radio value="RIGHT">Справа</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <div>Левая кнопка перемещает фон, колёсико мыши масштабирует.</div>
            </div>
            <div>
                <b-form-group label="Строка 1" label-cols="3"><b-form-input v-model="line1" /></b-form-group>
                <b-form-group label="Строка 2" label-cols="3"><b-form-input v-model="line2" /></b-form-group>
            </div>
            <div>
                <b-form-group label="Код модуля" label-cols="4"><b-form-input v-model="moduleCode" placeholder="Например, DDEX 4-5" /></b-form-group>
                <div class="image-generator__button_container">
                    <b-button variant="outline-dark" @click="onReset">Сброс</b-button>
                    <b-button variant="primary" @click="onDownload">Скачать</b-button>
                </div>
            </div>
        </div>
        <svg
            ref="svg"
            class="image-generator__svg"
            xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
            :width="`${IMAGE_WIDTH}px`"
            :height="`${IMAGE_HEIGHT}px`"
            :viewBox="`0 0 ${IMAGE_WIDTH} ${IMAGE_HEIGHT}`"
            @mousedown="onDragStart"
            @mousemove="onDragMove"
            @wheel="onWheel"
        >
            <image
                :x="bgX"
                :y="bgY"
                :width="background.width * scale"
                :height="background.height * scale"
                :xlink:href="background.url"
                image-rendering="optimizeQuality"
            />
            <image x="0" y="0" xlink:href="img/tower_logo.png" onmousedown="event.preventDefault()" />
            <image :x="AL_LOGO_POSITIONS[alLogoPos]" y="5" xlink:href="img/al_logo.png" onmousedown="event.preventDefault()" />
            <text
                :x="IMAGE_WIDTH - 13"
                :y="IMAGE_HEIGHT - 10"
                text-anchor="end"
                alignment-baseline="bottom"
				style="font-family: 'Nodesto Cyrillic'; font-size: 34pt; text-transform: uppercase; fill: white; stroke: #231f20; stroke-width: 2"
                stroke-linecap="round"
                stroke-linejoin="round"
            >{{moduleCode}}</text>
			<text
                :x="IMAGE_WIDTH - 13"
                :y="IMAGE_HEIGHT - 10"
                text-anchor="end"
                alignment-baseline="bottom"
				style="font-family: 'Nodesto Cyrillic'; font-size: 34pt; text-transform: uppercase; fill: white"
            >{{moduleCode}}</text>
            <module-name-text
                :x="IMAGE_WIDTH / 2"
                :y="IMAGE_HEIGHT - 13"
                :line1="line1Text"
                :line2="line2Text"
            />
        </svg>
        <canvas ref="canvas" v-show="false" :width="IMAGE_WIDTH" :height="IMAGE_HEIGHT"></canvas>
        <img ref="img" v-show="false" @load="onSVGImageLoaded" />
        <a ref="downloadLink" v-show="false" :download="(moduleCode || 'picture') + '.png'"></a>
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Base64 } from 'js-base64';
import Background from "./model/Background";
import ModuleNameText from './view/ModuleNameText.vue';

const IMAGE_WIDTH = 1189;
const IMAGE_HEIGHT = 585;
const AL_LOGO_WIDTH = 383;

const AL_LOGO_POSITIONS = {
    LEFT: 11,
    CENTER: (IMAGE_WIDTH - AL_LOGO_WIDTH) / 2,
    RIGHT: IMAGE_WIDTH - AL_LOGO_WIDTH - 11
};

@Component({
    components: {
        'module-name-text': ModuleNameText
    }
})
export default class ImageGenerator extends Vue {
    @Prop({ type: Object, required: true }) readonly background!: Background;

    IMAGE_WIDTH = IMAGE_WIDTH;
    IMAGE_HEIGHT = IMAGE_HEIGHT;
    AL_LOGO_POSITIONS = AL_LOGO_POSITIONS;

    bgX = 0;
    bgY = 0;
    scale = 1.0;

    mouseDownX = 0;
    mouseDownY = 0;

    alLogoPos = 'CENTER';

    moduleCode = '';
    line1 = '';
    line2 = '';

    get line1Text() {
        return (this.line1 && this.line2) ? this.line1 : '';
    }

    get line2Text() {
        return this.line2 || this.line1;
    }

    created() {
        // Stretch so that image covers entire SVG
        const { width, height } = this.background;
        const aspectRatio = width / height;

        if ((IMAGE_WIDTH / width) * height >= IMAGE_HEIGHT) {
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

        e.preventDefault();
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

        if (this.bgX < IMAGE_WIDTH - width * this.scale) {
            this.bgX = IMAGE_WIDTH - width * this.scale;
        }

        if (this.bgY < IMAGE_HEIGHT - height * this.scale) {
            this.bgY = IMAGE_HEIGHT - height * this.scale;
        }
    }

    onDownload() {
        // Need to replace image links with data URLs
        const svg = this.$refs.svg as HTMLElement;

        for (let img of Array.from(svg.getElementsByTagName("image"))) {
            if (img.getAttribute('xlink:href')!.startsWith('data:')) {
                continue;
            }

            const canvas = document.createElement('canvas') as HTMLCanvasElement;
            const rect = img.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;

            let g = canvas.getContext('2d')!;
            g.drawImage(img, 0, 0);

            img.setAttribute('xlink:href', canvas.toDataURL());
        }

        const xml = new XMLSerializer().serializeToString(svg);

        const img = this.$refs.img as HTMLImageElement;
        img.src = "data:image/svg+xml;base64," + Base64.encode(xml);
    }

    onSVGImageLoaded() {
        const img = this.$refs.img as HTMLImageElement;
        const canvas = this.$refs.canvas as HTMLCanvasElement;

        const g = canvas.getContext("2d")!;
        g.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        g.drawImage(img, 0, 0);

        const downloadLink = this.$refs.downloadLink as HTMLAnchorElement;
        downloadLink.href = canvas.toDataURL("image/png");
        downloadLink.click();
    }

    onReset() {
        this.$emit('reset');
    }
}
</script>

<style>
.image-generator__form {
    margin-bottom: 0.6rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.image-generator__svg {
    display: block;
    margin: auto;
    cursor: grab;
}

.image-generator__svg:active {
    cursor: grabbing;
}

.image-generator__button_container {
    text-align: right;
}
</style>