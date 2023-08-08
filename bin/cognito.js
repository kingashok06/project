#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = require("@aws-cdk/core");
const cognito_stack_1 = require("../lib/cognito-stack");
const app = new cdk.App();
const appStack = new cdk.Stack(app, 'AppStack'); // Create a new Stack for the app
new cognito_stack_1.CognitoStack(appStack, 'CognitoStack'); // Initialize the CognitoStack construct
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsdUNBQXFDO0FBQ3JDLHFDQUFxQztBQUNyQyx3REFBb0Q7QUFFcEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQyxDQUFDLGlDQUFpQztBQUVsRixJQUFJLDRCQUFZLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUMsd0NBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29nbml0b1N0YWNrIH0gZnJvbSAnLi4vbGliL2NvZ25pdG8tc3RhY2snO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3QgYXBwU3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ0FwcFN0YWNrJyk7IC8vIENyZWF0ZSBhIG5ldyBTdGFjayBmb3IgdGhlIGFwcFxuXG5uZXcgQ29nbml0b1N0YWNrKGFwcFN0YWNrLCAnQ29nbml0b1N0YWNrJyk7IC8vIEluaXRpYWxpemUgdGhlIENvZ25pdG9TdGFjayBjb25zdHJ1Y3RcbiJdfQ==