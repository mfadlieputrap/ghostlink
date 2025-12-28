const { V4 } = require('paseto');

async function generate() {
  const { secretKey, publicKey } = await V4.generateKey('public', { format: 'paserk' });
  console.log('PASSPHRASE_PRIVATE_KEY=', secretKey);
  console.log('PASSPHRASE_PUBLIC_KEY=', publicKey);
}

generate();
