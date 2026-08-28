# @lovstudio/dsh-plugin-marketplace

[English](README.md) | 中文

面向 Web 设置与侧边栏的本地优先**插件市场**。选中的 provider 把公开仓库元数据同步到各自的 IndexedDB 快照；浏览、搜索、筛选、排序、分页、分类统计、联想和详情随后都只读取该本地快照。浏览器插件在一个共享控制器上注册四项贡献：

- `settings.plugins.tab` 标签页，id 为 `market`（order 20，位于已安装插件清单标签页之后）；
- `sidebar.footer.action` 侧边栏「设置」上方的入口，点击打开插件市场；
- `shell.overlay` 模态层，承载同一个市场界面；
- 以 `ui-plugin-market` 为 key 的 `settings.plugin.item` 卡片，用于选择目录 provider 与启动同步偏好。

三处入口共享一个视图 store，因此在侧边栏浮层与设置标签页之间切换时，搜索、筛选与滚动位置都会保留。

## 安装

本包是一个完整 DSH bundle，同时包含 Host 侧 GitHub provider、严格 Typert Remote 描述、设置注册与浏览器 UI。安装到 `web` profile：

```sh
dsh plugin --profile web add @lovstudio/dsh-plugin-marketplace
```

bundle 会一起插入 `@lovstudio/dsh-plugin-marketplace/host` 与 `@lovstudio/dsh-plugin-marketplace`。浏览器半边自行挂载 `pluginMarketGithub` Remote contribution，因此无需修改 Harness 全局 Remote 装配，也无需重新构建 Web。

## 本地目录同步

`MarketProvider` 是 provider 接口：每个可选来源都必须实现完整初始化、增量同步、按 id 查询详情，以及本地列表、联想和分类投影。`dshfind` provider 通过 `GET /v1/catalog` 初始化。增量同步先读取一行 `GET /v1/plugins` 并比较 `data_version`；版本不变时只推进本地更新时间，版本变化时下载固定版本的完整快照并原子替换 IndexedDB 记录。

`github` provider 通过 Host 侧 `pluginMarketGithub` Remote 搜索 `topic:dsh-plugin`。初始化时，只要 GitHub 报告某个完整 `pushed` 区间超过 1,000 项，就递归二分，再从旧区间到新区间分页抓取每个叶区间。每个 GitHub 请求成功后，同一个 IndexedDB 事务都会提交该响应的 rows 与确切的下一个区间／页游标；事务前中断会重放该请求，事务后中断则从下一个请求恢复。已提交的 staging rows 会立即进入本地列表、详情、联想与分类投影；每当已提交行数增长，当前市场列表都会重新执行它的本地查询。增量同步从上次完成同步实际返回的最大 `pushed_at` 包含式开始，并按 GitHub id 更新仓库；若一次完成扫描没有返回更新的行，则用该轮冻结的扫描上界作为下一游标。只有完整快照成功后才推进目录游标，因此逐请求 staging checkpoint 恢复期间，上一份完整快照仍可查询。Host 每次请求都解析 `GITHUB_TOKEN`，强制使用认证搜索，且不会把 token 返回浏览器。

「设置 > 插件 > 插件配置」中的市场卡片会暂存 `provider` 与 `syncOnStartup`，再在保存时写入 Host 设置文档。GitHub 是默认 provider，因此卡片初次展开就会显示由 `credentials.set({ ref: 'GITHUB_TOKEN' })` 支持的只写 token 字段和 GitHub 官方 token 创建链接；设置文档不保存秘密。保存后 token 草稿会清空，但已配置徽标与可选末四位仍然可见。字段留空会保留已存 token；**测试**会在存在草稿时携带草稿调用 GitHub 的认证 `/user` 端点，否则直接测试已存 token。`syncOnStartup` 默认值为 `true`，每次新应用运行时在设置生效后静默执行一次增量检查。浮层标题区提供同一个同步操作，刷新按钮显示完整本地插件数与相对更新时间；同步期间，同一个按钮会把摘要替换为唯一一组已完成／总数计数，具体失败原因仍显示在按钮旁。列表会区分本地目录为空、正在同步但还在等待首个已提交行，以及非空查询／筛选没有匹配行这三种状态，不再把它们都标记为搜索无结果。

## 搜索、筛选与排序

仅支持关键词的搜索框接受 Google 语法子集：多关键词（AND）、`A OR B`、`-排除`、`"精确短语"`、`field:value` 过滤（`category:`、`owner:`/`author:`、`language:`/`lang:`、`grade:`、`tag:`）以及数值比较 `stars:`/`score:`（`>=`、`>`、`<=`、`<` 或精确值）。查询中的字段过滤会覆盖工具栏中同字段的选择；筛选面板会显示并锁定这些生效值，直至用户编辑搜索文字。

单个正向关键词对应一次本地目录投影；多关键词查询在完整快照上投影前四个词，再按集合逻辑合并并去重候选——AND 词必须全部命中、OR 组任一命中即可、排除词一票否决。最终合并顺序由所选目录排序（`stars`/`updated`/`score`/`name`，升序或降序）决定。分页只切分本地结果，不会访问 provider。

工具栏还支持目录排序（`stars`/`updated`/`score`/`name`，升序或降序）、本地聚合的分类 facet、作者/语言/评级筛选、精选/官方/可安装开关，以及由 Host 清单驱动、针对已加载条目的“已安装”筛选。分页同时使用交叉观察自动加载与显式下一页操作，供内嵌 WebView 和键盘操作使用。

## 质量评估与 Agent 交接

每张卡片与详情弹窗都会展示目录的质量评估：评级（S/A/B/C）、评分（0-100）与风险标记及说明。复制动作产出面向 Agent 的 Markdown：插件唯一 id（`owner/repo`）、紧凑的 `for Agent` 信息块（身份、评估、元数据、安装命令、仓库地址），以及注明当前已加载并纳入多少查询结果的批量信息块。安装与卸载就地执行：卡片与弹窗调用固定到回环地址的 `pluginManager` Remote，后者在被管理的 profile 中运行共享的 pnpm 操作；成功横幅会说明重启要求，并把操作委托给 `ctx.betterRestartUi`，由它 re-boot Host 树，再在替代连接建立后刷新页面。当有 Agent 会话正在运行时，重启仍会先弹出确认对话框（实时轮询活动状态，需勾选确认才会中断）。操作失败时，错误横幅会展示具体问题——有界的 pnpm 输出尾部、远程错误或不可直接安装的原因——并提供复制操作，把插件、命令、状态与错误文本组成 Agent 可直接消费的键值式布局，便于把失败内容粘贴到 issue 或 Agent 提示中修复。已安装徽标来自 Host 侧 `pluginInventory` remote（按包名或探测到的 npm 包名与模块名匹配）。

安装与卸载是经 `pluginManager` Remote 的直接操作；变更在应用重启后生效，成功横幅通过 `better-restart-ui` client 服务请求重启。启停开关尚未实现，仍只做复制引导；已安装插件的启停属于 profile 配置界面。

## 配置

| 字段 | 类型 | 默认值 | 含义 |
|---|---|---|---|
| `baseUrl` | `string` | `https://api.dshfind.com` | 目录 API 基础地址（已发布契约的生产环境）。 |

Host 设置命名空间 `ui-plugin-market` 保存 `provider`（`dshfind` 或 `github`，默认为 `github`）和 `syncOnStartup`（`true`）。`GITHUB_TOKEN` 保存在凭据 provider 中，仅 GitHub 来源要求配置。只有在完整实现全部 `MarketProvider` 操作后，才能把新的 provider id 加入 schema。

## 扩展点

Host 半边注册仅供本包浏览器半边使用的 `pluginMarketGithub` Remote 服务。浏览器半边不声明子槽位；其他插件可以在市场之外继续挂载 `settings.plugins.tab` 标签页或 `shell.overlay` 条目，无需改动本包。搜索管线（`parseMarketQuery`、`mergeAndRank`）导出供其他界面复用。

## Model Experience

无——本包只查询浏览器本地目录，不注册任何模型相关能力；其复制动作产出的 Markdown 供人工转贴到别处。

#### KV Cache effect

无；本包既不组装也不发送 provider 请求。

## Known Limitations and Deferred Work

- **安装/卸载在 Host 侧执行，需重启生效** — 安装与卸载调用固定到回环地址的 `pluginManager` Remote，它在被管理的 profile 中运行 pnpm（等价于 `dsh plugin`）并对账 profile 层列表；变更只有在应用重启后才生效，因此成功横幅把 Host re-boot 与重连后的页面刷新委托给 `ctx.betterRestartUi`。启停开关尚未实现。
- **GitHub 跟踪 push，而非仅修改 topic** — GitHub 增量同步有意只跟随 `pushed`；只添加或移除 `dsh-plugin` 而没有再次 push、删除仓库，或只修改不伴随 push 的元数据，都不会更新或移除缓存行。手动执行 GitHub 全量初始化会重建有 push 记录的仓库，但仍不会包含从未 push 的仓库。
- **多词投影有界** — 只有前四个正向词参与投影；最终合并顺序仍由所选目录排序决定。
- **详情只来自快照** — 详情查询只返回完整 provider 快照中已有的字段。打开弹窗时不会请求 provider 独有的实时增长窗口，以保证普通交互离线可用。
- **已安装徽标可能过期** — 徽标反映 Host 清单快照；它在安装/卸载成功后与 `connection/reset` 时刷新，因此在应用之外安装的插件要等下一次刷新才出现。
- **暂无联想下拉** — 本地联想投影已存在，但尚未接入搜索框。
