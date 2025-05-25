// Performance testing script for MyPalette
// This script measures page load times and API response times

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

// Base URL for testing - replace with actual deployment URL when testing
const BASE_URL = 'https://mypalette.vercel.app';

// Results storage
const results = {
  pageLoadTimes: [],
  apiResponseTimes: [],
  resourceSizes: {},
  summary: {}
};

// Test page load times
async function testPageLoadTimes() {
  console.log('Testing page load times...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Enable performance metrics
  await page.setCacheEnabled(false);
  
  const pagesToTest = [
    '/',
    '/auth/login',
    '/auth/register',
    '/open-calls',
    '/education'
  ];
  
  for (const path of pagesToTest) {
    const url = `${BASE_URL}${path}`;
    
    // Measure page load time
    const start = Date.now();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const loadTime = Date.now() - start;
    
    console.log(`Page ${path} loaded in ${loadTime}ms`);
    
    // Get performance metrics
    const performanceMetrics = await page.evaluate(() => {
      return {
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
        load: performance.timing.loadEventEnd - performance.timing.navigationStart,
        firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
        firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0
      };
    });
    
    // Get resource sizes
    const resources = await page.evaluate(() => {
      return performance.getEntriesByType('resource').map(resource => ({
        name: resource.name,
        size: resource.transferSize,
        type: resource.initiatorType
      }));
    });
    
    // Calculate total resource size
    const totalResourceSize = resources.reduce((total, resource) => total + resource.size, 0);
    
    results.pageLoadTimes.push({
      path,
      loadTime,
      performanceMetrics,
      totalResourceSize: `${(totalResourceSize / 1024).toFixed(2)} KB`
    });
    
    // Store resource sizes by type
    resources.forEach(resource => {
      if (!results.resourceSizes[path]) {
        results.resourceSizes[path] = {};
      }
      
      if (!results.resourceSizes[path][resource.type]) {
        results.resourceSizes[path][resource.type] = 0;
      }
      
      results.resourceSizes[path][resource.type] += resource.size;
    });
  }
  
  await browser.close();
}

// Test API response times
async function testAPIResponseTimes() {
  console.log('Testing API response times...');
  
  const apisToTest = [
    { name: 'Get Open Calls', method: 'GET', endpoint: '/api/open-calls' },
    { name: 'Get Educational Content', method: 'GET', endpoint: '/api/education' },
    { name: 'Get Templates', method: 'GET', endpoint: '/api/templates' }
  ];
  
  for (const api of apisToTest) {
    try {
      const start = Date.now();
      const response = await axios({
        method: api.method,
        url: `${BASE_URL}${api.endpoint}`,
        validateStatus: status => status >= 200 && status < 500
      });
      const responseTime = Date.now() - start;
      
      console.log(`API ${api.name} responded in ${responseTime}ms with status ${response.status}`);
      
      results.apiResponseTimes.push({
        name: api.name,
        endpoint: api.endpoint,
        method: api.method,
        responseTime,
        status: response.status
      });
    } catch (error) {
      console.error(`Error testing API ${api.name}: ${error.message}`);
      
      results.apiResponseTimes.push({
        name: api.name,
        endpoint: api.endpoint,
        method: api.method,
        error: error.message
      });
    }
  }
}

// Test image optimization
async function testImageOptimization() {
  console.log('Testing image optimization...');
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  
  // Get all images on the page
  const images = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      width: img.width,
      height: img.height,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      hasLazyLoading: img.loading === 'lazy',
      hasSrcset: img.hasAttribute('srcset')
    }));
  });
  
  // Check if images are properly sized and have lazy loading
  const optimizedImages = images.filter(img => 
    img.hasLazyLoading && 
    img.hasSrcset && 
    img.width > 0 && 
    img.height > 0
  );
  
  const optimizationRate = (optimizedImages.length / images.length) * 100;
  
  console.log(`Image optimization rate: ${optimizationRate.toFixed(2)}% (${optimizedImages.length}/${images.length})`);
  
  results.imageOptimization = {
    totalImages: images.length,
    optimizedImages: optimizedImages.length,
    optimizationRate: `${optimizationRate.toFixed(2)}%`,
    lazyLoadedImages: images.filter(img => img.hasLazyLoading).length,
    responsiveImages: images.filter(img => img.hasSrcset).length
  };
  
  await browser.close();
}

// Generate performance summary
function generatePerformanceSummary() {
  // Calculate average page load time
  const avgPageLoadTime = results.pageLoadTimes.reduce((total, page) => total + page.loadTime, 0) / results.pageLoadTimes.length;
  
  // Calculate average API response time
  const apiResponseTimes = results.apiResponseTimes.filter(api => api.responseTime);
  const avgAPIResponseTime = apiResponseTimes.reduce((total, api) => total + api.responseTime, 0) / apiResponseTimes.length;
  
  // Find slowest and fastest pages
  const sortedPages = [...results.pageLoadTimes].sort((a, b) => b.loadTime - a.loadTime);
  const slowestPage = sortedPages[0];
  const fastestPage = sortedPages[sortedPages.length - 1];
  
  // Find slowest and fastest APIs
  const sortedAPIs = [...apiResponseTimes].sort((a, b) => b.responseTime - a.responseTime);
  const slowestAPI = sortedAPIs[0];
  const fastestAPI = sortedAPIs[sortedAPIs.length - 1];
  
  results.summary = {
    avgPageLoadTime: `${avgPageLoadTime.toFixed(2)}ms`,
    avgAPIResponseTime: `${avgAPIResponseTime.toFixed(2)}ms`,
    slowestPage: {
      path: slowestPage.path,
      loadTime: `${slowestPage.loadTime}ms`
    },
    fastestPage: {
      path: fastestPage.path,
      loadTime: `${fastestPage.loadTime}ms`
    },
    slowestAPI: {
      name: slowestAPI.name,
      responseTime: `${slowestAPI.responseTime}ms`
    },
    fastestAPI: {
      name: fastestAPI.name,
      responseTime: `${fastestAPI.responseTime}ms`
    },
    imageOptimizationRate: results.imageOptimization.optimizationRate
  };
  
  // Performance recommendations
  const recommendations = [];
  
  if (avgPageLoadTime > 3000) {
    recommendations.push('Improve page load times - average is above 3 seconds');
  }
  
  if (avgAPIResponseTime > 500) {
    recommendations.push('Optimize API response times - average is above 500ms');
  }
  
  if (results.imageOptimization.optimizationRate < 80) {
    recommendations.push('Improve image optimization - less than 80% of images are fully optimized');
  }
  
  results.summary.recommendations = recommendations;
}

// Save results to file
function saveResults() {
  const resultsJson = JSON.stringify(results, null, 2);
  fs.writeFileSync('performance-test-results.json', resultsJson);
  console.log('Performance test results saved to performance-test-results.json');
}

// Run all performance tests
async function runPerformanceTests() {
  console.log('Starting performance tests for MyPalette...');
  
  await testPageLoadTimes();
  await testAPIResponseTimes();
  await testImageOptimization();
  
  generatePerformanceSummary();
  saveResults();
  
  console.log('Performance tests completed.');
  console.log('Summary:', results.summary);
}

// Export the test functions
module.exports = {
  runPerformanceTests,
  testPageLoadTimes,
  testAPIResponseTimes,
  testImageOptimization
};

// Run tests if this script is executed directly
if (require.main === module) {
  runPerformanceTests();
}
