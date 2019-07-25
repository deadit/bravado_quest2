<template>
  <div class="searchbox">
    <div class="form">
      <input v-model="inputValue" class="input" type="text" @input="searchUser" />
    </div>
    <div v-bar class="custom-scroll-container">
      <div
        v-infinite-scroll="addUsersIntoScrollList"
        class="users-container"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="500"
        infinite-scroll-immediate-check="true"
      >
        <div class="users">
          <UserCard
            v-for="(user, indx) of lazyList"
            :key="indx"
            :user="user"
            :query="inputValue"
          ></UserCard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserCard from "./UserCard.vue";
import debounce from "lodash/debounce";
import filter from "lodash/filter";
import infiniteScroll from "vue-infinite-scroll";

export default {
  name: "SearchBox",
  directives: { infiniteScroll },
  components: {
    UserCard
  },
  data: function() {
    return {
      inputValue: "",
      users: [],
      lazyList: [],
      page: 0,
      order: 20
    };
  },
  computed: {
    searchUser() {
      return debounce(this.getUsers, 500);
    }
  },
  methods: {
    async getUsers() {
      this.lazyList = [];
      this.page = 0;

      if (this.inputValue === "") {
        this.users = [];
        return;
      }

      const users = await fetch("/users").then(data => data.json());
      this.filterUsers(users);
    },
    filterUsers(users) {
      this.users = filter(users, this.checkUser);
      this.addUsersIntoScrollList();
    },
    checkUser(user) {
      return filter(user, userValue =>
        userValue.toLowerCase().includes(this.inputValue.toLowerCase())
      ).length !== 0
        ? true
        : false;
    },
    addUsersIntoScrollList() {
      const order = 20;
      this.busy = true;
      const append = [...this.users].splice(this.page * order, order);
      this.lazyList = this.lazyList.concat(append);
      this.page += 1;
      this.busy = false;
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

.custom-scroll-container {
  margin-top: 20px;
}

.users {
  height: 100%;
  padding-right: 1rem;
}
</style>
