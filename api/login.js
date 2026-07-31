const crypto = require('crypto');

// The session token is an HMAC derived from the password itself, so no
// separate secret or database is needed — anyone who knows the correct
// password can produce a valid session, and the server never stores state.
function sessionToken(secret) {
  return crypto.createHmac('sha256', secret).update('wcc-authenticated-session').digest('hex');
}

module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const password = (body && body.password) || '';

  // Set DASHBOARD_PASSWORD in your Vercel project's Environment Variables.
  // Falls back to a default so the demo works before you've set one.
  const expected = process.env.DASHBOARD_PASSWORD || 'demo123';

  if (password && password === expected) {
    const token = sessionToken(expected);
    res.setHeader(
      'Set-Cookie',
      `wcc_session=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; Secure`
    );
    res.status(200).json({ ok: true });
  } else {
    res.status(401).json({ ok: false, error: 'Incorrect password.' });
  }
};
