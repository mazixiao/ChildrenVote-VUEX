<template>
  <div>
    {{ $attrs }} --- {{ $listeners }}
  </div>
</template>
<script>
  export default {
    name: 'grandSon',
    props: ['weight'],
    created() {
      console.log(this.$attrs, "孙子-this.$attrs"); // age, infoObj, height 
      console.log(this.$listeners, "孙子-this.$listeners") // updateInfo: f, delInfo: f, addInfo: f
      this.$emit('updateInfo') // 可以触发 father 组件中的updateInfo函数
    }
  }
</script>