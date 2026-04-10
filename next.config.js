/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	images: {
		remotePatterns: [
			{ hostname: "image.mux.com" },
			{ hostname: "utfs.io" },
			{ hostname: "ufs.sh" },
		],
	},
};

export default config;
