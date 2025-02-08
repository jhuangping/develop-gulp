#!/usr/bin/env sh

# 發生錯誤時執行終止指令
set -e

# 載入 .env 檔案
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# 移動到打包資料夾下，若你有調整的話打包後的資料夾請務必調整
cd dist

# 部署到自定義網域
# echo 'www.example.com' > CNAME

git init
git add -A

TODAY=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "deploy on $TODAY"

# 部署到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# 部署到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages
# 以這個專案來講就要改成這樣以下這樣，下面是走 ssh 模式

git push -f "$GIT_DEPLOY" "$BRANCH"
# 除此之外，也可以改走 HTTPS 模式
# git push -f https://github.com/hsiangfeng/HexfootMusic.git master:gh-pages

cd -