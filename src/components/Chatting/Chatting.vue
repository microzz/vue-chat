<template lang="html">

  <transition name="slide-left">
    <div class="chatting">

      <!-- 聊天界面头部 -->
      <div class="chatting-header">

        <div class="chatting-back">
          <i @click="$router.push('/AI')" :class="[isRedAI ? 'icon-back' : 'icon-back2']"></i>
        </div>
        <div class="chatting-title">
          <h2><i class="icon-group"></i>群聊</h2>
        </div>
        <div class="chatting-menu">
          <i @click="$router.push('/')" class="icon-menu"></i>
        </div>

      </div>

      <!-- 聊天内容区域 -->
      <div @click.stop.prevent="isShowEmoji=false" ref="chattingContent" class="chatting-content">

        <div v-for="item of msgs">
          <div v-if="item.self" class="chatting-item self clearfix">
            <div class="msg-date">
              {{ item.date }}
            </div>
            <div class="msg-from">
              <span class="loc">[{{item.loc}}]</span>
              <span class="msg-author">{{ item.from}}</span>
              <img :src="item.avatarUrl" alt="">
            </div>
            <div class="msg-content">{{ item.content }}</div>
          </div>

          <div v-else class="chatting-item other clearfix">
            <div class="msg-date">
              {{ item.date }}
            </div>
            <div class="msg-from">
              <img :src="item.avatarUrl" alt="">
              <span class="loc">[{{item.loc}}]</span>
              <span class="msg-author">{{ item.from }}</span>
            </div>
            <div class="msg-content">{{ item.content }}</div>
          </div>

        </div>

        <!-- <div class="online">
          microzz上线了
        </div> -->

      </div>

      <!-- 输入区域 -->
      <div class="chatting-input">

        <transition name="slide-bottom">
          <div v-show="isShowEmoji" class="emoji-display">
            <ul>
              <li @click="insertText(item)" v-for="item of emojis">{{item}}</li>
            </ul>
          </div>
        </transition>


        <div class="emoji">
          <i @click="showEmoji(isShowEmoji=!isShowEmoji);" class="icon-emoji"></i>
        </div>
        <textarea @keyup.enter="send" @input="newLine" ref="textarea" v-model.trim="inputContent" placeholder="左上角还有智能机器人哦"></textarea>
        <button @click="send">发送</button>
      </div>

    </div>
  </transition>

</template>

<script>
export default {
  name: 'chatting',
  data() {
    return {
      msgs: localStorage.msgs_group && JSON.parse(localStorage.msgs_group) || [
        // { date: '2015-11-09 09:57:08', loc: '江西省南昌市', from: 'microzz', avatarUrl: `https://icdn.microzz.com/20170426_vue_chat/icon-avatar${this.random(11)}.svg`, content: 'test', self: false}
      ],
      inputContent: '',
      oContent: {},
      oTextarea: {},
      emojis: ['😂', '🙏', '😄', '😏', '😇', '😅', '😌', '😘', '😍', '🤓', '😜', '😎', '😊', '😳', '🙄', '😱', '😒', '😔', '😷', '👿', '🤗', '😩', '😤', '😣', '😰', '😴', '😬', '😭', '👻', '👍', '✌️', '👉', '👀', '🐶', '🐷', '😹', '⚡️', '🔥', '🌈', '🍏', '⚽️', '❤️', '🇨🇳'],
      isShowEmoji: false,
      isRedAI: false
    }
  },
  watch: {
    msgs(val) {
      localStorage.msgs_group = JSON.stringify(val);
    }
  },
  computed: {
    name() {
      return this.$store.state.name;
    },
    avatarUrl() {
      return this.$store.state.avatarUrl;
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!localStorage.name) {
      next('/')
    } else {
      next();
    }
  },
  mounted() {
    setInterval(() => this.isRedAI = !this.isRedAI, 2500);

    this.oContent = document.querySelector('.chatting-content');
    this.oContent.scrollTop = this.oContent.scrollHeight;
    this.oTextarea = document.querySelector('textarea');

    socket.emit('online', this.$store.state.name);

    socket.on('online', (name) => {
      if (!name) {
        return;
      }
      let oOnline = document.createElement('div');
      oOnline.className = 'online';
      oOnline.innerText = name + '上线了';
      this.oContent.appendChild(oOnline);
      this.oContent.scrollTop = this.oContent.scrollHeight;


    });

    // 接收群聊消息
    socket.on('receiveGroupMsg', data => {
      this.msgs.push(data);
      setTimeout(() => {
        this.oContent.scrollTop = this.oContent.scrollHeight;
      }, 0);
    });

    this.oContent.scrollTop = this.oContent.scrollHeight;
  },
  methods: {
    send() {
      this.isShowEmoji = false;
      if (this.inputContent === '') {
        return;
      } else {
        socket.emit('sendGroupMsg', {
          date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          loc: localStorage.addr,
          from: `${localStorage.name}`,
          content: this.inputContent,
          avatarUrl: this.avatarUrl
        });
        this.msgs.push({
          date: this.moment().format('YYYY-MM-DD HH:mm:ss'),
          loc: localStorage.addr,
          from: `${localStorage.name}`,
          content: this.inputContent,
          self: true,
          avatarUrl: this.avatarUrl
        });
        this.inputContent = '';
        setTimeout(() => this.oContent.scrollTop = this.oContent.scrollHeight, 0);
      };
    },

    showEmoji(flag) {
      this.isShowEmoji = flag;
    },

    insertText(str) {
      str = str + ` `;
      const oTextarea = this.$refs.textarea;

      if (document.selection) {

        let sel = document.selection.createRange();

        sel.text = str;

      } else if (typeof oTextarea.selectionStart === 'number' && typeof oTextarea.selectionEnd ==='number') {

        let startPos = oTextarea.selectionStart;
        let endPos = oTextarea.selectionEnd;
        let cursorPos = startPos;
        let tempVal = oTextarea.value;
        this.inputContent = tempVal.substring(0, startPos) + str + tempVal.substring(startPos, tempVal.length)
        cursorPos += str.length;
        oTextarea.selectionStart = oTextarea.selectionEnd = cursorPos;

      } else {
        oTextarea.value += str;
      }
      this.newLine();
    },

    newLine() {
      setTimeout(() => this.oTextarea.scrollTop = this.oTextarea.scrollHeight, 0);
    }
  }
}
</script>

<style lang="scss" scoped>
  $blue: #2196f3;

  .chatting {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    .chatting-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      width: 100%;
      background-color: $blue;
      color: white;
      padding-left: 10px;
      padding-right: 15px;

      .chatting-back {
        width: 32px;
        height: 32px;
        .icon-back {
          background: url('../../common/icons/icon-ai.svg') no-repeat;
          background-size: contain;
        }
        .icon-back2 {
          background: url('../../common/icons/icon-ai2.svg') no-repeat;
          background-size: contain;
        }
      }

      .chatting-title {
        i.icon-group {
          vertical-align: top;
          width: 30px;
          height: 30px;
          background: url('../../common/icons/icon-group.svg') no-repeat;
          background-size: contain;
          margin-right: 3px;
        }
      }

      .chatting-menu {
        width: 30px;
        height: 30px;
        i.icon-menu {
          background: url('../../common/icons/icon-index.svg') no-repeat;
          background-size: contain;
        }
      }
    }

    .chatting-content {
      flex: 1;
      width: 100%;
      background-color: rgba(0, 0, 0, .1);
      overflow: auto;
      .chatting-item {
        padding: 10px;
        width: 100%;
        .msg-date {
          text-align: center;
          color: gray;
          font-size: 80%;
        }
        .msg-from {
          display: flex;
          align-items: center;
          span.loc {
            color: gray;
            font-size: 60%;
            margin-right: 5px;
          }
          .msg-author {
            font-size: 1.2rem;
          }
          img {
            width: 30px;
            height: 30px;
            border-radius: 15px;
          }
        }
        .msg-content {
          margin-top: 5px;
          background-color: white;
          width: 200px;
          padding: 6px 10px;
          border-radius: 10px;
        }
      }

      .chatting-item + .chatting-item {
        margin-top: 10px;
      }
      .self {
        .msg-from {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          img {
            margin-left: 10px;
          }
        }

        .msg-content {
          float: right;
          word-wrap: break-word;
          word-break: break-all;
          margin-right: 10px;
        }


      }

      .other {
        .msg-from {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          span.loc {
            color: gray;
            font-size: 60%;
            margin-right: 5px;
          }
          img {
            margin-right: 10px;
          }
        }

        .msg-content {
          float: left;
          margin-left: 10px;
          word-wrap: break-word;
          word-break: break-all;
        }

      }

      .online {
        width: 200px;
        // max-width: 100%;
        margin: 3px auto;
        border-radius: 4px;
        text-align: center;
        background-color: #FFFDE7;
      }


    }

    .chatting-input {
      position: relative;
      display: flex;
      height: 40px;
      width: 100%;
      .emoji-display {
        position: absolute;
        width: 100%;
        height: 210px;
        background-color: white;
        top: -210px;
        left: 0;
          overflow-y: auto;
        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            padding: 2px 3px;
            font-size: 2.2rem;
          }
        }
      }
      .emoji {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 45px;
        height: 100%;
        background-color: rgba(0, 0, 0, .1);
        .icon-emoji {
          width: 40px;
          height: 100%;
          background: url('../../common/icons/icon-emoji.svg') no-repeat;
          background-size: contain;

        }
      }

      textarea {
        flex: 1;
        resize: none;
        padding-left: 3px;
        padding-top: 7px;
        padding-right: 3px;
        height: 100%;
        font-size: 1.4rem;
      }
      button {
        width: 60px;
        height: 100%;
        background-color: $blue;
        color: white;
        font-size: 16px;
      }
    }
  }
</style>
