# 优品商城 - 带有购买请求功能的商城网页

这是一个现代化的商城网页，包含完整的购买流程功能。

## 功能特点

- 🛒 完整的购物车功能（添加、删除、修改数量）
- 📝 订单提交流程
- 📱 响应式设计，适配各种屏幕尺寸
- 🎨 现代化UI设计，包含动画效果
- 📊 商品分类展示
- 💬 客户评价系统
- 📞 联系我们表单

## 项目结构

```
/web
  /images       # 图片资源文件夹
  index.html    # 主HTML文件
  styles.css    # 样式表文件
  script.js     # JavaScript交互脚本
  README.md     # 项目说明文件
```

## 如何运行

### 方法1：使用VS Code的Live Server扩展

1. 安装[VS Code](https://code.visualstudio.com/)
2. 安装[Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)扩展
3. 打开项目文件夹
4. 右键点击`index.html`文件，选择"Open with Live Server"

### 方法2：使用Python的HTTP服务器

如果您的电脑上安装了Python，可以使用以下命令：

```bash
# 在项目根目录下运行
python -m http.server 8080
```

然后在浏览器中访问 `http://localhost:8080`

### 方法3：使用Node.js的http-server

如果您的电脑上安装了Node.js，可以使用以下命令：

```bash
# 安装http-server（如果尚未安装）
npm install -g http-server

# 在项目根目录下运行
http-server -p 8080
```

然后在浏览器中访问 `http://localhost:8080`

## 技术栈

- HTML5
- CSS3 (使用Flexbox和Grid布局)
- JavaScript (原生JS)
- Font Awesome (图标库)
- Chart.js (图表库，用于未来扩展)

## 注意事项

- 由于是演示项目，实际的支付功能未实现，仅模拟了订单提交流程
- 图片使用占位图，您可以替换为实际的商品图片
- 所有数据（如购物车内容）存储在浏览器的localStorage中

## 未来扩展

- 用户登录注册系统
- 商品详情页面
- 订单管理系统
- 支付集成
- 商品搜索功能

## 联系我们

如有任何问题或建议，请联系：service@youpin.com