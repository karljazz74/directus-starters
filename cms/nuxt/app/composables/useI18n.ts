export const useI18n = () => {
	const locale = useState<string>('locale', () => 'en-US');

	const locales = ref([
		{ code: 'en-US', name: 'English', flag: '🇺🇸' },
		{ code: 'de-DE', name: 'German', flag: '🇩🇪' },
		{ code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
		{ code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
		{ code: 'fr-FR', name: 'French', flag: '🇫🇷' },
		{ code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
	]);

	const setLocale = (newLocale: string) => {
		locale.value = newLocale;
		// Store in localStorage if on client side
		if (process.client) {
			localStorage.setItem('locale', newLocale);
		}
	};

	// Initialize from localStorage on client side
	if (process.client && !locale.value) {
		const savedLocale = localStorage.getItem('locale');
		if (savedLocale) {
			locale.value = savedLocale;
		}
	}

	return {
		locale: readonly(locale),
		locales: readonly(locales),
		setLocale,
	};
};
