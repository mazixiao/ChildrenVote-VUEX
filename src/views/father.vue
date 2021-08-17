<template>
  　　
  <child :name="name" :age="age" :infoObj="infoObj" @updateInfo="updateInfo" @delInfo="delInfo" />
</template>
<script>
  import Child from '../components/child.vue'

  export default {
    name: 'father',
    components: { Child },
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
    methods: {
      updateInfo() {
        console.log('update info');
      },
      delInfo() {
        console.log('delete info');
      }
    }
  }
</script>