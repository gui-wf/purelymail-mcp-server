# PurelyMail API Endpoints

Generated from Swagger specification

## User

### POST /api/v0/createUser
- **Operation ID**: Create User
- **Summary**: Creates a user
- **Description**: Creates a new user.

### POST /api/v0/deleteUser
- **Operation ID**: Delete User
- **Summary**: Deletes a user
- **Description**: Deletes a user.

### POST /api/v0/listUser
- **Operation ID**: List Users
- **Summary**: Lists all users under your account.
- **Description**: Lists all users under your account (up to 1000).

### POST /api/v0/modifyUser
- **Operation ID**: Modify User
- **Summary**: Modifies a user
- **Description**: Modifies a user.

### POST /api/v0/getUser
- **Operation ID**: Get User
- **Summary**: Gets a user
- **Description**: Retrieves details of a user.

### POST /api/v0/upsertPasswordReset
- **Operation ID**: Create or update Password Reset Method
- **Summary**: Creates or updates a password reset method (either phone or email).
- **Description**: Creates or updates a password reset method (either phone or email).

### POST /api/v0/deletePasswordReset
- **Operation ID**: Delete Password Reset Method
- **Summary**: Deletes a password reset method.
- **Description**: Deletes a password reset method.

### POST /api/v0/listPasswordReset
- **Operation ID**: List Password Reset Methods
- **Summary**: Lists all password reset methods for a user.
- **Description**: Lists all password reset methods for a user.

### POST /api/v0/createAppPassword
- **Operation ID**: Create App Password
- **Summary**: Creates an app password
- **Description**: Creates a new app password.

### POST /api/v0/deleteAppPassword
- **Operation ID**: Delete App Password
- **Summary**: Deletes app password
- **Description**: Deletes an app password.

## Routing

### POST /api/v0/createRoutingRule
- **Operation ID**: Create Routing Rule
- **Summary**: Creates a new routing rule for a domain
- **Description**: Routing rule must not have the same user/prefix as any other existing rules for the domain.

### POST /api/v0/deleteRoutingRule
- **Operation ID**: Delete Routing Rule
- **Summary**: Deletes an existing routing rule
- **Description**: N/A

### POST /api/v0/listRoutingRules
- **Operation ID**: List Routing Rules
- **Summary**: Lists all routing rules active under your account
- **Description**: N/A

## Domains

### POST /api/v0/addDomain
- **Operation ID**: Add Domain
- **Summary**: Adds a domain.
- **Description**: Adds a domain, assuming it passes DNS checks.

### POST /api/v0/getOwnershipCode
- **Operation ID**: Get Ownership Code
- **Summary**: Gets ownership code record
- **Description**: Gets the DNS record value of the Purelymail ownership proof record, required to add a domain

### POST /api/v0/listDomains
- **Operation ID**: List Domains
- **Summary**: Lists domains accessible to an account.
- **Description**: Lists domains accessible to an account, possibly including shared domains.

### POST /api/v0/updateDomainSettings
- **Operation ID**: Update Domain Settings
- **Summary**: Updates settings for a domain
- **Description**: Updates settings for an existing owned domain.

### POST /api/v0/deleteDomain
- **Operation ID**: Delete Domain
- **Summary**: Delete Domain
- **Description**: Deletes a domain, and all dependent settings and users.

## Billing

### POST /api/v0/checkAccountCredit
- **Operation ID**: Check Account Credit
- **Summary**: Returns current account credit.
- **Description**: Returns current account credit, as a BigDecimal string with precision 64.

