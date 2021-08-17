<template>
  <div>
    <grand-son :height="height" :weight="weight" @addInfo="addInfo" v-bind="$attrs" v-on="$listeners" />
    <!-- // 通过 $listeners 将父作用域中的事件，传入 grandSon 组件，使其可以获取到 father 中的事件 -->
  </div>
</template>

<script>
  import GrandSon from './grandSon.vue'
  export default {
    name: 'child',
    components: { GrandSon },
    props: ['name'],
    data() {
      return {
        height: '180cm',
        weight: '70kg'
      };
    },
    created() {
      console.log(this.$attrs, "子-this.$attrs");
      // 结果：age, infoObj, 因为父组件共传来name, age, infoObj三个值，由于name被 props接收了，所以只有age, infoObj属性
      console.log(this.$listeners, "子-this.$listeners"); // updateInfo: f, delInfo: f
    },
    methods: {
      addInfo() {
        console.log('add info')
      }
    }
  }
</script>