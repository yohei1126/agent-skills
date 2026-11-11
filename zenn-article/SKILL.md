---
name: zenn-article
description: Plan, write, and revise Japanese technical articles for Zenn (zenn.dev), including html-embed HTML/CSS diagrams. Do not include repo names, model names, or bot-specific ops.
---
# Zenn 記事

Zenn（https://zenn.dev）向けの日本語技術記事を書く・直すときの一般手順。リポジトリのパス、使うモデル、どの worker が本文を書くかなど、環境固有の運用は各アシスタント側の共通ルールに置く。

## いつ読むか

- 新しい Zenn 記事を書く
- 既存の Zenn 原稿を推敲する

## 文章規範

1. 本文は日本語。
2. 執筆・推敲の前に Cursor 管理スキル `japanese-tech-writing` を読み、その規範に従う。
3. 柔らかいです・ます調を基本とする。
4. 要点（詳細は `japanese-tech-writing`）:
   - 結論またはその段落の主題を先に。一段落一トピック。短い文
   - 用語・表記を一貫させる
   - LLM っぽい空句を書かない（「重要なのは」「本章では〜を扱う」「正面から」など）
   - 翻訳調の比喩・擬人化を書かない
   - イ形容詞＋です（「難しいです」）を書かない
   - 太字は論理の要所に限り、一節に一〜二箇所まで

## ファイルと front matter

- ファイル名の目安: `YYYY-MM-DD-slug.md`（slug は英小文字・ハイフン）
- front matter の型:

```yaml
---
title: "…"
emoji: "🔬"
type: "tech"
topics: ["tag1", "tag2", "tag3"]
published: false
---
```

- `type` は技術記事なら `tech`
- `topics` は 5 個以内が目安。英語小文字
- 下書きは `published: false`。公開フラグを立てるのは所有者が明示したときだけ

## タイトル・slug

- 発見・論点を先頭に置く
- タイトルと slug にバージョン番号を入れない（バージョンは本文で触る）
- 連載ならタイトルに「第N部」を入れてよい

## 記事の型

### 冒頭

結論または問題を先に書く。「本記事では〜を紹介します」だけで始めない。

### 単発

1. 何の問題か
2. どう動くか（仕組み）
3. 捨てた選択肢と理由
4. 手元で試す方法、または次の一歩
5. 必要なら失敗と限界

### 連載

- 大きな連載は Problem / Design / Build などの一貫した型を維持する
- 連載なら冒頭に位置づけ（各部の表と前後リンク）を置く。Zenn では `:::message` が使える
- 記事は結果と論点を伝え、長い表・手順・全数字は docs やリリースページへ誘導する
- 一般読者向け記事では、個別の Pull Request へのリンクより、Release・docs・本体リポジトリへのリンクを優先する

### 見出しと締め

- 見出しは節が答える問い、または扱う対象。「背景」「まとめ」だけの見出しにしない
- 見出しで結論のオチを言い切らない
- 締めは有用な次の一手。直前の要約の繰り返しで終わらない

## 図（html-embed）

Zenn は 2026-11-11 から、コードブロックの言語名を `html-embed` にすると HTML と CSS をその場で図として表示する（Beta）。図が要る記事では、画像や mermaid より先にこれを検討する。仕様は変わりうるので、書く前に [Zenn の Markdown 記法一覧](https://zenn.dev/zenn/articles/markdown-guide)の「HTML/CSS の埋め込み」を確認する。

- 中身は HTML と `<style>` だけ。`<html>`・`<head>`・`<body>` は書かない
- JavaScript、イベントハンドラ、リンクでのページ移動、フォームは使えない。動きは CSS アニメーションや `:hover`、タブや開閉は checkbox・radio の `:checked` で作る
- 外部 CSS・`@import`・Web フォントは読み込まれない。画像 URL は使えるが、実在の URL だけを使い alt を付ける
- 1ブロック 50KB 以内、表示の高さは 500px まで。幅は PC で約 700px、スマホで約 340px なので、`@media (max-width: 640px)` で縦並びにするなどしてはみ出さないようにする
- ダークモードでは `[data-theme="dark"]` で色を切り替え、背景色を明示してコントラストを取る
- 文字は 12px 以上、色だけに頼らずラベルでも区別する。アニメーションは `prefers-reduced-motion: reduce` で止める
- Zenn や他サービスの画面を装う表示、誤解させる表示、激しい点滅は書かない
- 下書き後は `npx zenn preview` か Zenn のプレビューで、ライト・ダーク、PC・スマホ幅の表示を確認する

## 誠実さ

- 誇張しない。限界も書く
- 数字は測定ログや公開ソースにあるものだけ。1回計測なら「1回の結果」と書く
- 未確定の公開日を約束しない
- 確認していないことを確認したように書かない
- コンサル的な CTA を入れない

## プレビュー

Zenn CLI を使う場合の目安:

```bash
npm install
npx zenn preview
```

## 成功の目安

- トレードオフ、実測、失敗談、再現手順のどれかがある
- front matter とファイル名が Zenn の型に合う
- `japanese-tech-writing` の禁止表現が残っていない
