<template>
  <div class="searchbox">
    <div class="form">
      <input v-model="inputValue" class="input" type="text" autofocus="true" @input="searchUser" />
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
        No matches for <b>{{ highlightText }}</b> string
      </template>
    </div>
    <div class="loader" :class="{ 'd-block': usersLoading }"><PulseLoader></PulseLoader></div>
  </div>
</template>
<script>
import UserCard from "./UserCard.vue";
import { debounce, omit, slice, filter, concat, includes } from "lodash";
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
      users: [],
      usersLoading: false,
      inputValue: this.$route.params.id ?? "",
      filteredUsers: [],
      scrollList: [],
      page: 0,
      highlightText: this.inputValue
    };
  },
  computed: {
    searchUser() {
      return debounce(this.filterUsers, 200);
    }
  },
  beforeMount() {
    this.getUsers();
  },
  methods: {
    async getUsers() {
      this.usersLoading = true;
      const users = await fetch("/users").then(data => data.json());
      this.users = users;
      this.usersLoading = false;

      this.filterUsers();
    },
    filterUsers() {
      if (this.inputValue.trim() === "") {
        this.filteredUsers = this.users;
      } else {
        const checkUser = user => {
          return filter(user, userField =>
            includes(userField.toLowerCase(), this.inputValue.toLowerCase())
          ).length !== 0
            ? true
            : false;
        };

        const filterUser = user => {
          const userWithoutAvatar = omit(user, ["avatar"]);

          return checkUser(userWithoutAvatar);
        };

        this.filteredUsers = filter(this.users, filterUser);
      }

      this.page = 0;
      this.scrollList = [];

      this.updateHighlightText();
      this.addUsersIntoScrollList();
    },
    addUsersIntoScrollList() {
      this.busy = true;

      const order = 20;
      const currentIndexStart = this.page * order;
      const currentIndexEnd = currentIndexStart + order;
      const append = slice(this.filteredUsers, currentIndexStart, currentIndexEnd);
      this.scrollList = concat(this.scrollList, append);
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
