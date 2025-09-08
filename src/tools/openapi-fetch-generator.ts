import fs from "fs";
import path from "path";
import type { paths } from "../types/purelymail-api.js";

// Load swagger spec for metadata
const spec = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'purelymail-api-spec.json'), 'utf8')
);

/**
 * Generate MCP tools from swagger spec using openapi-fetch
 * Groups related endpoints into logical tools
 * 
 * AIDEV-NOTE: TOOL GRANULARITY NEEDS UX TESTING
 * Current approach groups multiple endpoints per tool (e.g., manage_user handles createUser, deleteUser, etc.)
 * This may be too complex for AI assistants to use effectively. Consider testing:
 * 1. Current grouped approach vs individual tool per endpoint
 * 2. AI assistant error rates and ease of use
 * 3. Whether assistants can properly understand the `action` parameter pattern
 * 
 * Alternative approach: One tool per operation (create_user, delete_user, list_users, etc.)
 * Trade-offs: More tools but simpler schemas, clearer tool purposes
 */
export async function createToolsFromSpec(client: any): Promise<any[]> {
  const tools = [];

  // Group endpoints by resource
  const resourceGroups = groupEndpointsByResource(spec.paths);

  for (const [resource, endpoints] of Object.entries(resourceGroups)) {
    const tool = {
      name: `manage_${resource}`,
      description: generateToolDescription(resource, endpoints),
      inputSchema: generateInputSchema(endpoints),
      execute: createExecutor(client, endpoints, resource)
    };
    tools.push(tool);
  }

  return tools;
}

function groupEndpointsByResource(paths: any): Record<string, any[]> {
  const groups: Record<string, any[]> = {};

  Object.entries(paths).forEach(([path, methods]) => {
    // Extract resource from path and operation tags
    let resource = 'general';
    
    Object.entries(methods as any).forEach(([method, operation]: [string, any]) => {
      // Use the first tag as the resource name
      if (operation.tags && operation.tags.length > 0) {
        resource = operation.tags[0].toLowerCase().replace(/\s+/g, '_');
      }

      if (!groups[resource]) groups[resource] = [];

      groups[resource].push({
        path,
        method: method.toUpperCase(),
        operation,
        operationId: operation.operationId
      });
    });
  });

  return groups;
}

function generateToolDescription(resource: string, endpoints: any[]): string {
  const operations = endpoints.map(e => e.operation.summary).filter(Boolean);
  return `Manage ${resource.replace(/_/g, ' ')}: ${operations.join(', ')}`;
}

function generateInputSchema(endpoints: any[]): any {
  // Create a JSON Schema based on all parameters from endpoints
  const actions = endpoints.map(e => e.operationId).filter(Boolean);

  const properties: Record<string, any> = {
    action: {
      type: "string",
      enum: actions,
      description: "The operation to perform"
    }
  };

  // Add dynamic parameters based on swagger spec
  endpoints.forEach(endpoint => {
    const requestBodyRef = endpoint.operation.requestBody?.$ref;
    if (requestBodyRef) {
      // Extract schema name from reference
      const schemaName = requestBodyRef.split('/').pop();
      const schema = spec.components?.requestBodies?.[schemaName];
      if (schema?.content?.['application/json']?.schema?.$ref) {
        const dataSchemaName = schema.content['application/json'].schema.$ref.split('/').pop();
        const dataSchema = spec.components?.schemas?.[dataSchemaName];
        if (dataSchema?.properties) {
          Object.entries(dataSchema.properties).forEach(([prop, propSchema]: [string, any]) => {
            if (!properties[prop]) {
              properties[prop] = createJsonSchemaFromSwagger(propSchema);
            }
          });
        }
      }
    }
  });

  return {
    type: "object",
    properties,
    required: ["action"]
  };
}

function createJsonSchemaFromSwagger(swaggerSchema: any): any {
  const jsonSchema: any = {
    type: swaggerSchema.type || "string"
  };

  if (swaggerSchema.description) {
    jsonSchema.description = swaggerSchema.description;
  }

  if (swaggerSchema.default !== undefined) {
    jsonSchema.default = swaggerSchema.default;
  }

  if (swaggerSchema.type === 'array' && swaggerSchema.items) {
    jsonSchema.items = createJsonSchemaFromSwagger(swaggerSchema.items);
  }

  return jsonSchema;
}

function createExecutor(client: any, endpoints: any[], resource: string) {
  return async (input: any): Promise<any> => {
    const endpoint = endpoints.find(e => e.operationId === input.action);
    if (!endpoint) {
      throw new Error(`Unknown action: ${input.action}`);
    }

    try {
      // Handle mock client case
      if (client[input.action]) {
        return await client[input.action](input);
      }

      // Use openapi-fetch for real API calls
      const { action, ...requestData } = input;
      const apiPath = endpoint.path as keyof paths;
      const method = endpoint.method.toUpperCase() as 'GET' | 'POST' | 'PUT' | 'DELETE';

      // Prepare request body - handle empty requests properly
      const body = Object.keys(requestData).length === 0 ? {} : requestData;

      // Make the API call using openapi-fetch
      const { data, error, response } = await client[method](apiPath, {
        body: body
      });
      
      if (error) {
        throw new Error(`API error ${response.status}: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error: any) {
      throw new Error(`Failed to execute ${input.action}: ${error.message}`);
    }
  };
}