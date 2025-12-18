<script setup lang="ts">
import { getDirectusAssetURL } from '@@/server/utils/directus-utils';
import { watch, ref } from 'vue';

interface DirectusImageProps {
	uuid: string;
	alt: string;
	width?: number;
	height?: number;
	preset?: string;
	[key: string]: any;
}

const props = withDefaults(defineProps<DirectusImageProps>(), {
	width: undefined,
	height: undefined,
	preset: '800w',
});

const src = ref(getDirectusAssetURL(props.uuid, props.preset));

watch(
	() => [props.uuid, props.preset],
	([newUuid, newPreset]) => {
		src.value = getDirectusAssetURL(newUuid as string, newPreset as string);
	},
);
</script>

<template>
	<img :src="src" v-bind="{ ...props, uuid: undefined }" />
</template>
