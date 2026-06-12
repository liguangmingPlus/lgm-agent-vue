<template>
  <span class="mobile btn-mobile-menu" @click="toggleMobileMenu">
    <i class="social iconfont icon-list btn-mobile-menu__icon" v-show="!mobileMenuVisible"></i>
    <i class="social iconfont icon-angleup btn-mobile-close__icon" v-show="mobileMenuVisible"></i>
  </span>
  <header id="panel" class="panel-cover" :style="coverStyle">
    <div class="panel-main">
      <div class="panel-main__inner panel-inverted">
        <div class="panel-main__content">
          <div class="ih-item circle effect right_to_left iUp">
            <a href="#" class="blog-button" @click.prevent>
              <div class="img">
                <img :src="avatarUrl" alt="avatar" class="js-avatar profilepic" @load="onAvatarLoad" />
              </div>
              <div class="info iUp">
                <div class="info-back">
                  <h2>Be Brave</h2>
                  <p>2026 · 平静</p>
                </div>
              </div>
            </a>
          </div>
          <h1 class="panel-cover__title panel-title iUp">
            <router-link to="/" title="Lgm Home">Lgm</router-link>
          </h1>
          <p class="panel-cover__subtitle panel-subtitle iUp">Code Create Life</p>
          <hr class="panel-cover__divider iUp" />
          <p class="panel-cover__description iUp" v-html="hitokotoText"></p>
          <div class="navigation-wrapper iUp" ref="navWrapperRef">
            <div>
              <nav class="cover-navigation cover-navigation--primary">
                <ul class="navigation">
                  <li class="navigation__item" v-for="nav in navItems" :key="nav.path">
                    <router-link :to="nav.path" class="blog-button glass-btn">{{ nav.label }}</router-link>
                  </li>
                </ul>
              </nav>
            </div>
            <div class="iUp">
              <nav class="cover-navigation navigation--social">
                <ul class="navigation">
                  <li class="navigation__item" v-for="social in socialLinks" :key="social.url">
                    <a :href="social.url" :title="social.title" target="_blank">
                      <i :class="'social iconfont ' + social.icon"></i>
                      <span class="label">{{ social.title }}</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div class="panel-cover--overlay cover-slate"></div>
    </div>
    <div class="remark iUp">
      <p class="power">Powered By Vue &amp; Spring Boot</p>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import homeImg from '@/assets/img/bg-fuji.png'
import avatarImg from '@/assets/img/logo3.jpg'

const hitokotoText = ref('如何得与凉风约, 不共尘沙一并来!<br/><strong>-「中牟道中」</strong>')
const mobileMenuVisible = ref(false)
const navWrapperRef = ref(null)

const avatarUrl = avatarImg

const coverStyle = computed(() => ({
  backgroundImage: `url(${homeImg})`,
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#666',
  backgroundSize: 'cover'
}))

const navItems = [
  { path: '/', label: '首页' },
  { path: '/blog', label: '博客' },
  { path: '/projects', label: '项目' },
  { path: '/resume', label: '简历' },
  { path: '/about', label: '关于' }
]

const socialLinks = [
  { url: 'https://github.com/', title: 'github', icon: 'icon-github' },
  { url: 'http://www.cnblogs.com/', title: 'cnblogs', icon: 'icon-cnblogs' },
  { url: 'https://www.zhihu.com/', title: 'zhihu', icon: 'icon-zhihu' },
  { url: 'mailto:example@gmail.com', title: 'email', icon: 'icon-email' }
]

onMounted(() => {
  fetchHitokoto()
  runIUpAnimation()
})

function fetchHitokoto() {
  fetch('https://v1.hitokoto.cn')
    .then(res => res.json())
    .then(data => {
      if (data.hitokoto && data.from) {
        hitokotoText.value = `${data.hitokoto}<br/><strong>-「${data.from}」</strong>`
      }
    })
    .catch(() => {})
}

function runIUpAnimation() {
  const elements = document.querySelectorAll('.iUp')
  let time = 0
  const duration = 150
  elements.forEach(el => {
    setTimeout(() => {
      el.classList.add('up')
    }, time)
    time += duration
  })
}

function onAvatarLoad(e) {
  e.target.classList.add('show')
}

function toggleMobileMenu() {
  mobileMenuVisible.value = !mobileMenuVisible.value
  const navWrapper = navWrapperRef.value
  if (!navWrapper) return

  if (mobileMenuVisible.value) {
    navWrapper.classList.add('visible', 'animated', 'bounceInDown')
    navWrapper.classList.remove('bounceOutUp')
  } else {
    navWrapper.classList.remove('bounceInDown')
    navWrapper.classList.add('bounceOutUp')
    const handleAnimationEnd = () => {
      navWrapper.classList.remove('visible', 'animated', 'bounceOutUp')
      navWrapper.removeEventListener('animationend', handleAnimationEnd)
    }
    navWrapper.addEventListener('animationend', handleAnimationEnd)
  }
}
</script>

<style scoped>
.panel-cover {
  display: block;
  position: fixed;
  z-index: 900;
  width: 100%;
  max-width: none;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
}

.panel-cover--overlay {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: #000;
  z-index: 1;
  -moz-opacity: .55;
  opacity: .55;
}

.navigation__item .glass-btn {
  padding: 10px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: .9em;
  font-weight: bold;
  letter-spacing: 1px;
  text-shadow: none;
  color: #fff;
  -webkit-font-smoothing: antialiased;
  opacity: .8;
}

.navigation__item .glass-btn:hover {
  opacity: 1;
  color: #fff;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.mobile.btn-mobile-menu {
  display: none;
  position: fixed;
  z-index: 9999;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  height: 35px;
  background: rgba(51, 51, 51, 0.98);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  cursor: pointer;
}

.btn-mobile-menu__icon,
.btn-mobile-close__icon {
  position: relative;
  top: 10px;
  color: #fff;
}

@media all and (max-width: 960px) {
  .mobile.btn-mobile-menu {
    display: block;
  }

  .navigation-wrapper {
    display: none;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    padding: 20px 0;
    background: rgba(51, 51, 51, 0.98);
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
    z-index: 9998;
  }

  .navigation-wrapper.visible {
    display: block;
  }

  .cover-navigation {
    display: block;
    position: relative;
    float: left;
    clear: left;
    width: 100%;
  }

  .cover-navigation .navigation {
    display: block;
    width: 100%;
  }

  .cover-navigation .navigation li {
    width: 80%;
    margin-bottom: .4em;
  }

  .cover-navigation.navigation--social {
    padding-top: 5px;
  }

  .cover-navigation.navigation--social .navigation li {
    display: inline-block;
    width: 20%;
  }

  .navigation__item {
    width: 100%;
    margin: 0 0 .4em 0;
  }

  .panel-main__inner {
    padding: 60px 10%;
  }

  .panel-cover__description {
    display: block;
    max-width: 600px;
    margin: 0 auto;
  }
}

@media all and (max-width: 340px) {
  .panel-main__inner {
    padding: 0 5%;
  }

  .panel-title {
    margin-bottom: .1em;
    font-size: 1.5em;
  }

  .panel-subtitle {
    font-size: .9em;
  }
}
</style>
