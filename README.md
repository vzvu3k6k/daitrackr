# 大トラッカー

[大チェッカー](https://daichkr.hatelabo.jp/)のアンテナの更新履歴をRSSフィードにするウェブサービスです。

## Herokuへのデプロイ手順

動作に必要な環境変数とアドオンは`app.json`に記述されているため、下記のDeploy to Herokuボタンからアプリケーションをデプロイすることができます。ただし、アセットは別途にローカルでビルドしてデプロイする必要があります。

1. [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)ボタンでアプリケーションをデプロイする。
  - アンテナの更新履歴はログインしなければ閲覧できないため、はてなアカウントのIDとパスワードを設定する必要があります。
  - [サブアカウント](https://www.hatena.ne.jp/help/account)を使うと便利です。
1. このリポジトリをクローンして、Herokuのリモートリポジトリを`heroku`として追加して、`npm install --only=dev && ./bin/deploy_to_heroku.sh`を実行する。

## Attributions

- [ロゴマーク](./public/img/logo.svg)は[Material Iconsのrss feedアイコン](https://material.io/icons/#ic_rss_feed)をベースに[大チェッカーのロゴ](https://daichkr.hatelabo.jp/images/daichkr_kun_simple.svg)の意匠を加えたものです。Material Iconsは[Apache License Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.txt)の元で配布されています。
