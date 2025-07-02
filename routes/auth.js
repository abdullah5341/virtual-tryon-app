const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const shop = req.query.shop;
  if (!shop) return res.send("Missing shop param");

  const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,read_customers&redirect_uri=${process.env.HOST}/auth/callback`;
  res.redirect(installUrl);
});

router.get('/callback', async (req, res) => {
  const { shop, code } = req.query;
  if (!shop || !code) return res.status(400).send("Missing shop or code");

  try {
    const accessTokenResponse = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    });

    const accessToken = accessTokenResponse.data.access_token;
    console.log(`Access token for ${shop}:`, accessToken);

    res.send("✅ Virtual Try-On App installed successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving access token");
  }
});

module.exports = router;