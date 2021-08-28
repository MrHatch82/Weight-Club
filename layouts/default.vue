<template>
  <div class="layout-default d-flex flex-column">
    <topnav />
    <Nuxt />
  </div>
</template>

<script>
export default {
  mounted() {
    this.$parse.initialize(
      this.$config.appId, // This is your Application ID
      this.$config.jsKey, // This is your Javascript key
      // this.$config.masterKey, // This is your Master key (never use it in the frontend)
    );
    this.$parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
  },
};
</script>
