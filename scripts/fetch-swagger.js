#!/usr/bin/env node
import fs from 'fs';
import https from 'https';
import { URL } from 'url';

const SWAGGER_URL = 'https://news.purelymail.com/api/swagger-spec.js';
const OUTPUT_JS = 'swagger-spec.js';
const OUTPUT_JSON = 'purelymail-api-spec.json';

console.error('Fetching PurelyMail swagger specification...');

async function fetchSwagger() {
  try {
    const response = await fetch(SWAGGER_URL);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const jsContent = await response.text();
    
    // Write the original JS file
    fs.writeFileSync(OUTPUT_JS, jsContent);
    console.error(`✓ Downloaded ${OUTPUT_JS}`);
    
    // Extract the JSON spec from the JS file
    const spec = await extractSpecFromJS(jsContent);
    
    // Write the JSON spec
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(spec, null, 2));
    console.error(`✓ Extracted ${OUTPUT_JSON}`);
    
    console.error('Swagger specification updated successfully!');
    
  } catch (error) {
    console.error(`✗ Failed to fetch from ${SWAGGER_URL}: ${error.message}`);
    
    // Check if we have existing files to fall back to
    if (fs.existsSync(OUTPUT_JS) && fs.existsSync(OUTPUT_JSON)) {
      console.error(`Using existing files as fallback`);
      process.exit(0);
    } else {
      console.error(`No existing files found. Please check your internet connection or the URL.`);
      process.exit(1);
    }
  }
}

async function extractSpecFromJS(jsContent) {
  try {
    // Try to extract the spec from the JS content
    // The swagger-spec.js contains: window.swaggerSpec = { ... }
    // We need to safely evaluate it
    
    // Create a safe evaluation context with window object
    const windowContext = { swaggerSpec: null };
    
    // Replace window.swaggerSpec with our context
    const safeJs = jsContent.replace(/window\.swaggerSpec\s*=/, 'windowContext.swaggerSpec =');
    
    // Use Function constructor for safer evaluation than eval
    const fn = new Function('windowContext', safeJs + '; return windowContext.swaggerSpec;');
    const spec = fn(windowContext);
    
    if (!spec || typeof spec !== 'object') {
      throw new Error('Invalid swagger spec format');
    }
    
    // Validate it looks like a swagger spec
    if (!spec.openapi && !spec.swagger && !spec.info) {
      throw new Error('Not a valid OpenAPI/Swagger specification');
    }
    
    return spec;
    
  } catch (error) {
    console.error(`Failed to extract spec from JS: ${error.message}`);
    
    // Fallback: try to use existing JSON file
    if (fs.existsSync(OUTPUT_JSON)) {
      console.error('Using existing JSON file as fallback');
      return JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8'));
    }
    
    throw new Error('Could not extract or find existing swagger specification');
  }
}

// Polyfill for Node.js < 18
if (!globalThis.fetch) {
  globalThis.fetch = async function(url) {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'PurelyMail MCP Server'
        }
      };
      
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusText: res.statusMessage,
            text: async () => data
          });
        });
      });
      
      req.on('error', reject);
      req.end();
    });
  };
}

fetchSwagger();