import * as aws from 'aws-sdk';
import { createMigrateUserLambda } from './migrate-user-handler';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class CognitoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const sesClient = new aws.SES();

    // Check if the email identity already exists
    sesClient.getIdentityVerificationAttributes({
      Identities: ['yugank@brainerhub.com'],
    }, (err, data) => {
      if (err) {
        // An error occurred, handle it as needed
        console.error('Error checking email identity:', err);
        return;
      }

      if (data.VerificationAttributes && data.VerificationAttributes['yugank@brainerhub.com']) {
        // Email identity exists, no need to create it
        console.log('Email identity already exists:', data.VerificationAttributes['yugank@brainerhub.com']);
        return;
      }

      // Create an Amazon SES Identity for your email address
      const emailIdentity = new ses.CfnEmailIdentity(this, 'EmailIdentity', {
        emailIdentity: 'yugank@brainerhub.com', 
      });

      // Add a policy statement to allow Cognito to send emails through SES
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('cognito-idp.amazonaws.com')],
        resources: [emailIdentity.ref], // The ARN of the SES identity
      });
    });

    // Create a Cognito User Pool
    const userPoolProps: cognito.UserPoolProps = {
      userPoolName: 'UserPool',
      selfSignUpEnabled: false, // Allow users to sign up themselves
      signInAliases: { email: true }, // Enable sign-in with email
      autoVerify: { email: true }, // Automatically verify email addresses
      passwordPolicy: {
        minLength: 8, // Set password policy 
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: true,
      },
    };
    
    
    const userPool = new cognito.UserPool(this, 'UserPool', userPoolProps);
    // const userPool = new cognito.UserPool(this, 'UserPool', userPoolProps);
    // Inside the CognitoStack class
    const migrateUserLambda = createMigrateUserLambda(this, 'MigrateUserLambda');


    // Define the User Pool trigger
    
    userPool.addTrigger(cognito.UserPoolOperation.PRE_AUTHENTICATION, migrateUserLambda);


    // Create an App Client for the User Pool
    const appClient = userPool.addClient('AppClient', {
      authFlows: { adminUserPassword: true },
    });

    // Output the Cognito User Pool ID and App Client ID
    new cdk.CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId,
    });

    new cdk.CfnOutput(this, 'AppClientId', {
      value: appClient.userPoolClientId,
    });
  }
}

