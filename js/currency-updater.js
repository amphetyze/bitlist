'use strict';

const TARGET_CURRENCY = 'USD';
const API_KEY = '685419b6bedfb725bb6af07ed3dd6fef8f20a83f05c066d1eb20a10c563c7801';
const API_URL = 'https://min-api.cryptocompare.com/data/pricemultifull';
const UPDATE_INTERVAL = 500;

const CURRENCIES = [
    { ticker: '1INCH', priceId: '#inchPrice', changeId: '#inchChange', volumeId: '#inchVolume', signId: '#inchVolumeSign' },
    { ticker: 'BTC', priceId: '#btcPrice', changeId: '#btcChange', volumeId: '#btcVolume', signId: '#btcVolumeSign' },
    { ticker: 'ETH', priceId: '#ethPrice', changeId: '#ethChange', volumeId: '#ethVolume', signId: '#ethVolumeSign' },
    { ticker: 'BNB', priceId: '#bnbPrice', changeId: '#bnbChange', volumeId: '#bnbVolume', signId: '#bnbVolumeSign' },
    { ticker: 'BUSD', priceId: '#busdPrice', changeId: '#busdChange', volumeId: '#busdVolume', signId: '#busdVolumeSign' },
    { ticker: 'MATIC', priceId: '#maticPrice', changeId: '#maticChange', volumeId: '#maticVolume', signId: '#maticVolumeSign' },
];

async function getCurrencyData(currency) {
    const url = `${API_URL}?fsyms=${currency.ticker}&tsyms=${TARGET_CURRENCY}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.RAW && data.RAW[currency.ticker] && data.RAW[currency.ticker][TARGET_CURRENCY]) {
            const { PRICE, CHANGEPCT24HOUR, VOLUME24HOUR } = data.RAW[currency.ticker][TARGET_CURRENCY];
            return [PRICE, CHANGEPCT24HOUR, VOLUME24HOUR];
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

function updateTableData() {
    CURRENCIES.forEach(async (currency) => {
        const data = await getCurrencyData(currency);

        if (data) {
            const [price, change, volume] = data;
            const currencyPrice = document.querySelector(currency.priceId);
            const currencyChange = document.querySelector(currency.changeId);
            const currencyVolume = document.querySelector(currency.volumeId);
            const currencySign = document.querySelector(currency.signId);

            const volumeSign = volume >= 1000 && volume <= 999999 ? 'K' : 'M';

            currencyPrice.textContent = price.toLocaleString('en-EN', { maximumFractionDigits: 2 });
            currencyChange.textContent = `${change > 0 ? '' : ''}${change.toLocaleString('en-EN', { maximumFractionDigits: 2 })}`;
            currencyVolume.textContent = parseInt(volume).toLocaleString('de-DE');
            currencySign.textContent = volumeSign;
        } else {
            console.log('Ошибка при получении данных');
        }
    });
}

updateTableData();

setInterval(updateTableData, UPDATE_INTERVAL);