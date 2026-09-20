/**
 * /rename -> /name
 *
 * Claude Code muscle memory: /rename sets the current session's display name,
 * exactly like the built-in /name.
 *
 * Usage:
 *   /rename My session name   -> sets the name directly
 *   /rename                   -> prompts for a name (prefilled with the current one)
 *
 * In non-interactive modes a bare /rename is a no-op, so pass a name explicitly.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	pi.registerCommand("rename", {
		description: "Set session display name (alias of /name)",
		handler: async (args, ctx) => {
			const provided = args.trim();
			if (provided) {
				pi.setSessionName(provided);
				ctx.ui.notify(`Session renamed: ${provided}`, "info");
				return;
			}

			if (!ctx.hasUI) return;

			const current = pi.getSessionName() ?? "";
			const name = await ctx.ui.input("Session name:", current);
			const trimmed = name?.trim();
			if (!trimmed) return;

			pi.setSessionName(trimmed);
			ctx.ui.notify(`Session renamed: ${trimmed}`, "info");
		},
	});
}
