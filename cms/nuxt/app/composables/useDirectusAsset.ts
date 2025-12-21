interface DirectusFile {
	id: string;
	[key: string]: any;
}

export function useDirectusAsset(fileOrString: string | DirectusFile | null | undefined, preset?: string): string {
	if (!fileOrString) return '';

	const runtimeConfig = useRuntimeConfig();
	const directusUrl = runtimeConfig.public.directusUrl;

	if (!directusUrl) {
		console.error('directusUrl is not defined in runtimeConfig.public');
		return '';
	}

	const presetParam = preset ? `?key=${preset}` : '';

	if (typeof fileOrString === 'string') {
		return `${directusUrl}/assets/${fileOrString}${presetParam}`;
	}

	return `${directusUrl}/assets/${fileOrString.id}${presetParam}`;
}
