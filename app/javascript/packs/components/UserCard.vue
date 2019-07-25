<template>
  <div class="card" :class="{ marked: isMarked }">
    <div class="image-container"><img class="image" :src="user.avatar" alt="user image" /></div>
    <div class="content">
      <div class="info">
        <h2 class="name" v-html="highlight(user.name)"></h2>
        <p class="role" v-html="highlight(user.title)"></p>
        <p class="address" v-html="highlight(userAddress)"></p>
        <p class="email" v-html="highlight(user.email)"></p>
      </div>
      <button class="mark-btn" @click="isMarked = !isMarked">
        {{ isMarked ? "SKIP SELECTION" : "MARK AS SIUTABLE" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserCard",
  props: {
    user: {
      type: Object,
      required: true
    },
    query: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isMarked: false,
      userAddress: `${this.user.address}, ${this.user.city}`
    };
  },
  methods: {
    highlight(text) {
      return text.replace(new RegExp(this.query, "gi"), match => {
        return '<span style="background-color: yellow">' + match + "</span>";
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  width: 100%;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  border-radius: 3px;
  background: #fafafa;
  border: 1px solid transparent;

  &.marked {
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid #4765ff;

    .info {
      border-bottom: none;
    }
  }

  &:first-child {
    margin-top: 0;
  }
}

.image-container {
  background: #bbb;
  width: 134px;
  height: 136px;
}

.image {
  width: 134px;
  height: 100%;
}

.content {
  width: 100%;
}

.info {
  position: relative;
  padding: 0.625rem 0.625rem 0.5rem 1.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.mark-btn {
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  border: none;
  background: transparent;
  padding: 0;
  margin-top: 1rem;
  cursor: pointer;
  color: #009688;
  margin: 1rem 0 0 1.75rem;
}

.name {
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 32px;
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
}

.role {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.543846);
  margin: 0;
}

.address {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.543846);
  margin: 0;
}

.email {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  color: rgba(0, 0, 0, 0.54);
  margin: 0;
  position: absolute;
  right: 10px;
  top: 10px;
}
</style>
