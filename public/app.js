
const URL = `https://www.facebook.com/v10.0/dialog/oauth?client_id=471817174020269&redirect_uri=https://localhost//:5050/fb_oauth&state="{st=state123abc,ds=123456789}"`;

const aEl = document.getElementById('oauth');
aEl.setAttribute('href', URL);

