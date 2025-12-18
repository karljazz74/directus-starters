<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();

const currentLanguage = computed(() => {
	return locales.find((l) => l.code === locale.value);
});

const isOpen = ref(false);

const selectLanguage = (langCode: string) => {
	setLocale(langCode);
	isOpen.value = false;
};
</script>

<template>
	<div class="relative">
		<button
			@click="isOpen = !isOpen"
			class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
			aria-label="Select language"
		>
			<span class="text-lg">{{ currentLanguage?.flag || '🌐' }}</span>
			<span class="hidden sm:inline">{{ currentLanguage?.name || 'Language' }}</span>
			<svg
				class="w-4 h-4 transition-transform"
				:class="{ 'rotate-180': isOpen }"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>

		<Transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95"
		>
			<div
				v-if="isOpen"
				class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg z-50"
			>
				<div class="py-1">
					<button
						v-for="lang in locales"
						:key="lang.code"
						@click="selectLanguage(lang.code)"
						class="flex items-center gap-3 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
						:class="{
							'bg-gray-100 dark:bg-gray-700 font-semibold': lang.code === locale,
						}"
					>
						<span class="text-lg">{{ lang.flag }}</span>
						<span>{{ lang.name }}</span>
					</button>
				</div>
			</div>
		</Transition>
	</div>
</template>
