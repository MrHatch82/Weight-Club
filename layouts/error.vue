<template>
  <div class="page">
    <div class="container text-center">
      <h1 v-if="error.statusCode === 404">
        Oh no! Page not found.
      </h1>
      <h1 v-else>
        Oh no! An error occurred.
      </h1>
      <NuxtLink to="/">
        Back to home page
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: ['error'], // you can set a custom layout for the error page
};
</script>
