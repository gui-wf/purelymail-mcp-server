import fs from "fs";
import path from "path";

// Load mock responses from swagger examples
const spec = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'purelymail-api-spec.json'), 'utf8')
);

export class MockApiClient {
  constructor() {
    console.error("Running in MOCK MODE - using swagger examples");
  }

  // User operations
  async createUser(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/createUser', 'post', {
      success: true,
      message: `Mock: Created user ${params.userName}@${params.domainName}`
    });
  }

  async deleteUser(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/deleteUser', 'post', {
      success: true,
      message: `Mock: Deleted user ${params.userName}`
    });
  }

  async listUsers(): Promise<any> {
    return this.getMockResponse('/api/v0/listUser', 'post', {
      result: {
        users: ["user1@example.com", "user2@example.com", "admin@example.com"]
      }
    });
  }

  async modifyUser(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/modifyUser', 'post', {
      success: true,
      message: `Mock: Modified user ${params.userName}`
    });
  }

  async getUser(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/getUser', 'post', {
      result: {
        enableSearchIndexing: true,
        recoveryEnabled: true,
        requireTwoFactorAuthentication: false,
        enableSpamFiltering: true,
        resetMethods: []
      }
    });
  }

  // Password reset operations
  async upsertPasswordReset(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/upsertPasswordReset', 'post', {
      success: true,
      message: `Mock: Updated password reset method for ${params.userName}`
    });
  }

  async deletePasswordReset(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/deletePasswordReset', 'post', {
      success: true,
      message: `Mock: Deleted password reset method for ${params.userName}`
    });
  }

  async listPasswordResetMethods(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/listPasswordReset', 'post', {
      result: {
        users: [
          {
            type: "email",
            target: "recovery@example.com",
            description: "Recovery email",
            allowMfaReset: true
          }
        ]
      }
    });
  }

  // Routing operations
  async createRoutingRule(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/createRoutingRule', 'post', {
      success: true,
      message: `Mock: Created routing rule for ${params.domainName}`
    });
  }

  async deleteRoutingRule(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/deleteRoutingRule', 'post', {
      success: true,
      message: `Mock: Deleted routing rule ${params.routingRuleId}`
    });
  }

  async listRoutingRules(): Promise<any> {
    return this.getMockResponse('/api/v0/listRoutingRules', 'post', {
      result: {
        rules: [
          {
            id: 1,
            domainName: "example.com",
            prefix: false,
            matchUser: "contact",
            targetAddresses: ["admin@example.com"],
            catchall: false
          }
        ]
      }
    });
  }

  // Domain operations
  async addDomain(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/addDomain', 'post', {
      success: true,
      message: `Mock: Added domain ${params.domainName}`
    });
  }

  async getOwnershipCode(): Promise<any> {
    return this.getMockResponse('/api/v0/getOwnershipCode', 'post', {
      result: {
        code: "purelymail-verification-12345abcdef"
      }
    });
  }

  async listDomains(params: any = {}): Promise<any> {
    return this.getMockResponse('/api/v0/listDomains', 'post', {
      result: {
        domains: [
          {
            name: "example.com",
            allowAccountReset: true,
            symbolicSubaddressing: true,
            isShared: false,
            dnsSummary: {
              passesMx: true,
              passesSpf: true,
              passesDkim: true,
              passesDmarc: true
            }
          }
        ]
      }
    });
  }

  async updateDomainSettings(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/updateDomainSettings', 'post', {
      success: true,
      message: `Mock: Updated settings for domain ${params.name}`
    });
  }

  async deleteDomain(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/deleteDomain', 'post', {
      success: true,
      message: `Mock: Deleted domain ${params.name}`
    });
  }

  // App password operations
  async createAppPassword(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/createAppPassword', 'post', {
      result: {
        appPassword: "mock-app-password-123456789"
      }
    });
  }

  async deleteAppPassword(params: any): Promise<any> {
    return this.getMockResponse('/api/v0/deleteAppPassword', 'post', {
      success: true,
      message: `Mock: Deleted app password for ${params.userName}`
    });
  }

  // Billing operations
  async checkAccountCredit(): Promise<any> {
    return this.getMockResponse('/api/v0/checkAccountCredit', 'post', {
      result: {
        credit: "25.50"
      }
    });
  }

  // Generic mock response generator
  private getMockResponse(path: string, method: string, defaultResponse?: any): any {
    const operation = spec.paths[path]?.[method];
    if (!operation) {
      return defaultResponse || {
        success: true,
        message: `Mock response for ${method.toUpperCase()} ${path}`
      };
    }

    // Use swagger examples or default response
    const response = operation.responses['200'] || operation.responses['201'];
    const example = response?.content?.['application/json']?.example;
    
    if (example) {
      return example;
    }

    return defaultResponse || {
      success: true,
      message: `Mock response for ${method.toUpperCase()} ${path}`,
      result: {}
    };
  }

  // Dynamic method mapping for operation IDs
  "Create User" = this.createUser;
  "Delete User" = this.deleteUser;
  "List Users" = this.listUsers;
  "Modify User" = this.modifyUser;
  "Get User" = this.getUser;
  "Create or update Password Reset Method" = this.upsertPasswordReset;
  "Delete Password Reset Method" = this.deletePasswordReset;
  "List Password Reset Methods" = this.listPasswordResetMethods;
  "Create Routing Rule" = this.createRoutingRule;
  "Delete Routing Rule" = this.deleteRoutingRule;
  "List Routing Rules" = this.listRoutingRules;
  "Add Domain" = this.addDomain;
  "Get Ownership Code" = this.getOwnershipCode;
  "List Domains" = this.listDomains;
  "Update Domain Settings" = this.updateDomainSettings;
  "Delete Domain" = this.deleteDomain;
  "Create App Password" = this.createAppPassword;
  "Delete App Password" = this.deleteAppPassword;
  "Check Account Credit" = this.checkAccountCredit;
}