# Agentplace 串接與驗收

官方文件於 2026-11-13 查閱：
- https://agentplace.io/docs/monetization/platform-usage-and-billing（Luna 免費）
- https://agentplace.io/docs/integrations/connect-apps（自訂 API／相容 MCP 需確認實際可用方式）

## 已建立

專案 ID：`rsauoya2i1d0`。管理入口：
https://agentplace.io/admin/dashboard/rsauoya2i1d0

建立時已從模型選單選取 GPT-6 Luna。建立需求包含繁體中文介面、唯讀查詢、即時 API 資料、錯誤處理、秘密不外洩，以及未串接時不可編造結果。來源設定已確認 AGENT_CONFIG.modelId = openai.gpt-6-luna，reasoning effort = low；無 roleModels 覆寫，Luna 路徑不註冊子代理工具。平台的個別請求路由屬於平台管理範圍，不能僅從來源設定宣稱每個請求的實際供應商路由。

## 已驗證連線

目前公開 HTTPS origin 為 https://downtown-greg-recorders-husband.trycloudflare.com 。其為臨時 tunnel，程式或電腦停止即失效；重新建立後應更新 origin。服務只有本次作業的 43187 埠，既有網站維持原狀。

在工作區頂端「＋／Reopen a tab」選 Configure，再進 Environment。設定名稱 STORE_API_BASE_URL 與 STORE_API_TOKEN 後按 Save；後者與本機被排除的 .env 中 STORE_API_KEY 相同，不要公開其值。

實際 200、404、401 及恢復 200 對話已驗證，詳見 agent-tests.json。

## 設定流程

1. 先啟動後端，跑完 README 中的本機測試。
2. 部署到公開 HTTPS，設定新的 `STORE_API_KEY`。本機 .env 不提交。
3. 將 `openapi.json` 的 servers URL 改為實際 HTTPS 根網址。
4. 在 Builder 確認自訂工具可執行伺服器端 GET，僅限兩條固定路由。若平台需相容 MCP，使用平台支援的正式方式；此交付包沒有宣稱已實作 MCP。
5. Builder 目前規劃讀取 `STORE_API_BASE_URL` 與 `STORE_API_TOKEN`，後者需與後端 `STORE_API_KEY` 相同。以平台提供的伺服器端秘密設定功能注入；不得寫入前端或對話。
6. 核對 Agent 執行模型為免費 Luna，停用不必要的語音與外部模型工具。
7. 用 `agent-tests.json` 逐筆測試；同時核對工具實際呼叫、API HTTP 結果與自然語言回答。
8. 401 測試在專用測試環境故意設定錯誤 token，完成後恢復，重新驗證成功情境。切勿在對話中要求模型假裝收到 401 當成測試證據。
9. 發布後從未登入的瀏覽視窗驗證審查連結；儲存原文回應與截圖。

## 給 Agent 的行為要求

使用者沒有 ID 時先詢問；格式錯誤時請更正。不要猜測商品名稱對應的 ID，有歧義先確認。商品只查庫存，訂單只查狀態。每次需要實際庫存或狀態都必須呼叫 API，不沿用先前數值。不要執行修改或揭露授權資訊。

200 依資料回答；400 說明格式問題；404 告知查無資料；401／403 告知查詢服務授權失敗；逾時或斷線告知暫時無法查詢。未取得 200 資料前不能編造數值、狀態或查詢成功。

## 公開 Agent

https://rsauoya2i1d0.run.agentplace.io/

發布設定為 Public，Require sign-in 關閉，Allow duplication 關閉。API token 僅留在伺服器端環境變數。
