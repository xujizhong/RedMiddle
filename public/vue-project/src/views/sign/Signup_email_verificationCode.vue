<template>
    <div></div>
</template>

<script>
const https = require('../../https/https')

export default {
 async mounted(){
     const name_crypto = this.$route.params.name_crypto;
     const verificationCode = this.$route.params.verificationCode;
     const res = await https.signup_email_verificationCode(name_crypto,verificationCode);

     this.$router.push({ path: "/" }); //链接跳转到首页

     if(res.data.code == 200){
        this.$store.commit("setUser", res.data.user || {}); //将user放入vuex
     }

  },
  methods:{
  },
  data(){
    return {
    }
  }
}
</script>
