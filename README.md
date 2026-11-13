# Agentplace Store API

本儲存庫先以 `store-agent-demo.zip` 保存完整作業，包含後端原始碼、10 筆商品、10 筆訂單、OpenAPI 規格、安裝文件、自動測試與 Agent 實際回覆截圖。解壓縮後即可依其中的 README.md 執行。

## 執行

1. 下載並解壓縮 `store-agent-demo.zip` 到 E 槽。
2. 安裝／使用 Node.js 22 以上，不需要外部套件。
3. 依包內 README.md 建立本機 `.env` 與隨機 `STORE_API_KEY`。
4. 在解壓縮目錄執行 `npm start`，或執行 `npm test` 驗證後端。

預設埠為 43187，避免佔用作者電腦上現有的 3000 埠網站。範例資料均為虛構，服務只允許讀取。

## 已驗證與待完成

- 50 個實際 HTTP 測試情境全部通過。
- 已觀察 6 個 Agent 預覽回覆：尚未連線、缺 ID、無效商品 ID、無效訂單 ID、拒絕修改、拒絕提供 token。
- **尚未完成 Agent 與後端連線、成功與不存在資料的完整對話驗證、實際 401 對話測試。** API 測試通過不代表完整 Agent 串接已完成。
- 私人儲存庫目前只供擁有者存取，尚未作為公開審查連結；尚未寄出申請成果。

This is a work-in-progress delivery archive for the Agentplace Backend Engineer exercise. Extract the ZIP and read `docs/REVIEWER.md` for the English quick start and verification boundaries. No credentials are included.
