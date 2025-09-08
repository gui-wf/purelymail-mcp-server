#!/usr/bin/env node
import fs from 'fs';

const spec = JSON.parse(fs.readFileSync('purelymail-api-spec.json', 'utf8'));

console.log('# PurelyMail API Endpoints\n');
console.log('Generated from Swagger specification\n');

// Group endpoints by tags or paths
const endpoints = {};

Object.entries(spec.paths).forEach(([path, methods]) => {
  Object.entries(methods).forEach(([method, operation]) => {
    const tag = operation.tags?.[0] || 'General';
    if (!endpoints[tag]) endpoints[tag] = [];

    endpoints[tag].push({
      method: method.toUpperCase(),
      path,
      summary: operation.summary,
      description: operation.description,
      operationId: operation.operationId,
      parameters: operation.parameters,
      requestBody: operation.requestBody,
      responses: operation.responses
    });
  });
});

// Output structured documentation
Object.entries(endpoints).forEach(([category, operations]) => {
  console.log(`## ${category}\n`);
  operations.forEach(op => {
    console.log(`### ${op.method} ${op.path}`);
    console.log(`- **Operation ID**: ${op.operationId}`);
    console.log(`- **Summary**: ${op.summary || 'N/A'}`);
    console.log(`- **Description**: ${op.description || 'N/A'}`);
    console.log('');
  });
});