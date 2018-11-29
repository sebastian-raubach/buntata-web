<template>
  <mdc-card class="node">
    <mdc-card-primary-action>
      <mdc-card-header class="node-header"><mdc-icon icon="add" class="add-icon"></mdc-icon></mdc-card-header>
    </mdc-card-primary-action>
  </mdc-card>
</template>

<script>
  export default {
    data: function () {
      return {
      }
    }
  }
</script>

<style scoped>
  .node:hover {
    cursor: pointer;
  }

  .node .node-header > h1 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .add-icon {
    text-align: center;
    font-size: 10em;
    width: 100%;
    -webkit-touch-callout: none; /* iOS Safari */
      -webkit-user-select: none; /* Safari */
       -khtml-user-select: none; /* Konqueror HTML */
         -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
              user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
  }
</style>