// Security testing script for MyPalette
// This script checks for common security vulnerabilities

const axios = require('axios');
const cheerio = require('cheerio');

// Base URL for testing - replace with actual deployment URL when testing
const BASE_URL = 'https://mypalette.vercel.app';

// Test for XSS vulnerabilities
async function testXSSVulnerabilities() {
  console.log('Testing for XSS vulnerabilities...');
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '"><script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    '<svg onload="alert(\'XSS\')">',
    'javascript:alert("XSS")'
  ];
  
  // Test input fields for XSS
  const endpoints = [
    '/auth/register',
    '/auth/login',
    '/dashboard/profile',
    '/dashboard/portfolios',
    '/open-calls/propose'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      const $ = cheerio.load(response.data);
      
      // Check if any input fields exist
      const inputs = $('input');
      console.log(`Found ${inputs.length} input fields on ${endpoint}`);
      
      // Check if any of our XSS payloads are reflected in the response
      for (const payload of xssPayloads) {
        if (response.data.includes(payload)) {
          console.error(`XSS vulnerability found on ${endpoint} with payload: ${payload}`);
        }
      }
    } catch (error) {
      console.error(`Error testing ${endpoint}: ${error.message}`);
    }
  }
}

// Test for CSRF vulnerabilities
async function testCSRFVulnerabilities() {
  console.log('Testing for CSRF vulnerabilities...');
  
  const endpoints = [
    '/auth/register',
    '/auth/login',
    '/dashboard/profile',
    '/dashboard/portfolios',
    '/open-calls/propose'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`);
      const $ = cheerio.load(response.data);
      
      // Check if forms have CSRF tokens
      const forms = $('form');
      console.log(`Found ${forms.length} forms on ${endpoint}`);
      
      forms.each((i, form) => {
        const csrfToken = $(form).find('input[name="csrf_token"]').val();
        if (!csrfToken) {
          console.error(`CSRF vulnerability: No CSRF token found in form ${i+1} on ${endpoint}`);
        }
      });
    } catch (error) {
      console.error(`Error testing ${endpoint}: ${error.message}`);
    }
  }
}

// Test for authentication bypass
async function testAuthenticationBypass() {
  console.log('Testing for authentication bypass vulnerabilities...');
  
  const protectedEndpoints = [
    '/dashboard/profile',
    '/dashboard/portfolios',
    '/admin/dashboard'
  ];
  
  for (const endpoint of protectedEndpoints) {
    try {
      // Try to access protected endpoint without authentication
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 500
      });
      
      if (response.status === 200) {
        console.error(`Authentication bypass vulnerability: Able to access ${endpoint} without authentication`);
      } else if (response.status === 302) {
        console.log(`${endpoint} correctly redirects unauthenticated users`);
      } else {
        console.log(`${endpoint} returns status ${response.status} for unauthenticated users`);
      }
    } catch (error) {
      if (error.response && error.response.status === 302) {
        console.log(`${endpoint} correctly redirects unauthenticated users`);
      } else {
        console.error(`Error testing ${endpoint}: ${error.message}`);
      }
    }
  }
}

// Test for SQL injection vulnerabilities
async function testSQLInjection() {
  console.log('Testing for SQL injection vulnerabilities...');
  
  const sqlInjectionPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users; --",
    "admin' --"
  ];
  
  // Test login endpoint for SQL injection
  try {
    for (const payload of sqlInjectionPayloads) {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: `test@example.com${payload}`,
        password: 'password123'
      }, {
        validateStatus: status => status >= 200 && status < 500
      });
      
      if (response.status === 200 && response.data.success) {
        console.error(`SQL injection vulnerability found with payload: ${payload}`);
      }
    }
  } catch (error) {
    console.error(`Error testing SQL injection: ${error.message}`);
  }
}

// Test for insecure direct object references (IDOR)
async function testIDOR() {
  console.log('Testing for IDOR vulnerabilities...');
  
  // Test accessing other users' portfolios by manipulating IDs
  const portfolioIds = ['1', '2', '3', '4', '5'];
  
  for (const id of portfolioIds) {
    try {
      const response = await axios.get(`${BASE_URL}/api/portfolios/${id}`, {
        validateStatus: status => status >= 200 && status < 500
      });
      
      if (response.status === 200) {
        console.log(`Portfolio ${id} is accessible, checking if it belongs to the current user...`);
        // In a real test, we would check if this portfolio belongs to the current user
      }
    } catch (error) {
      console.error(`Error testing IDOR for portfolio ${id}: ${error.message}`);
    }
  }
}

// Run all security tests
async function runSecurityTests() {
  console.log('Starting security tests for MyPalette...');
  
  await testXSSVulnerabilities();
  await testCSRFVulnerabilities();
  await testAuthenticationBypass();
  await testSQLInjection();
  await testIDOR();
  
  console.log('Security tests completed.');
}

// Export the test functions
module.exports = {
  runSecurityTests,
  testXSSVulnerabilities,
  testCSRFVulnerabilities,
  testAuthenticationBypass,
  testSQLInjection,
  testIDOR
};

// Run tests if this script is executed directly
if (require.main === module) {
  runSecurityTests();
}
