# 大トラッカー

[大チェッカー](https://daichkr.hatelabo.jp/)のアンテナの更新履歴をRSSフィードにするウェブサービスです。

## デプロイ

1. はてなのアカウントのIDとパスワードを`.env`に書き込んでください。
    - アンテナの更新履歴はログインしなければ閲覧できないため、はてなアカウントのIDとパスワードを設定する必要があります。
        - [サブアカウント](https://www.hatena.ne.jp/help/account)を使うと便利です。
    - `.env.example`にサンプルがあります。
2. `docker-compose up`でコンテナを起動してください。<http://localhost:3000/>でアプリケーションにアクセスできます。

### Heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## 開発

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up`

## Attributions

- [ロゴマーク](./public/img/logo.svg)は[Material Iconsのrss feedアイコン](https://material.io/icons/#ic_rss_feed)をベースに[大チェッカーのロゴ](https://daichkr.hatelabo.jp/images/daichkr_kun_simple.svg)の意匠を加えたものです。Material Iconsは[Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.txt)の元で配布されています。
