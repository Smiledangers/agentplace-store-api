# 商店庫存與訂單助手

Node.js 22 以上，無外部套件。所有專案檔案放在 `E:\FieldPro\store-agent-demo`。

## 安裝與啟動（PowerShell）

```powershell
Set-Location E:\FieldPro\store-agent-demo
Copy-Item .env.example .env
# 產生本機專用 token，不輸出秘密；寫入被 Git 排除的 .env。
node -e "const fs=require('node:fs'); const key=require('node:crypto').randomBytes(32).toString('hex'); fs.writeFileSync('.env','STORE_API_KEY='+key+'\nHOST=127.0.0.1\nPORT=43187\n');"
npm start
```

不需要執行 npm install。未設定至少 32 字元的 token 時，服務拒絕啟動。

另開 PowerShell 查詢：

```powershell
Set-Location E:\FieldPro\store-agent-demo
$storeToken = (Get-Content .env | Where-Object { $_ -like 'STORE_API_KEY=*' }) -replace '^STORE_API_KEY=', ''
$storeHeaders = @{ Authorization = "Bearer $storeToken" }
Invoke-RestMethod http://127.0.0.1:43187/api/products/P001/inventory -Headers $storeHeaders
Invoke-RestMethod http://127.0.0.1:43187/api/orders/O004/status -Headers $storeHeaders
Invoke-RestMethod http://127.0.0.1:43187/api/products/P004/inventory -Headers $storeHeaders
```

依序會得到無線滑鼠庫存 25、訂單 shipped、藍牙耳機庫存 0 且 available=false。

## API 契約

- `GET /api/products/{productId}/inventory`：P001–P010 為範例商品。
- `GET /api/orders/{orderId}/status`：O001–O010 為範例訂單。
- ID 必須為大寫 P 或 O 加三位數，排除 000；有效格式但不存在（例如 P999）回傳 404。
- 成功：`{"data":{...}}`。失敗：`{"error":{"code":"...","message":"..."}}`。
- 400：ID 無效、缺 ID、未知查詢參數；401：缺少／錯誤 token；404：資料或路由不存在；405：寫入方法不受支援。
- `/health` 與 `/openapi.json` 公開，不回傳秘密。其餘路由一律先檢查 Bearer token。
- 請求只允許 GET，資料從 JSON 載入，無寫入介面。回應禁止快取。完整規格在 `openapi.json`。

這是使用虛構資料的技術展示：共用服務 token 代表 Agent 的唯讀服務權限。沒有實作個別消費者登入或訂單擁有權授權。正式商店若使用真實訂單，需加入使用者驗證與訂單擁有權檢查。

## 重跑測試

```powershell
node --test test/api.test.js
node scripts/record-evidence.js
```

`evidence/api-results.json` 保留 50 個情境的實際 HTTP 狀態與回應。測試另包含設定不足時拒絕啟動；涵蓋全部 20 筆資料、零庫存、不存在資料、無效 ID、授權拒絕與拒絕寫入。測試使用隨機／測試專用 token，不含正式憑證。Agent 對話驗證另見 `docs/agent-tests.json`，API 通過不代表 Agent 通過。

## 部署與 Agentplace

依 `docs/AGENTPLACE.md` 操作。雲端 Agent 無法存取本機 127.0.0.1。必須將此服務部署到具有公開 HTTPS 的主機，或採用平台實際支援且可安全存放憑證的同等方式。

`Dockerfile` 可選用；主機需注入 `STORE_API_KEY`，對外由 HTTPS 反向代理終結 TLS。沒有設定任何付費服務。不要將 .env、token 放到儲存庫、前端、聊天內容或提交信。

## 目前串接與證據

公開儲存庫：https://github.com/Smiledangers/agentplace-store-api

公開 Agent：https://rsauoya2i1d0.run.agentplace.io/

目前臨時 HTTPS API：https://downtown-greg-recorders-husband.trycloudflare.com

本機 50 個 HTTP 情境全部通過；公開 HTTPS 為 49 個 API 契約情境通過，另 1 個損壞網址在 Cloudflare 邊界被 400 攔截。Agent 的 200、404、401 與恢復後 200 已有實際對話及 HTTP 紀錄，詳見 docs/agent-tests.json 與 docs/DELIVERY.md。

服務只使用本作業的 43187 埠。臨時連線需保持本機程序執行；它不是永久部署。標準輸出只記錄時間、方法、路徑及 HTTP 狀態，不記錄授權標頭。runtime、.env 不提交。

審查請以 main 分支的展開原始碼與 JSON 證據為準。根目錄 store-agent-demo.zip 為初始封存，保留歷史狀態；最新本機交付 ZIP 另在 E 槽 delivery 目錄產生。截圖保存在本機 evidence，公開文字證據包含逐筆實際回應與 HTTP 紀錄。
