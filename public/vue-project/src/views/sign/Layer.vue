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
<script type="text/javascript">
var cnzz_protocol =
  "https:" == document.location.protocol ? "https://" : "http://";
document.write(
  unescape(
    "%3Cspan id='cnzz_stat_icon_1276056134'%3E%3C/span%3E%3Cscript src='" +
      cnzz_protocol +
      "s23.cnzz.com/z_stat.php%3Fid%3D1276056134%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"
  )
);
</script>

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

