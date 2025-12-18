const LOCALES = [
	{ code: 'en-US', name: 'English', flag: '🇺🇸' },
	{ code: 'de-DE', name: 'German', flag: '🇩🇪' },
	{ code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
	{ code: 'it-IT', name: 'Italian', flag: '🇮🇹' },
	{ code: 'fr-FR', name: 'French', flag: '🇫🇷' },
	{ code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
];

export const useI18n = () => {
	const locale = useState<string>('locale', () => {
		// Initialize from localStorage on client side only
		if (process.client) {
			const savedLocale = localStorage.getItem('locale');
			if (savedLocale) {
				return savedLocale;
			}
		}
		return 'en-US'; // Default locale
	});

	const setLocale = (newLocale: string) => {
		locale.value = newLocale;
		// Store in localStorage if on client side
		if (process.client) {
			localStorage.setItem('locale', newLocale);
		}
	};

	return {
		locale,
		locales: LOCALES,
		setLocale,
	};
};
