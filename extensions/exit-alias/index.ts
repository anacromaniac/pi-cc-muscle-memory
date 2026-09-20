/**
 * /exit -> /quit, plus bare "exit" / "quit"
 *
 * Claude Code muscle memory: /exit requests a graceful shutdown, exactly like
 * the built-in /quit.
 *
 * On top of the alias, the bare words "exit" and "quit" (typed without the
 * leading slash) are intercepted and shut pi down instead of being sent to
 * the model as a prompt.
 */

import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

const EXIT_WORDS = new Set(["exit", "quit"]);

export default function (pi: ExtensionAPI) {
	pi.registerCommand("exit", {
		description: "Exit pi (alias of /quit)",
		handler: async (_args, ctx) => {
			ctx.shutdown();
		},
	});

	pi.on("input", async (event, ctx) => {
		// Only intercept plain typed text, never extension-injected messages
		// and never messages with attached images.
		if (event.source !== "interactive") return { action: "continue" };
		if (event.images?.length) return { action: "continue" };

		const text = event.text.trim().toLowerCase();
		if (EXIT_WORDS.has(text)) {
			ctx.shutdown();
			return { action: "handled" };
		}

		return { action: "continue" };
	});
}
