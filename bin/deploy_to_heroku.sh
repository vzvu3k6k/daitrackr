#!/bin/sh
# Based on http://qiita.com/enu-kuro/items/5f8a248e029c1a6d0017
set -e

git checkout -b __deploy__
npm run build
git add -f public/
git commit -m "Deploying to Heroku"
git push heroku -f __deploy__:master
git checkout -
git branch -D __deploy__
