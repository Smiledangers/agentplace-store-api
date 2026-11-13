# Model Configuration Evidence

During the original setup on November 13, 2026, the Agentplace Builder reported the following after inspecting its generated runtime source:

- AGENT_CONFIG.modelId in agent-dev-server/src/config.ts was openai.gpt-6-luna.
- Reasoning effort was low.
- No roleModels override was found.
- The Luna-specific tool-registration path disabled subagent tools.
- The Builder model selector was set to GPT-6 Luna.

## Verification boundary

The generated Agentplace runtime source is not part of this backend checkout. The statements above are a recorded Builder source-inspection report, not a new independent inspection performed by this localization change.

The selected configuration does not prove the resolved provider model, routing decision, or billing result for every request. Those decisions are managed by Agentplace. No claim of independently verified per-turn routing or billing is made.

Agentplace's published explanation of Luna usage is available at:

https://agentplace.io/docs/monetization/platform-usage-and-billing

That reference describes the platform's policy; it is separate from evidence of a particular request's execution.

The integration references STORE_API_BASE_URL and STORE_API_TOKEN as server-side environment variables. No credential values are included in this document.
