---
name: devto-article
description: dev.to 向けの英語技術記事を書く・直す・下書き登録するとき。API キーや特定 bot の運用は含めない。
---
# dev.to 記事

dev.to（https://dev.to）向けの英語技術記事を書く・直すときの一般手順。API キーの置き場、リポジトリのパス、使うモデルなど、環境固有の運用は各アシスタント側の共通ルールに置く。

## いつ読むか

- 新しい dev.to 記事を書く
- LinkedIn など他媒体の英語記事を dev.to 向けに適応する
- 非公開下書きとして API 登録する前後の点検

## 文章規範（英語）

1. 本文は英語。
2. 執筆・推敲の前に次の二つを読む。
   - `english-tech-blog-structure` … 構成、見出し、タイトル、締め、技術的誠実さ
   - `humanizer` … 文単位の AI 口調の除去
3. LinkedIn と内容を共有する場合も、媒体ごとの制約（見出し、カバー画像、シリーズ）だけ差し替え、主張と数字は一致させる。

## front matter（DEV）

ファイル先頭の YAML 例:

```yaml
---
title: Specific claim or payoff
published: false
tags: neo4j, knowledgegraph, llm, cypher, ontology
canonical_url: https://www.linkedin.com/pulse/...
series: Ontographia
---
```

- 下書きは必ず `published: false`。公開フラグを立てる・公開ボタンを押すのは所有者
- `tags` はサイトの慣例に合わせた英小文字。多すぎない（目安 4〜5）
- 他媒体で先に公開した記事を載せるときは `canonical_url` に正規 URL（先に出した LinkedIn 記事など）を入れる
- 連載なら `series` を使い、dev.to のシリーズ機能に載せる

## タイトル・slug

- タイトルは具体的な主張または得られる結果。曖昧な発表調を避ける
- タイトルと URL slug にバージョン番号を入れない
- 連載なら Part N をタイトルに入れてよい

## 記事の型

`english-tech-blog-structure` に従う。dev.to 向けの追加点:

- 冒頭 2〜3 文で問題または結論。メタな予告文で始めない
- 連載なら冒頭にシリーズ位置づけ（他部へのリンク）を置く
- 一般読者向けでは個別 PR より Release・docs・本体リポジトリへのリンクを優先する
- Markdown の表・コードフェンスは使える。Mermaid は環境依存なので、重要な図は画像または簡潔なテキスト図も用意する
- カバー画像を使う場合は権利の確認できるものだけ

## クロスポスト（LinkedIn → dev.to）

よくある順序:

1. LinkedIn で記事を公開する
2. 数日あけて dev.to に載せる
3. dev.to 側の `canonical_url` を LinkedIn 記事にする
4. 本文の主張・数字・限界の書き方を揃える。媒体の挨拶やシリーズ UI だけ変える

逆順（dev.to が先）にする場合は、後から出す側の `canonical_url` を先に出した URL にする。

## API で下書きを置くとき

- 所有者から「dev.to に下書き登録して」と頼まれたときだけ行う
- 作成は未公開（draft）に限定する。公開 API を叩かない
- 登録後は下書き URL または ID を所有者に渡し、公開は所有者に任せる

## 誠実さ

- 誇張しない。限界も書く
- 数字は測定ログや公開ソースにあるものだけ
- 未確定の公開日を約束しない
- コンサル的な CTA を入れない
- 確認していないことを確認したように書かない

## 成功の目安

- `english-tech-blog-structure` と `humanizer` を通している
- front matter が上記の型に合う（少なくとも `published: false`）
- クロスポストなら `canonical_url` が先公開の URL になっている
- トレードオフ、実測、失敗談、再現手順のどれかがある
