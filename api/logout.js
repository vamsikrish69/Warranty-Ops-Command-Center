module.exports = (req, res) => {
  res.setHeader('Set-Cookie', 'wcc_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure');
  res.status(200).json({ ok: true });
};
