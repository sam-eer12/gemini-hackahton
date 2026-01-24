const http = require('http');

const email = `testuser_${Date.now()}@example.com`;
const password = 'password123';

function request(path, method, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    body: JSON.parse(data),
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function verify() {
    console.log('--- Starting Verification ---');

    // 1. Signup
    console.log(`\nAttempting Signup with ${email}...`);
    try {
        const signupRes = await request('/api/auth/signup', 'POST', {
            email,
            password,
            name: 'Test User',
        });
        console.log('Signup Status:', signupRes.statusCode);
        console.log('Signup Body:', signupRes.body);

        if (signupRes.statusCode !== 201) {
            console.error('Signup failed!');
            process.exit(1);
        }
    } catch (e) {
        console.error('Signup request failed', e);
        process.exit(1);
    }

    // 2. Login
    console.log('\nAttempting Login...');
    try {
        const loginRes = await request('/api/auth/login', 'POST', {
            email,
            password,
        });
        console.log('Login Status:', loginRes.statusCode);

        if (loginRes.statusCode !== 200) {
            console.error('Login failed!', loginRes.body);
            process.exit(1);
        }

        const token = loginRes.body.token;
        console.log('Login Success. Token received.');

        // 3. Verify Token Expiration (Simple local check of payload)
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log('Token Payload:', payload);

        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        const daysDiff = (expDate - now) / (1000 * 60 * 60 * 24);

        console.log(`Token expires at: ${expDate.toISOString()}`);
        console.log(`Days until expiration: ${daysDiff.toFixed(2)}`);

        if (Math.abs(daysDiff - 7) < 0.1) {
            console.log('SUCCESS: Token expiration is approximately 7 days.');
        } else {
            console.error('FAILURE: Token expiration is not 7 days.');
            process.exit(1);
        }

    } catch (e) {
        console.error('Login request failed', e);
        process.exit(1);
    }
}

verify();
