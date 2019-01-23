<template>
  <div id="app">
    <router-view/>
    <div v-html="tj"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      tj: unescape(
        "%3Cspan id='cnzz_stat_icon_1276056134'%3E%3C/span%3E%3Cscript src='" +
          document.location.protocol
          ? "https://"
          : "http://" +
              "s23.cnzz.com/z_stat.php%3Fid%3D1276056134%26show%3Dpic' type='text/javascript'%3E%3C/script%3E"
      )
    };
  }
};
</script>
