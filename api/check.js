const crypto = require('crypto');

function sessionToken(secret) {
  return crypto.createHmac('sha256', secret).update('wcc-authenticated-session').digest('hex');
}

function getCookie(req, name) {
  const header = req.headers.cookie || '';
  const found = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(name + '='));
  return found ? found.split('=').slice(1).join('=') : null;
}

module.exports = (req, res) => {
  const expected = process.env.DASHBOARD_PASSWORD || 'demo123';
  const token = getCookie(req, 'wcc_session');

  if (token && token === sessionToken(expected)) {
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false });
  }
};
