<template>
  <div class="searchbox">
    <div class="form">
      <input
        id="input"
        v-model="inputValue"
        class="input"
        type="text"
        :disabled="isFetching"
        autofocus="true"
        @input="searchUser"
      />
    </div>
    <div
      v-infinite-scroll="addUsersIntoScrollList"
      class="users"
      :class="{ 'd-block': !usersLoading }"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="500"
      infinite-scroll-immediate-check="true"
      style="overflow-y: scroll"
    >
      <template v-if="scrollList.length !== 0">
        <UserCard
          v-for="(user, indx) of scrollList"
          :key="`${indx}${user.name}`"
          :user="user"
          :highlight-text="highlightText"
        ></UserCard>
      </template>
      <template v-else>
        No matches for <b>{{ inputValue }}</b> string
      </template>
    </div>
    <div class="loader" :class="{ 'd-block': usersLoading }"><PulseLoader></PulseLoader></div>
  </div>
</template>
<script>
import UserCard from "./UserCard.vue";
import debounce from "lodash/debounce";
import omit from "lodash/omit";
import filter from "lodash/filter";
import infiniteScroll from "vue-infinite-scroll";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

export default {
  name: "SearchBox",
  directives: { infiniteScroll },
  components: {
    UserCard,
    PulseLoader
  },
  data: function() {
    return {
      isFetching: false,
      inputValue: this.$route.params.id || "",
      users: [],
      usersLoading: false,
      scrollList: [],
      page: 0,
      order: 20,
      highlightText: this.inputValue
    };
  },
  computed: {
    searchUser() {
      return debounce(this.getUsers, 500);
    }
  },
  beforeMount() {
    this.isFetching = true;
    this.getUsers();
    this.isFetching = false;
  },
  methods: {
    async getUsers() {
      this.usersLoading = true;
      const users = await fetch("/users").then(data => data.json());
      this.updateUsers(users);
      this.usersLoading = false;
    },
    updateUsers(users) {
      if (this.inputValue.trim() === "") {
        this.users = users;
      } else {
        this.users = filter(users, this.checkUser);
      }
      this.page = 0;
      this.scrollList = [];

      this.updateHighlightText();
      this.addUsersIntoScrollList();
    },
    checkUser(user) {
      return filter(omit(user, ["avatar"]), userValue =>
        userValue.toLowerCase().includes(this.inputValue.toLowerCase())
      ).length !== 0
        ? true
        : false;
    },
    addUsersIntoScrollList() {
      const order = 20;
      this.busy = true;
      const append = [...this.users].splice(this.page * order, order);
      this.scrollList = this.scrollList.concat(append);
      this.page += 1;
      this.busy = false;
    },
    updateHighlightText() {
      this.highlightText = this.inputValue;
    }
  }
};
</script>

<style lang="scss" scoped>
.searchbox {
  width: 700px;
  height: 650px;
  background: #fff;
  padding: 1.125rem 0.75rem 0 0.75rem;
  display: flex;
  flex-direction: column;
}

.form {
  padding-right: 1rem;
  position: relative;

  &::before {
    content: "";
    background-image: url("../../../assets/images/search-icon.svg");
    background-repeat: no-repeat;
    width: 18px;
    height: 18px;
    display: block;
    position: absolute;
    top: 14px;
    left: 20px;
  }
}

.input {
  height: 48px;
  width: 100%;
  background: #fafafa;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.24), 0px 0px 2px rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  border: none;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.75);
  padding-left: 50px;
}

.users {
  height: 0;
  padding-top: 20px;
  padding-right: 1rem;
  display: none;

  &.d-block {
    display: block;
    -webkit-animation: animateCard 0.75s;
    animation: animateCard 0.75s;
    height: auto;
  }
}

.loader {
  justify-content: center;
  align-items: center;
  height: 100%;
  display: none;

  &.d-block {
    display: flex;
    -webkit-animation: animateLoader 0.5s;
    animation: animateLoader 0.5s;
  }
}

@-webkit-keyframes animateCard {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes animateCard {
  from {
    height: 0;
    opacity: 0;
  }
  to {
    height: 100%;
    opacity: 1;
  }
}

@-webkit-keyframes animateLoader {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes animateLoader {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
