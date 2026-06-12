<template>
  <div class="front-layout">
    <nav class="front-navbar">
      <div class="navbar-inner">
        <router-link to="/" class="navbar-brand">Lgm</router-link>
        <div class="navbar-nav" :class="{ 'mobile-open': mobileNavOpen }">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="glass-btn"
            :class="{ active: isActive(item.path) }"
            @click="mobileNavOpen = false"
          >{{ item.label }}</router-link>
        </div>
        <span class="mobile-menu-toggle" @click="mobileNavOpen = !mobileNavOpen">
          <i class="social iconfont icon-list"></i>
        </span>
      </div>
    </nav>
    <main class="front-main">
      <router-view />
    </main>
    <footer class="front-footer">
      <p>&copy; 2026 Lgm. All rights reserved.</p>
      <p class="power">Powered By Vue &amp; Spring Boot</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const mobileNavOpen = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '博客' },
  { path: '/projects', label: '项目' },
  { path: '/resume', label: '简历' },
  { path: '/about', label: '关于' },
  { path: '/guestbook', label: '留言' },
  { path: '/friends', label: '友链' }
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/img/bg-fuji.png');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  position: relative;
}

.front-layout::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.55);
  z-index: 0;
  pointer-events: none;
}

.front-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  font-family: "Old English Text MT", "Engravers' Old English BT", "Lato", sans-serif;
  font-size: 1.5em;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  letter-spacing: 1px;
}

.navbar-brand:hover {
  color: #fff;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  color: #fff;
  font-size: 22px;
  padding: 8px;
}

.front-main {
  flex: 1;
  padding-top: 60px;
  position: relative;
  z-index: 1;
}

.front-footer {
  padding: 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(26, 26, 46, 0.6);
  position: relative;
  z-index: 1;
}

.front-footer p {
  margin: 4px 0;
  font-size: 13px;
}

.front-footer .power {
  font-size: 11px;
  opacity: 0.7;
}

@media all and (max-width: 768px) {
  .mobile-menu-toggle {
    display: block;
  }

  .navbar-nav {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(26, 26, 46, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 10px 20px;
    gap: 6px;
  }

  .navbar-nav.mobile-open {
    display: flex;
  }

  .navbar-nav .glass-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
