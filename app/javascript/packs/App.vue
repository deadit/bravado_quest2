<template>
  <div class="container">
    <SearchBox></SearchBox>
  </div>
</template>

<script>
import SearchBox from "./components/SearchBox.vue";

export default {
  name: "App",
  components: {
    SearchBox
  }
};
</script>

<style lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 3rem;
  padding-bottom: 5rem;
}
</style>
