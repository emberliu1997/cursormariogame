#!/bin/bash
# 安装 GitHub CLI 的脚本

echo "正在下载 GitHub CLI..."
cd /tmp
curl -L https://github.com/cli/cli/releases/latest/download/gh_2.47.0_macOS_amd64.tar.gz -o gh.tar.gz

if [ -f gh.tar.gz ]; then
    echo "解压中..."
    tar -xzf gh.tar.gz
    echo "安装到 /usr/local/bin (需要密码)..."
    sudo mv gh_*/bin/gh /usr/local/bin/gh
    sudo chmod +x /usr/local/bin/gh
    echo "GitHub CLI 安装完成！"
    gh --version
else
    echo "下载失败，请手动安装："
    echo "1. 访问: https://github.com/cli/cli/releases"
    echo "2. 下载 macOS 版本"
    echo "3. 解压并移动到 PATH"
fi
