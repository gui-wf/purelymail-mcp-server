import fs from "fs";
import path from "path";
import type { paths } from "../types/purelymail-api.js";

// Load swagger spec for metadata
const spec = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'purelymail-api-spec.json'), 'utf8')
);

/**
 * Generate MCP tools from swagger spec using openapi-fetch
 * Creates one tool per OpenAPI operation for maximum clarity
 *
 * NEW ARCHITECTURE (v2.0+):
 * - One tool per operation (e.g., create_user, delete_user, get_user)
 * - Each tool has operation-specific parameters only
 * - No parameter conflicts or confusion for AI assistants
 * - Tool name directly indicates the action (no 'action' parameter)
 */
export async function createToolsFromSpec(client: any): Promise<any[]> {
  const tools = [];

  // Iterate through all paths and operations
  for (const [apiPath, methods] of Object.entries(spec.paths)) {
    for (const [httpMethod, operation] of Object.entries(methods as any)) {
      const op = operation as any; // Type assertion for OpenAPI operation
      if (!op.operationId) continue;

      const toolName = convertOperationIdToToolName(op.operationId);
      const tool = {
        name: toolName,
        description: generateToolDescription(op),
        inputSchema: generateInputSchema(op),
        execute: createExecutor(client, apiPath, httpMethod.toUpperCase(), op.operationId)
      };
      tools.push(tool);
    }
  }

  return tools;
}

/**
 * Convert OpenAPI operationId to snake_case tool name
 * "Create User" → "create_user"
 * "List Domains" → "list_domains"
 */
function convertOperationIdToToolName(operationId: string): string {
  return operationId
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * Generate tool description from operation metadata
 */
function generateToolDescription(operation: any): string {
  const summary = operation.summary || '';
  const description = operation.description || '';

  if (summary && description && summary !== description) {
    return `${summary}. ${description}`;
  }
  return summary || description || 'No description available';
}

/**
 * Generate input schema directly from operation's requestBody
 * No merging - each tool gets exactly its required parameters
 */
function generateInputSchema(operation: any): any {
  const requestBodyRef = operation.requestBody?.$ref;

  // Handle operations with no body (e.g., list operations)
  if (!requestBodyRef) {
    return {
      type: "object",
      properties: {},
      required: []
    };
  }

  // Extract schema from requestBody reference
  const requestBodyName = requestBodyRef.split('/').pop();
  const requestBody = spec.components?.requestBodies?.[requestBodyName];

  if (!requestBody?.content?.['application/json']?.schema?.$ref) {
    return {
      type: "object",
      properties: {},
      required: []
    };
  }

  // Get the actual data schema
  const dataSchemaRef = requestBody.content['application/json'].schema.$ref;
  const dataSchemaName = dataSchemaRef.split('/').pop();
  const dataSchema = spec.components?.schemas?.[dataSchemaName];

  if (!dataSchema) {
    return {
      type: "object",
      properties: {},
      required: []
    };
  }

  // Convert swagger schema to JSON Schema
  const properties: Record<string, any> = {};
  if (dataSchema.properties) {
    for (const [propName, propSchema] of Object.entries(dataSchema.properties)) {
      properties[propName] = createJsonSchemaFromSwagger(propSchema as any);
    }
  }

  return {
    type: "object",
    properties,
    required: dataSchema.required || []
  };
}

/**
 * Convert Swagger/OpenAPI schema to JSON Schema format
 */
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

  if (swaggerSchema.enum) {
    jsonSchema.enum = swaggerSchema.enum;
  }

  if (swaggerSchema.type === 'array' && swaggerSchema.items) {
    jsonSchema.items = createJsonSchemaFromSwagger(swaggerSchema.items);
  }

  if (swaggerSchema.type === 'object' && swaggerSchema.properties) {
    jsonSchema.properties = {};
    for (const [key, value] of Object.entries(swaggerSchema.properties)) {
      jsonSchema.properties[key] = createJsonSchemaFromSwagger(value as any);
    }
  }

  return jsonSchema;
}

/**
 * Create executor function for a specific operation
 * No action parameter - the tool itself represents the action
 */
function createExecutor(client: any, apiPath: string, httpMethod: string, operationId: string) {
  return async (input: any): Promise<any> => {
    try {
      // Handle mock client case (uses operationId as method name)
      if (typeof client[operationId] === 'function') {
        return await client[operationId](input);
      }

      // Use openapi-fetch for real API calls
      const pathKey = apiPath as keyof paths;
      const method = httpMethod as 'GET' | 'POST' | 'PUT' | 'DELETE';

      // Prepare request body - handle empty requests properly
      const body = Object.keys(input).length === 0 ? {} : input;

      // Make the API call using openapi-fetch
      const { data, error, response } = await client[method](pathKey, {
        body: body
      });

      if (error) {
        throw new Error(`API error ${response.status}: ${JSON.stringify(error)}`);
      }

      return data;
    } catch (error: any) {
      throw new Error(`Failed to execute ${operationId}: ${error.message}`);
    }
  };
}
