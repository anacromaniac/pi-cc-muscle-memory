/**
 * /clear -> /new
 *
 * Claude Code muscle memory: /clear starts a fresh session, exactly like the
 * built-in /new. Nothing is reimplemented, the built-in session machinery is
 * just re-exposed under the familiar name.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerCommand("clear", {
		description: "Start a new session (alias of /new)",
		handler: async (_args, ctx) => {
			await ctx.newSession();
		},
	});
}
