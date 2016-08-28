<style>
body {
  color: var(--mainColor);
  font-size: var(--fontSize);
  line-height: calc(var(--fontSize) * 1.5);
  padding: calc((var(--fontSize) / 2) + 1px);
}

</style>


<template>

    
</template>


<script>

module.exports = {
  data: function() {
    return {
      rate: 0
    };
  },
  ready: function() {
    var self = this;
    var newRateEvent = contracts.ExchangeRate.Rate();
    newRateEvent.watch(function(err, result) {
      if (!err) {
        var newRate = result.args.newRate;
        console.log('newRate type: ', newRate.constructor.name);
        console.log("New Rate: " + newRate);
        self.rate = newRate;
      }
    });
  }
}

</script>


