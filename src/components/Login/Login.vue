<template lang="html">
  <transition name="slide-top">
    <div class="login">

      <i @click="showAbout" class="icon-about" title="关于"></i>
      <a href="https://microzz.com/" target="_blank" title="microzz.com"><i class="icon-website"></i></a>
      <i class="icon-chat"></i>
      <h2>请输入您的名字</h2>
      <input @keyup.enter="login" v-model.trim="name" type="text" autofocus>

      <transition name="showAbout">
        <About v-if="isShowAbout"></About>
      </transition>

    </div>
  </transition>
</template>

<script>
import About from '../About/About.vue';

export default {
  name: 'login',
  components: {
    About
  },
  data() {
    return {
      name: ''
    }
  },
  computed: {
    isShowAbout() {
      return this.$store.state.isShowAbout;
    }
  },
  methods: {
    login() {
      if (this.name === '') {
        return;
      }
      this.$store.commit('changeName', this.name);
      localStorage.name = this.name;
      this.$router.push('Chatting');
    },
    showAbout() {
      this.$store.commit('showAbout', true);
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000000;
    color: #ffffff;

    i.icon-about {
      position: absolute;
      top: 20px;
      right: 80px;
      width: 40px;
      height: 40px;
      background: url('../../common/icons/icon-about.svg') no-repeat;
      background-size: contain;
    }

    i.icon-website {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: url('../../common/icons/icon-website.svg') no-repeat;
      background-size: contain;
      margin-bottom: 30px;
    }
    i.icon-chat {
      width: 60px;
      height: 60px;
      background: url('../../common/icons/icon-chat.svg') no-repeat;
      background-size: contain;
      margin-bottom: 30px;
    }

    h2 {
      letter-spacing: 1px;
    }

    input {
      width: 300px;
      padding: 5px 10px;
      margin-top: 10px;
      background-color: #000000;
      color: #ffffff;
      border-bottom: 1px solid #ffffff;
      text-align: center;
      font-size: 2rem;
      letter-spacing: 2px;
    }
  }
</style>
