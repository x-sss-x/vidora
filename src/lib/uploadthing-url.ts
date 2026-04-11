const DEFAULT_UPLOADTHING_PUBLIC_DOMAIN = "https://utfs.io/f";

const sanitizeDomain = (domain: string) => domain.replace(/\/+$/, "");

export const getUploadthingPublicDomain = () =>
	sanitizeDomain(
		process.env.NEXT_PUBLIC_UPLOADTHING_PUBLIC_DOMAIN ??
			DEFAULT_UPLOADTHING_PUBLIC_DOMAIN,
	);

export const getUploadthingFileUrl = (value: string | null | undefined) => {
	if (!value) return "";
	if (value.startsWith("http://") || value.startsWith("https://")) return value;

	return `${getUploadthingPublicDomain()}/${value.replace(/^\/+/, "")}`;
};

export const getUploadthingFileKey = (value: string | null | undefined) => {
	if (!value) return null;
	if (!value.startsWith("http://") && !value.startsWith("https://")) return value;

	try {
		const parsed = new URL(value);
		const normalizedPath = parsed.pathname.replace(/^\/+/, "");
		if (normalizedPath.startsWith("f/")) return normalizedPath.slice(2);

		const pathParts = normalizedPath.split("/").filter(Boolean);
		return pathParts.at(-1) ?? null;
	} catch {
		return null;
	}
};
