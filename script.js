// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 购物车相关元素
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBtn = document.querySelector('.cart-btn');
    const closeCart = document.getElementById('closeCart');
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // 模态框相关元素
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const orderSuccessModal = document.getElementById('orderSuccessModal');
    const backToShop = document.getElementById('backToShop');
    const viewOrder = document.getElementById('viewOrder');
    
    // 登录相关元素
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const showLoginForm = document.getElementById('showLoginForm');
    
    // 用户菜单相关元素
    const userMenu = document.getElementById('userMenu');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userMenuDropdown = document.querySelector('.user-menu-dropdown');
    const loggedUsername = document.getElementById('loggedUsername');
    const logoutBtn = document.getElementById('logoutBtn');
    const myOrdersBtn = document.getElementById('myOrdersBtn');
    
    // 订单相关元素
    const orderModal = document.getElementById('orderModal');
    const closeOrderModal = document.getElementById('closeOrderModal');
    const orderList = document.getElementById('orderList');
    
    // 导航相关元素
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenu = document.getElementById('closeMenu');
    const backToTop = document.getElementById('backToTop');
    
    // 表单相关元素
    const contactForm = document.getElementById('contactForm');
    const checkoutForm = document.getElementById('checkoutForm');
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    const orderTotal = document.getElementById('orderTotal');
    
    // 数据
    let cart = [];
    let currentUser = null;
    let users = [];
    let orders = [];
    
    // 加载本地存储的数据
    loadCart();
    loadUsers();
    loadOrders();
    checkLoggedIn();
    
    // 添加到购物车按钮点击事件
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            addToCart(productId, productName, productPrice, productImage);
            showCartNotification('已成功加入购物车！');
        });
    });
    
    // 打开购物车侧边栏
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartSidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭购物车侧边栏
    closeCart.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // 打开结算模态框
    checkoutBtn.addEventListener('click', function() {
        cartSidebar.classList.remove('open');
        checkoutModal.classList.add('open');
        updateOrderSummary();
    });
    
    // 关闭结算模态框
    closeCheckoutModal.addEventListener('click', function() {
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // 提交订单表单
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 收集表单数据
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            payment: document.getElementById('payment').value,
            remark: document.getElementById('remark').value,
            items: cart
        };
        
        // 保存订单
        const order = saveOrder(formData);
        
        // 模拟提交订单
        console.log('订单数据:', formData);
        
        // 清空购物车
        cart = [];
        saveCart();
        updateCartUI();
        
        // 关闭结算模态框，打开成功模态框
        checkoutModal.classList.remove('open');
        orderSuccessModal.classList.add('open');
        
        // 重置表单
        this.reset();
    });
    
    // 返回商城按钮
    backToShop.addEventListener('click', function() {
        orderSuccessModal.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // 查看订单按钮
    viewOrder.addEventListener('click', function() {
        orderSuccessModal.classList.remove('open');
        document.body.style.overflow = '';
        openOrderModal();
    });
    
    // 登录按钮点击事件
    loginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openLoginModal();
    });
    
    // 打开登录模态框
    function openLoginModal() {
        loginModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭登录模态框
    closeLoginModal.addEventListener('click', function() {
        loginModal.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // 切换到注册表单
    showRegisterForm.addEventListener('click', function() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });
    
    // 切换到登录表单
    showLoginForm.addEventListener('click', function() {
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // 登录表单提交
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        const user = login(username, password);
        
        if (user) {
            currentUser = user;
            updateUserUI();
            loginModal.classList.remove('open');
            document.body.style.overflow = '';
            
            if (rememberMe) {
                localStorage.setItem('rememberedUser', JSON.stringify(user));
            } else {
                localStorage.removeItem('rememberedUser');
            }
            
            showNotification('登录成功！欢迎回来，' + user.username);
        } else {
            showNotification('用户名或密码错误，请重试', 'error');
        }
        
        this.reset();
    });
    
    // 注册表单提交
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const phone = document.getElementById('regPhone').value;
        
        // 验证密码是否一致
        if (password !== confirmPassword) {
            showNotification('两次输入的密码不一致', 'error');
            return;
        }
        
        // 验证用户名是否已存在
        if (users.some(user => user.username === username)) {
            showNotification('用户名已存在，请选择其他用户名', 'error');
            return;
        }
        
        // 创建新用户
        const newUser = {
            id: Date.now().toString(),
            username: username,
            password: password, // 在实际应用中应该加密存储
            phone: phone,
            registeredAt: new Date().toISOString()
        };
        
        // 添加用户并保存
        users.push(newUser);
        saveUsers();
        
        // 自动登录新用户
        currentUser = newUser;
        updateUserUI();
        loginModal.classList.remove('open');
        document.body.style.overflow = '';
        
        showNotification('注册成功！欢迎加入我们，' + username);
        
        this.reset();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });
    
    // 用户菜单按钮点击事件
    userMenuBtn.addEventListener('click', function() {
        userMenuDropdown.classList.toggle('show');
    });
    
    // 退出登录按钮点击事件
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });
    
    // 我的订单按钮点击事件
    myOrdersBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openOrderModal();
    });
    
    // 打开订单模态框
    function openOrderModal() {
        orderModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // 加载用户订单
        loadUserOrders();
    }
    
    // 关闭订单模态框
    closeOrderModal.addEventListener('click', function() {
        orderModal.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // 登录函数
    function login(username, password) {
        return users.find(user => user.username === username && user.password === password);
    }
    
    // 退出登录函数
    function logout() {
        currentUser = null;
        updateUserUI();
        userMenuDropdown.classList.remove('show');
        localStorage.removeItem('rememberedUser');
        showNotification('已成功退出登录');
    }
    
    // 检查用户是否已登录
    function checkLoggedIn() {
        // 检查是否有记住的用户
        const rememberedUser = localStorage.getItem('rememberedUser');
        if (rememberedUser) {
            const user = JSON.parse(rememberedUser);
            // 验证用户是否存在
            const existingUser = users.find(u => u.id === user.id && u.username === user.username);
            if (existingUser) {
                currentUser = existingUser;
            }
        }
        
        updateUserUI();
    }
    
    // 更新用户界面
    function updateUserUI() {
        if (currentUser) {
            // 显示用户菜单，隐藏登录按钮
            userMenu.style.display = 'block';
            loginBtn.style.display = 'none';
            loggedUsername.textContent = currentUser.username;
        } else {
            // 显示登录按钮，隐藏用户菜单
            userMenu.style.display = 'none';
            loginBtn.style.display = 'block';
        }
    }
    
    // 加载用户订单
    function loadUserOrders() {
        if (!currentUser) {
            // 如果用户未登录，显示登录提示
            orderList.innerHTML = `
                <div class="empty-orders">
                    <i class="fa fa-user"></i>
                    <p>请先登录查看您的订单</p>
                    <button id="orderLoginBtn" class="btn btn-primary">立即登录</button>
                </div>
            `;
            
            document.getElementById('orderLoginBtn').addEventListener('click', function() {
                orderModal.classList.remove('open');
                openLoginModal();
            });
            return;
        }
        
        // 获取当前用户的订单
        const userOrders = orders.filter(order => order.userId === currentUser.id);
        
        if (userOrders.length === 0) {
            // 如果用户没有订单
            orderList.innerHTML = `
                <div class="empty-orders">
                    <i class="fa fa-file-text-o"></i>
                    <p>您还没有任何订单</p>
                    <a href="#featured" class="btn btn-secondary">去购物</a>
                </div>
            `;
        } else {
            // 显示用户订单列表
            orderList.innerHTML = '';
            
            // 按时间倒序排序订单
            userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .forEach(order => {
                    const orderElement = document.createElement('div');
                    orderElement.className = 'order-item';
                    
                    // 确定订单状态显示文本
                    let statusText = '待付款';
                    let statusClass = 'pending';
                    if (order.status === 'paid') {
                        statusText = '待发货';
                        statusClass = 'pending';
                    } else if (order.status === 'shipped') {
                        statusText = '已发货';
                        statusClass = 'shipped';
                    } else if (order.status === 'delivered') {
                        statusText = '已送达';
                        statusClass = 'delivered';
                    }
                    
                    // 计算订单总价
                    const totalPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                    
                    // 构建订单HTML
                    orderElement.innerHTML = `
                        <div class="order-header">
                            <div class="order-number">订单号：${order.orderId}</div>
                            <div class="order-status ${statusClass}">${statusText}</div>
                        </div>
                        <div class="order-time">下单时间：${new Date(order.createdAt).toLocaleString()}</div>
                        <div class="order-items">
                            ${order.items.map(item => `
                                <div class="order-product">
                                    <div class="order-product-image">
                                        <img src="${item.image}" alt="${item.name}">
                                    </div>
                                    <div class="order-product-info">
                                        <div class="order-product-name">${item.name}</div>
                                        <div class="order-product-details">¥${item.price.toFixed(2)} x ${item.quantity}</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="order-total">
                            共${order.items.reduce((sum, item) => sum + item.quantity, 0)}件商品 合计：¥${totalPrice.toFixed(2)}
                        </div>
                    `;
                    
                    orderList.appendChild(orderElement);
                });
        }
    }
    
    // 保存订单
    function saveOrder(orderData) {
        if (!currentUser) return;
        
        const order = {
            orderId: 'ORD' + Date.now(),
            userId: currentUser.id,
            items: orderData.items,
            totalAmount: orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            status: 'paid', // 假设支付成功
            createdAt: new Date().toISOString(),
            shippingInfo: {
                name: orderData.name,
                phone: orderData.phone,
                address: orderData.address,
                payment: orderData.payment,
                remark: orderData.remark
            }
        };
        
        orders.push(order);
        saveOrders();
        return order;
    }
    
    // 加载本地存储的用户数据
    function loadUsers() {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            users = JSON.parse(savedUsers);
        } else {
            // 添加一些示例用户数据
            users = [
                {
                    id: '1',
                    username: 'demo',
                    password: 'demo123',
                    phone: '13800138000',
                    registeredAt: new Date().toISOString()
                }
            ];
            saveUsers();
        }
    }
    
    // 保存用户数据到本地存储
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // 加载本地存储的订单数据
    function loadOrders() {
        const savedOrders = localStorage.getItem('orders');
        if (savedOrders) {
            orders = JSON.parse(savedOrders);
        } else {
            // 如果没有订单数据，初始化一个空数组
            orders = [];
        }
    }
    
    // 保存订单数据到本地存储
    function saveOrders() {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
    
    // 显示通知
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 设置通知样式
        notification.style.position = 'fixed';
        notification.style.top = '80px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '10000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        notification.style.transform = 'translateY(-20px)';
        
        // 根据类型设置颜色
        if (type === 'success') {
            notification.style.backgroundColor = '#4caf50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        }
        
        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // 3秒后隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // 完全隐藏后移除元素
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 打开移动端菜单
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭移动端菜单
    closeMenu.addEventListener('click', function() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // 移动端菜单链接点击事件
    document.querySelectorAll('.mobile-menu-content a').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
    
    // 联系我们表单提交
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('感谢您的留言，我们会尽快回复您！');
        this.reset();
    });
    
    // 监听滚动事件，显示/隐藏返回顶部按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    });
    
    // 返回顶部按钮点击事件
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 添加商品到购物车
    function addToCart(id, name, price, image) {
        // 检查商品是否已在购物车中
        const existingItemIndex = cart.findIndex(item => item.id === id);
        
        if (existingItemIndex > -1) {
            // 如果已存在，增加数量
            cart[existingItemIndex].quantity++;
        } else {
            // 如果不存在，添加新商品
            cart.push({
                id: id,
                name: name,
                price: price,
                quantity: 1,
                image: image
            });
        }
        
        // 保存购物车数据并更新UI
        saveCart();
        updateCartUI();
    }
    
    // 从购物车中删除商品
    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }
    
    // 更新购物车中商品的数量
    function updateQuantity(id, newQuantity) {
        if (newQuantity < 1) return;
        
        const itemIndex = cart.findIndex(item => item.id === id);
        if (itemIndex > -1) {
            cart[itemIndex].quantity = parseInt(newQuantity);
            saveCart();
            updateCartUI();
        }
    }
    
    // 保存购物车数据到本地存储
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // 从本地存储加载购物车数据
    function loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartUI();
        }
    }
    
    // 更新购物车UI
    function updateCartUI() {
        // 更新购物车数量显示
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // 更新购物车列表
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <i class="fa fa-shopping-cart"></i>
                    <p>购物车是空的</p>
                    <a href="#featured" class="btn btn-secondary">去购物</a>
                </div>
            `;
            checkoutBtn.disabled = true;
            cartTotal.textContent = '¥0';
        } else {
            cartItems.innerHTML = '';
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">¥${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}"><i class="fa fa-trash"></i> 删除</button>
                    </div>
                `;
                
                cartItems.appendChild(cartItem);
            });
            
            // 更新总价
            cartTotal.textContent = `¥${totalPrice.toFixed(2)}`;
            checkoutBtn.disabled = false;
            
            // 添加数量调整按钮事件
            document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const itemIndex = cart.findIndex(item => item.id === id);
                    if (itemIndex > -1 && cart[itemIndex].quantity > 1) {
                        updateQuantity(id, cart[itemIndex].quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    const itemIndex = cart.findIndex(item => item.id === id);
                    if (itemIndex > -1) {
                        updateQuantity(id, cart[itemIndex].quantity + 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', function() {
                    const id = this.getAttribute('data-id');
                    const newQuantity = parseInt(this.value);
                    if (!isNaN(newQuantity)) {
                        updateQuantity(id, Math.max(1, newQuantity));
                    }
                });
            });
            
            // 添加删除按钮事件
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    removeFromCart(id);
                });
            });
        }
    }
    
    // 更新订单摘要
    function updateOrderSummary() {
        orderSummaryItems.innerHTML = '';
        let totalPrice = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
            const summaryItem = document.createElement('div');
            summaryItem.className = 'order-summary-item';
            summaryItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>¥${itemTotal.toFixed(2)}</span>
            `;
            
            orderSummaryItems.appendChild(summaryItem);
        });
        
        orderTotal.textContent = `¥${totalPrice.toFixed(2)}`;
    }
    
    // 显示购物车通知
    function showCartNotification(message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 设置样式
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4caf50';
        notification.style.color = 'white';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '10000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        notification.style.transform = 'translateY(-20px)';
        
        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // 3秒后隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            
            // 完全隐藏后移除元素
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // 点击模态框外部关闭模态框
    window.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('open');
            document.body.style.overflow = '';
        }
        if (e.target === orderSuccessModal) {
            orderSuccessModal.classList.remove('open');
            document.body.style.overflow = '';
        }
        if (e.target === loginModal) {
            loginModal.classList.remove('open');
            document.body.style.overflow = '';
        }
        if (e.target === orderModal) {
            orderModal.classList.remove('open');
            document.body.style.overflow = '';
        }
        if (e.target === mobileMenu && e.target !== mobileMenu.querySelector('.mobile-menu-content')) {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        }
        // 点击用户菜单外部关闭下拉菜单
        if (!e.target.closest('.user-menu')) {
            userMenuDropdown.classList.remove('show');
        }
    });
    
    // 模拟图片加载失败时显示占位图
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/400x300?text=商品图片';
        });
    });
});