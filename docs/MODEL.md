# 模型設定核對

2026-11-13，Agentplace Builder 讀取專案來源後回報：

- agent-dev-server/src/config.ts 的 AGENT_CONFIG.modelId 為 openai.gpt-6-luna。
- reasoning effort 為 low。
- 本專案未設定 roleModels；Luna 路徑停用子代理工具。
- Builder 選單亦已選取 GPT-6 Luna。

這些是來源設定的證據，不宣稱已獨立取得平台每一次請求的實際供應商路由或帳務紀錄。平台路由由 Agentplace 管理。

Agentplace 官方說明 Luna 模型使用免費：
https://agentplace.io/docs/monetization/platform-usage-and-billing

自訂 API 只以伺服器端環境設定 STORE_API_BASE_URL 與 STORE_API_TOKEN 存取；此文件不包含任何秘密。
