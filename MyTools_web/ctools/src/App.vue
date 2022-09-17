<template>
  <v-app>

      <router-view/>

  </v-app>
</template>

<script>

export default {
  mounted(){
    this.$router.push("/login");
  },
  name: 'App',
  data: () => ({
    //
  }),
};
</script>

<style lang="sass">
@import url(./assets/styles/public.scss)
</style>
