# 交付狀態

## 後端

- [x] 10 筆虛構商品（含零庫存）、10 筆虛構訂單
- [x] 唯讀商品庫存與訂單狀態 API
- [x] 請求參數驗證與 Bearer token 服務授權
- [x] 50 個本機 HTTP 情境全部通過；52 個 Node 測試全部通過
- [x] 公開 HTTPS：49 個 API 情境通過；1 個損壞百分比編碼網址由 Cloudflare 以 400 預先攔截

## Agent

- [x] Agentplace 專案 rsauoya2i1d0，Builder 選 GPT-6 Luna
- [x] 檢查來源設定：AGENT_CONFIG.modelId = openai.gpt-6-luna，reasoning effort = low，無角色模型覆寫
- [x] API 網址與 token 透過 Configure → Environment 設定；token 未放入聊天、前端或儲存庫
- [x] 存在商品、零庫存、存在訂單、查無商品、查無訂單、實際 401，皆有自然語言回答與對應後端 HTTP 紀錄
- [x] 授權失敗測試後，恢復設定並重新取得 P001 庫存 25 與 HTTP 200
- [x] 缺 ID、無效商品 ID、無效訂單 ID、唯讀限制、保密與未連線情境保留實際回覆
- [x] 已發布 https://rsauoya2i1d0.run.agentplace.io/ ，發布版實際查到 P002 機械鍵盤庫存 12，且有對應 HTTP 200 紀錄

## 程式與提交

- [x] 完整本機原始碼、安裝及操作文件、OpenAPI、Dockerfile、測試腳本與實際證據
- [x] 公開儲存庫：https://github.com/Smiledangers/agentplace-store-api
- [x] 後端、範例資料、測試、重跑腳本與文件已展開上傳；27 個文字檔的 Git blob SHA-1 與 E 槽檔案一致
- [ ] 寄送成果至 nikita@agentplace.io，主旨 Application: Backend Engineer；草稿已建立，待擁有者確認收件地址後寄出

## 執行與可用性

目前後端使用獲授權的 Cloudflare 臨時連線：
https://downtown-greg-recorders-husband.trycloudflare.com

它只轉送本作業的 127.0.0.1:43187，不使用既有網站的 3000 埠。既有網站與原本 Cloudflare 程序沒有變更。PID 與工作日誌只保存在被排除的 runtime 目錄。

臨時網址不是永久部署：電腦關機、程序停止或重新建立 tunnel 會影響可用性或網址。正式長期展示可用 Dockerfile 部署於穩定 HTTPS 主機，再更新 Agentplace 的 STORE_API_BASE_URL。實際 token 必須以主機環境變數注入。

## 證據邊界

本機 API 結果、公開 HTTPS 結果與 Agent 實際對話分別記錄。PASS_WITH_API_TRACE 表示回覆已觀察，且同一測試時間窗內有對應 HTTP 紀錄；PASS_RESPONSE_ONLY 僅驗證文字行為，不宣稱後端已呼叫。所有資料均為虛構。

官方作業：https://agentplace.io/careers/backend-engineer
