# GitHub設定メモ

作成日: 2026-03-12

## 今日やったこと

今日は、`/Users/yokotataiga/Documents/Playground` で作っていたホームページのデータを、GitHub に保存できるように設定しました。

やったことは大きく分けて次の4つです。

1. GitHub で新しいリポジトリを作成した
2. ローカルの作業フォルダを Git で記録できる状態にした
3. GitHub の保存先を `origin` として登録した
4. 作業内容を GitHub に push した

---

## 1. GitHubで作成したリポジトリ

作成した GitHub リポジトリの URL:

```text
https://github.com/s12s088yt21-alt/fukuda-kurien-site.git
```

ブラウザで確認する URL:

```text
https://github.com/s12s088yt21-alt/fukuda-kurien-site
```

---

## 2. 作業フォルダ

GitHub に保存する対象として使ったフォルダ:

```text
/Users/yokotataiga/Documents/Playground
```

ターミナルでは、最初にこのコマンドでフォルダを開きました。

```bash
cd /Users/yokotataiga/Documents/Playground
```

現在の場所を確認するコマンド:

```bash
pwd
```

中のファイルを見るコマンド:

```bash
ls
```

---

## 3. GitHubと接続するために使ったコマンド

まず、GitHub の保存先を `origin` という名前で登録しました。

```bash
git remote add origin https://github.com/s12s088yt21-alt/fukuda-kurien-site.git
```

登録できているか確認するコマンド:

```bash
git remote -v
```

確認結果のイメージ:

```text
origin  https://github.com/s12s088yt21-alt/fukuda-kurien-site.git (fetch)
origin  https://github.com/s12s088yt21-alt/fukuda-kurien-site.git (push)
```

---

## 4. GitHubに送るために使った流れ

### 4-1. 変更を確認

```bash
git status
```

これは、どのファイルが変わったかを見るコマンドです。

### 4-2. 保存したいファイルを選ぶ

```bash
git add index.html style.css
```

これは、Git に「このファイルを保存対象にします」と伝えるコマンドです。

### 4-3. 記録を作る

```bash
git commit -m "ホームページのたたき台を作成"
```

この `ホームページのたたき台を作成` が、コミットメッセージです。

コミットメッセージとは:

- その時に何をしたかの記録名
- セーブポイントにつけるタイトルのようなもの

### 4-4. GitHubに送る

```bash
git push -u origin main
```

このコマンドで、ローカルの記録を GitHub に送ります。

`-u` は、今後 `main` ブランチを `origin/main` とひもづけるための設定です。

---

## 5. 途中で出てきた認証について

`git push` の途中で、ターミナルに次のような表示が出ました。

```text
Username for 'https://github.com':
```

ここには GitHub のユーザー名を入力しました。

今回入力したもの:

```text
s12s088yt21-alt
```

その次に、次のような表示が出ました。

```text
Password for 'https://s12s088yt21-alt@github.com':
```

ここでは、GitHub のログインパスワードではなく、**Personal Access Token** を使う形で案内しました。

---

## 6. Personal Access Token について

HTTPS で GitHub に push するときは、パスワードの代わりにトークンを使うことがあります。

今日案内した内容:

1. GitHub にログイン
2. `Settings` を開く
3. `Developer settings` を開く
4. `Personal access tokens`
5. `Tokens (classic)`
6. `Generate new token (classic)`
7. `repo` 権限をつけて作成

そのあと、表示されたトークンをターミナルの Password 欄に貼り付けて Enter を押す、という流れで進めました。

注意:

- トークンは他人に見せない
- スクリーンショットに写さない
- メッセージで送らない
- もし漏れたかもと思ったら GitHub 側で削除する

---

## 7. 最終的に確認できた状態

確認時点では、以下の状態になっていました。

### リモート設定

```text
origin  https://github.com/s12s088yt21-alt/fukuda-kurien-site.git (fetch)
origin  https://github.com/s12s088yt21-alt/fukuda-kurien-site.git (push)
```

### コミット状態

```text
3464acd (HEAD -> main, origin/main) ホームページのたたき台を作成
```

これの意味:

- `main` にいる
- `origin/main` と同じ場所まで進んでいる
- つまり GitHub への push は成功している

---

## 8. その時点でまだ GitHub に送っていなかったファイル

確認時点で、次のファイルは未追跡でした。

```text
script.js
styles.css
```

これは「まだ `git add` していないファイル」という意味です。

今回のホームページでは使っていなかったため、必ずしも GitHub に送る必要はない状態でした。

---

## 9. 今後 GitHub に保存するときの基本手順

今後また変更したときは、基本的に次の3つを順番に行えば大丈夫です。

```bash
git add .
git commit -m "変更内容を書く"
git push
```

意味:

- `git add .`  
  変更したファイルを保存対象に入れる

- `git commit -m "変更内容を書く"`  
  その時の作業内容に名前をつけて記録する

- `git push`  
  GitHub に送る

---

## 10. 中学生向けの覚え方

3つを簡単に言うとこうです。

- `git add` = 保存したいものを選ぶ
- `git commit` = 名前をつけて記録する
- `git push` = GitHub に送る

たとえると:

- `git add` = 提出するプリントを机に出す
- `git commit` = 「社会の宿題 3/12」とタイトルを書く
- `git push` = 先生に提出する

---

## 11. 補足

今日の時点では、GitHub への接続設定は完了しています。

そのため次回からは、同じフォルダであれば基本的に次のように進めれば保存できます。

```bash
cd /Users/yokotataiga/Documents/Playground
git add .
git commit -m "変更内容を書く"
git push
```

もし `Username` や `Password` をまた聞かれた場合は、GitHub の認証情報の再入力が必要なことがあります。
