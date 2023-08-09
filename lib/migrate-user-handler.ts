import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import axios from 'axios'; // You may need to install the axios package
import { Construct } from 'constructs';

const cognitoIdentityProvider = new CognitoIdentityServiceProvider();

export const createMigrateUserLambda = (scope: Construct, id: string): lambda.Function => {
  return new lambda.Function(scope, id, {
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'migrate-user-lambda.migrateUserHandler',
    code: lambda.Code.fromAsset(__dirname), 
  });
};

export const migrateUserHandler = async (event: CognitoUserPoolTriggerEvent): Promise<CognitoUserPoolTriggerEvent> => {
  console.log('Received event:', JSON.stringify(event));

  if (event.triggerSource === 'UserMigration_Authentication') {
    try {
      // Authenticate against Keycloak using OpenID Connect
      const response = await axios.post(
        'https://keycloak.novacloud.app/auth/realms/rekap-dev/protocol/openid-connect/token',
        `grant_type=password&client_id=cognito&client_secret=c0f105ad-f5ac-4ee3-8715-8e61e04f5be0&username=${event.userName}&password=${event.request.password}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      if (response.status !== 200) {
        throw new Error('Authentication against Keycloak failed');
      }
      
      // Set the response attributes
      event.response.finalUserStatus = 'CONFIRMED';
      event.response.messageAction = 'SUPPRESS';
      event.response.userAttributes = {
        email_verified: 'true',
      };

      // Retrieve additional user attributes from Keycloak and populate them in event.response.userAttributes

    } catch (err) {
      console.error(err);
      throw err;
    }
  } else {
    throw new Error(`Bad TriggerSource ${event.triggerSource}`);
  }

  return event;
};
