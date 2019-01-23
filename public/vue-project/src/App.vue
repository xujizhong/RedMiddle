<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    const script = document.createElement("script");
    script.src =`https://s23.cnzz.com/z_stat.php?id=1276056134&web_id=1276056134"`;
    script.language = "JavaScript";
    document.body.appendChild(script);
  },
  watch: {
    $route() {
      if (window._czc) {
        let location = window.location;
        let contentUrl = location.pathname + location.hash;
        let refererUrl = "/";
        window._czc.push(["_trackPageview", contentUrl, refererUrl]);
      }
    }
  },
};
</script>
