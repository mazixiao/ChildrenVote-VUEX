export const myMixin1 = {
  data() {
    return {
      num: 1,
    }
  },
  created() {
    this.hello();
    console.log(this.num, "this.num-当前页面");
  },
  mounted() {
    
  },
  methods:{
    hello() {
      console.log("第一次学习mixin");
    },
    numAdd1() {
      this.num = this.num + 1;
      console.log(this.num, "numAdd++")
      return this.num 
    },
    func_one() {
      console.log("func_one");
    },
    func_two() {
      console.log("func_two");
    },

  }
}



export const myMixin2 = {
  data() {
    return {
      num222: 1000,
    }
  },
  created() {
    this.hello();
    console.log(this.num222, "this.num-当前页面");
  },
  mounted() {
    
  },
  methods:{
    numAdd2() {
      this.num222 = this.num222 + 1;
      console.log(this.num222, "numAdd++")
      return this.num222 
    },

  }
}