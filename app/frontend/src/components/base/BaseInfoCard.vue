<template>
  <v-card class="elevation-0">
    <v-card-title v-if="this.$slots.title">
      <v-icon>info</v-icon>
      <slot name="title" />
    </v-card-title>
    <v-card-text :class="this.$slots.title ? 'under-title' : ''">
      <slot />
    </v-card-text>
  </v-card>
</template>

<style lang="scss" scoped>
.v-card {
  border-left: 15px solid #38598a;
  border-radius: 0;
  background-color: #f2f2f2;
  padding: 1.5rem;
  .v-icon {
    color: #38598a;
    margin-right: 0.5em;
  }
  .v-card__text:not(.under-title) {
    color: #494949 !important;
    font-size: 16px;
    padding: 0;
  }
  .under-title {
    padding-left: 4em;
  }
}
</style>
