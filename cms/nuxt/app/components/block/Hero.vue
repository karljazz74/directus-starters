<script setup lang="ts">
interface HeroProps {
	data: {
		id: string;
		tagline: string;
		headline: string;
		description: string;
		layout: 'image_image_left' | 'image_center' | 'image_left';
		image: string;
		images_multi?: string[];
		translations_hero?: Array<{
			languages_code: string;
			tagline: string;
			headline: string;
			description: string;
		}>;
		button_group?: {
			buttons: Array<{
				id: string;
				label: string | null;
				variant: string | null;
				url: string | null;
				type: 'url' | 'page' | 'post';
				pagePermalink?: string | null;
				postSlug?: string | null;
			}>;
		};
	};
}

const { setAttr } = useVisualEditing();
const props = defineProps<HeroProps>();

// Get current language - must use the same useState key as LanguageSelector
const locale = useState<string>('locale', () => 'en-US');

// Compute translated content based on selected language
const translatedContent = computed(() => {
	const translation = props.data.translations_hero?.find((t) => t.languages_code === locale.value);
	
	return {
		tagline: translation?.tagline || props.data.tagline,
		headline: translation?.headline || props.data.headline,
		description: translation?.description || props.data.description,
	};
});

// Use images_multi if available, otherwise fallback to single image
const carouselImages = computed(() => {
	if (props.data.images_multi && props.data.images_multi.length > 0) {
		// Extract file IDs from the M2M junction table structure
		const images = props.data.images_multi
			.map((item: any) => item.directus_files_id?.id)
			.filter((id: string | undefined) => id !== undefined);
		console.log('Carousel images:', images, 'Count:', images.length);
		return images;
	}
	const fallback = props.data.image ? [props.data.image] : [];
	console.log('Using fallback image:', fallback);
	return fallback;
});
</script>

<template>
	<section
		class="relative w-full mx-auto flex flex-col gap-6 md:gap-12"
		:class="{
			'items-center text-center': data.layout === 'image_center',
			'md:flex-row-reverse items-center': data.layout === 'image_left',
			'md:flex-row items-center': data.layout !== 'image_center' && data.layout !== 'image_left',
		}"
	>
		<div
			class="flex flex-col gap-4 w-full"
			:class="{
				'md:w-3/4 xl:w-2/3 items-center': data.layout === 'image_center',
				'md:w-1/2 items-start': data.layout !== 'image_center',
				'md:-mt-8': data.layout === 'image_right',
			}"
		>
			<Tagline
				:tagline="translatedContent.tagline"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'tagline', mode: 'popover' })"
			/>
			<Headline
				:headline="translatedContent.headline"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'headline', mode: 'popover' })"
			/>
			<Text
				v-if="translatedContent.description"
				:content="translatedContent.description"
				:data-directus="setAttr({ collection: 'block_hero', item: data.id, fields: 'description', mode: 'popover' })"
			/>

			<div
				v-if="data.button_group?.buttons?.length"
				class="mt-6"
				:class="{ 'flex justify-center': data.layout === 'image_center' }"
			>
				<ButtonGroup
					:buttons="data.button_group.buttons"
					:data-directus="
						setAttr({ collection: 'block_button_group', item: data.button_group?.id, fields: 'buttons', mode: 'modal' })
					"
				/>
			</div>
		</div>

		<div
			v-if="carouselImages.length > 0"
			class="relative w-full"
			:class="{
				'md:w-3/4 xl:w-2/3 h-[400px]': data.layout === 'image_center',
				'md:w-1/2 h-[562px]': data.layout !== 'image_center',
			}"
		>
			<ClientOnly>
				<UCarousel
					v-if="carouselImages.length > 1"
					v-slot="{ item }"
					fade
					arrows
					dots
					loop
					:autoplay="{ delay: 2500, stopOnInteraction: false }"
					:items="carouselImages"
					class="w-full h-full"
					:ui="{
						container: 'h-full',
						item: 'h-full',
						prev: 'sm:start-4 !bg-white/80 dark:!bg-gray-800/80',
						next: 'sm:end-4 !bg-white/80 dark:!bg-gray-800/80',
						dots: '!-bottom-8',
						dot: '!bg-gray-400 data-[state=active]:!bg-white'
					}"
				>
					<DirectusImage
						:uuid="item"
						:alt="data.tagline || data.headline || 'Hero Image'"
						:fill="true"
						:sizes="data.layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'"
						class="object-contain"
						:data-directus="
							setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'layout'], mode: 'modal' })
						"
					/>
				</UCarousel>
				<DirectusImage
					v-else
					:uuid="carouselImages[0]"
					:alt="data.tagline || data.headline || 'Hero Image'"
					:fill="true"
					:sizes="data.layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'"
					class="object-contain"
					:data-directus="
						setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'layout'], mode: 'modal' })
					"
				/>
				<template #fallback>
					<DirectusImage
						:uuid="carouselImages[0]"
						:alt="data.tagline || data.headline || 'Hero Image'"
						:fill="true"
						:sizes="data.layout === 'image_center' ? '100vw' : '(max-width: 768px) 100vw, 50vw'"
						class="object-contain"
						:data-directus="
							setAttr({ collection: 'block_hero', item: data.id, fields: ['image', 'layout'], mode: 'modal' })
						"
					/>
				</template>
			</ClientOnly>
		</div>
	</section>
</template>
