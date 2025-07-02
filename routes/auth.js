import express from 'express';
import axios from 'axios';

const router = express.Router();

router.get('/auth', async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.send("Missing shop param");

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_orders&redirect_uri=${process.env.HOST}/auth/callback`;
  res.redirect(installUrl);
});

router.get('/auth/callback', async (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) return res.status(400).send("Missing shop or code");

  const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
    client_id: process.env.SHOPIFY_API_KEY,
    client_secret: process.env.SHOPIFY_API_SECRET,
    code,
  });

  const accessToken = tokenRes.data.access_token;
  console.log(`Access token for ${shop}: ${accessToken}`);

  res.redirect(`https://${shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`);
});

export default router;
