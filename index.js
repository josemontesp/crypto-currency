'use strict';
const request = require('request-promise');
const config = require('./config.js');
var Spinner = require('cli-spinner').Spinner;
 
var spinner = new Spinner('Buscando los últimos valores... %s');
spinner.setSpinnerString('|/-\\');
spinner.start();

const apiUrlBtc = 'https://www.surbtc.com/api/v2/markets/btc-clp/ticker';
const apiUrlEth = 'https://www.cryptomkt.com/api/ethclp/240.json';

const btcAmount = config.btcAmount;
const CLPInvestedInBTC = config.CLPInvestedInBTC;

const ethAmount = config.ethAmount;
const CLPInvestedInETH = config.CLPInvestedInETH;

let clpbtcEarnings;
let clpEthEarnings;

Promise.all([request(apiUrlBtc),request(apiUrlEth)]) 
.then(r => {
	spinner.stop(true);
	let btcValue = (Number)(JSON.parse(r[0]).ticker.max_bid[0]);
	clpbtcEarnings = btcValue*btcAmount - CLPInvestedInBTC;
	console.log(`Inversión BTC:
	 CLP invertido: ${CLPInvestedInBTC}
	 ganancias: ${clpbtcEarnings}
	 Porcentaje total de cambio: ${(clpbtcEarnings/CLPInvestedInBTC*100).toFixed(2)}%\n`);
	
	let ethValue = (Number)(JSON.parse(r[1]).data.prices_ask.values[0].close_price);
	clpEthEarnings = Math.round(ethValue * ethAmount - CLPInvestedInETH);
	console.log(`Inversión ETH:
	 CLP invertido: ${CLPInvestedInETH}
	 ganancias: ${clpEthEarnings}
	 Porcentaje total de cambio: ${(clpEthEarnings/CLPInvestedInETH*100).toFixed(2)}%\n`);

	console.log(`Inversión total:
	 CLP invertido: ${CLPInvestedInBTC + CLPInvestedInETH}
	 ganancias: ${clpbtcEarnings + clpEthEarnings}
	 Porcentaje total de cambio: ${((clpbtcEarnings + clpEthEarnings)/(CLPInvestedInBTC + CLPInvestedInETH)*100).toFixed(2)}%\n`);
})
.catch(console.error);

