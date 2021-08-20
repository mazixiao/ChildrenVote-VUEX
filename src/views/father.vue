<template>
  <div>
    父级页面:
    <br>
    <child :name="name" :age="age" :infoObj="infoObj" @updateInfo="updateInfo" @delInfo="delInfo" />
    <br>
    <br>
    <br>
    <br>
    

    <div @click="numAdd1">点击数字: {{num}}</div>
    <div @click="numAdd2">点击数字: {{num222}}</div>

    
  </div>
</template>
<script>
  import Child from '../components/child.vue'
  import {myMixin1, myMixin2} from '@/assets/js/mixins.js'

  export default {
    name: 'father',
    components: { Child },
    mixins: [myMixin1, myMixin2],
    data() {
      return {
        name: 'Lily',
        age: 22,
        infoObj: {
          from: '上海',
          job: 'policeman',
          hobby: ['reading', 'writing', 'skating']
        }
      }
    },
    created() {
      this.num++;
      this.hello();
      console.log(this.num222, "this.num-使用");
      console.log(this.numAdd1(), "numAdd++ 使用");
      this.func_one();
      this.func_two();
    },
    mounted() {
      this.hello();
      console.log(this.num, "this.num-当前页面");
    },
    methods: {
      updateInfo() {
        console.log('update info');
      },
      delInfo() {
        console.log('delete info');
      },
      func_two() {
        console.log("func_two 方法被使用");
      },

    }
  }
</script>