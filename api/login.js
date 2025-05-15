import dotenv from 'dotenv';

dotenv.config();

export default function loginHandler(req, res) {
  const redirectUrl = `https://accounts.tiny.com.br/realms/tiny/protocol/openid-connect/auth?client_id=${process.env.TINY_CLIENT_ID}&redirect_uri=${process.env.TINY_REDIRECT_URI}&response_type=code&scope=openid`;
  res.redirect(redirectUrl);
}
