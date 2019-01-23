<template>
  <div class="sign">
    <div id="logo_bg">
      <router-link to="/">
        <img id="logo" alt="Vue logo" src="../../assets/logo.png">
      </router-link>
    </div>
    <div id="sign_view">
      <router-view/>
    </div>
  </div>
</template>

<style scoped>
#sign_view {
  width: 380px;
  margin: 0 auto;
  background: white;
  border: 1px solid #d8dee2;
  padding: 15px 40px;
  border-radius: 5px;
}
@media (max-width: 768px) {
  #sign_view {
    width: 246px;
  }
}
#logo {
  width: 100px;
}
.sign {
  height: 100vh;
  background-color: #f9f9f9;
  text-align: center;
}
</style>

