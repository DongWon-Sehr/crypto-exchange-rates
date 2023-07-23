(()=>{"use strict";var r={138:r=>{class e{constructor(r="binance"){if(this.sources={binance:{url:"https://api.binance.com/api/v3/ticker/price"},coinpaprika:{url:"https://api.coinpaprika.com/v1/tickers"}},!this._isSupportSource(r))throw new Error("Invalid source. Please provide a valid source.");this.source=r,this.fetchCryptos(),this._get_usd_currency()}fetchCryptos(){fetch(this.sources[this.source].url).then((r=>{if(!r.ok)throw new Error("Network response was not ok while fetching crypto rates");return r.json()})).then((r=>{this.cryptoRates=r})).catch((r=>{throw new Error("Error fetching crypto rates:",r)}))}setSource(r){if(!this._isSupportSource(r))throw new Error("Invalid source. Please provide a valid source.");this.source=r,this.fetchCryptos()}_isSupportSource(r){return Object.keys(this.sources).map((r=>r.toLowerCase())).includes(r.toLowerCase())}_get_usd_currency(){fetch("https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json").then((r=>{if(!r.ok)throw new Error("Network response was not ok while fetching USD rates");return r.json()})).then((r=>{this.usdRates=r})).catch((r=>{throw new Error("Error fetching USD rates:",r)}))}}void 0!==r.exports?r.exports=e:window.CryptoExRates=e}},e={};!function t(s){var o=e[s];if(void 0!==o)return o.exports;var c=e[s]={exports:{}};return r[s](c,c.exports,t),c.exports}(138)})();