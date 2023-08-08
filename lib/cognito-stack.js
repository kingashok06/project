"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoStack = void 0;
const cdk = require("@aws-cdk/core");
const cognito = require("@aws-cdk/aws-cognito");
const ses = require("@aws-cdk/aws-ses");
const iam = require("@aws-cdk/aws-iam");
const aws = require("aws-sdk");
const lambda = require("aws-cdk-lib/aws-lambda");
const path = require("path"); // Import the path module
class CognitoStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        const userPoolProps = {
            userPoolName: 'UserPool',
            selfSignUpEnabled: false,
            signInAliases: { email: true },
            autoVerify: { email: true },
            passwordPolicy: {
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true,
            },
        };
        const userPool = new cognito.UserPool(this, 'UserPool', userPoolProps);
        const migrateUserLambda = new lambda.Function(this, 'MigrateUserLambda', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'migrateUserHandler',
            code: lambda.Code.fromAsset(path.join(__dirname, '/home/dev25/Videos/cognito/src/lambdas/migrate-user-handler.ts')),
        });
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
exports.CognitoStack = CognitoStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29nbml0by1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvZ25pdG8tc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQXFDO0FBQ3JDLGdEQUFnRDtBQUNoRCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLCtCQUErQjtBQUMvQixpREFBaUQ7QUFDakQsNkJBQTZCLENBQUMseUJBQXlCO0FBRXZELE1BQWEsWUFBYSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3pDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFaEMsNkNBQTZDO1FBQzdDLFNBQVMsQ0FBQyxpQ0FBaUMsQ0FBQztZQUMxQyxVQUFVLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztTQUN0QyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2YsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AseUNBQXlDO2dCQUN6QyxPQUFPLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNyRCxPQUFPO2FBQ1I7WUFFRCxJQUFJLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsdUJBQXVCLENBQUMsRUFBRTtnQkFDdkYsOENBQThDO2dCQUM5QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxFQUFFLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BHLE9BQU87YUFDUjtZQUVELHVEQUF1RDtZQUN2RCxNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO2dCQUNwRSxhQUFhLEVBQUUsdUJBQXVCO2FBQ3ZDLENBQUMsQ0FBQztZQUVILHFFQUFxRTtZQUNyRSxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQ3RCLE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQztnQkFDOUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSztnQkFDeEIsVUFBVSxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsMkJBQTJCLENBQUMsQ0FBQztnQkFDbkUsU0FBUyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLDhCQUE4QjthQUMvRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUdILDZCQUE2QjtRQUM3QixNQUFNLGFBQWEsR0FBMEI7WUFDM0MsWUFBWSxFQUFFLFVBQVU7WUFDeEIsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO1lBQzlCLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7WUFDM0IsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2dCQUNaLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGFBQWEsRUFBRSxJQUFJO2dCQUNuQixjQUFjLEVBQUUsSUFBSTthQUNyQjtTQUNGLENBQUM7UUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUV2RSxNQUFNLGlCQUFpQixHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUU7WUFDdkUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsb0JBQW9CO1lBQzdCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnRUFBZ0UsQ0FBQyxDQUFDO1NBQ3BILENBQUMsQ0FBQztRQUdILCtCQUErQjtRQUMvQixRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBR3JGLHlDQUF5QztRQUN6QyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRTtZQUNoRCxTQUFTLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUU7U0FDdkMsQ0FBQyxDQUFDO1FBRUgsb0RBQW9EO1FBQ3BELElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ3BDLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtTQUMzQixDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsU0FBUyxDQUFDLGdCQUFnQjtTQUNsQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUEvRUQsb0NBK0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgY29nbml0byBmcm9tICdAYXdzLWNkay9hd3MtY29nbml0byc7XG5pbXBvcnQgKiBhcyBzZXMgZnJvbSAnQGF3cy1jZGsvYXdzLXNlcyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBhd3MgZnJvbSAnYXdzLXNkayc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnOyAvLyBJbXBvcnQgdGhlIHBhdGggbW9kdWxlXG5cbmV4cG9ydCBjbGFzcyBDb2duaXRvU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qgc2VzQ2xpZW50ID0gbmV3IGF3cy5TRVMoKTtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBlbWFpbCBpZGVudGl0eSBhbHJlYWR5IGV4aXN0c1xuICAgIHNlc0NsaWVudC5nZXRJZGVudGl0eVZlcmlmaWNhdGlvbkF0dHJpYnV0ZXMoe1xuICAgICAgSWRlbnRpdGllczogWyd5dWdhbmtAYnJhaW5lcmh1Yi5jb20nXSxcbiAgICB9LCAoZXJyLCBkYXRhKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIC8vIEFuIGVycm9yIG9jY3VycmVkLCBoYW5kbGUgaXQgYXMgbmVlZGVkXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNoZWNraW5nIGVtYWlsIGlkZW50aXR5OicsIGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGEuVmVyaWZpY2F0aW9uQXR0cmlidXRlcyAmJiBkYXRhLlZlcmlmaWNhdGlvbkF0dHJpYnV0ZXNbJ3l1Z2Fua0BicmFpbmVyaHViLmNvbSddKSB7XG4gICAgICAgIC8vIEVtYWlsIGlkZW50aXR5IGV4aXN0cywgbm8gbmVlZCB0byBjcmVhdGUgaXRcbiAgICAgICAgY29uc29sZS5sb2coJ0VtYWlsIGlkZW50aXR5IGFscmVhZHkgZXhpc3RzOicsIGRhdGEuVmVyaWZpY2F0aW9uQXR0cmlidXRlc1sneXVnYW5rQGJyYWluZXJodWIuY29tJ10pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIENyZWF0ZSBhbiBBbWF6b24gU0VTIElkZW50aXR5IGZvciB5b3VyIGVtYWlsIGFkZHJlc3NcbiAgICAgIGNvbnN0IGVtYWlsSWRlbnRpdHkgPSBuZXcgc2VzLkNmbkVtYWlsSWRlbnRpdHkodGhpcywgJ0VtYWlsSWRlbnRpdHknLCB7XG4gICAgICAgIGVtYWlsSWRlbnRpdHk6ICd5dWdhbmtAYnJhaW5lcmh1Yi5jb20nLCBcbiAgICAgIH0pO1xuXG4gICAgICAvLyBBZGQgYSBwb2xpY3kgc3RhdGVtZW50IHRvIGFsbG93IENvZ25pdG8gdG8gc2VuZCBlbWFpbHMgdGhyb3VnaCBTRVNcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydzZXM6U2VuZEVtYWlsJywgJ3NlczpTZW5kUmF3RW1haWwnXSxcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2duaXRvLWlkcC5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICByZXNvdXJjZXM6IFtlbWFpbElkZW50aXR5LnJlZl0sIC8vIFRoZSBBUk4gb2YgdGhlIFNFUyBpZGVudGl0eVxuICAgICAgfSk7XG4gICAgfSk7XG5cblxuICAgIC8vIENyZWF0ZSBhIENvZ25pdG8gVXNlciBQb29sXG4gICAgY29uc3QgdXNlclBvb2xQcm9wczogY29nbml0by5Vc2VyUG9vbFByb3BzID0ge1xuICAgICAgdXNlclBvb2xOYW1lOiAnVXNlclBvb2wnLFxuICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IGZhbHNlLCAvLyBBbGxvdyB1c2VycyB0byBzaWduIHVwIHRoZW1zZWx2ZXNcbiAgICAgIHNpZ25JbkFsaWFzZXM6IHsgZW1haWw6IHRydWUgfSwgLy8gRW5hYmxlIHNpZ24taW4gd2l0aCBlbWFpbFxuICAgICAgYXV0b1ZlcmlmeTogeyBlbWFpbDogdHJ1ZSB9LCAvLyBBdXRvbWF0aWNhbGx5IHZlcmlmeSBlbWFpbCBhZGRyZXNzZXNcbiAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgIG1pbkxlbmd0aDogOCwgLy8gU2V0IHBhc3N3b3JkIHBvbGljeSBcbiAgICAgICAgcmVxdWlyZUxvd2VyY2FzZTogdHJ1ZSxcbiAgICAgICAgcmVxdWlyZVVwcGVyY2FzZTogdHJ1ZSxcbiAgICAgICAgcmVxdWlyZURpZ2l0czogdHJ1ZSxcbiAgICAgICAgcmVxdWlyZVN5bWJvbHM6IHRydWUsXG4gICAgICB9LFxuICAgIH07XG5cbiAgICBjb25zdCB1c2VyUG9vbCA9IG5ldyBjb2duaXRvLlVzZXJQb29sKHRoaXMsICdVc2VyUG9vbCcsIHVzZXJQb29sUHJvcHMpO1xuXG4gICAgY29uc3QgbWlncmF0ZVVzZXJMYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHRoaXMsICdNaWdyYXRlVXNlckxhbWJkYScsIHtcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgICAgaGFuZGxlcjogJ21pZ3JhdGVVc2VySGFuZGxlcicsXG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJy9ob21lL2RldjI1L1ZpZGVvcy9jb2duaXRvL3NyYy9sYW1iZGFzL21pZ3JhdGUtdXNlci1oYW5kbGVyLnRzJykpLFxuICAgIH0pO1xuICAgIFxuXG4gICAgLy8gRGVmaW5lIHRoZSBVc2VyIFBvb2wgdHJpZ2dlclxuICAgIHVzZXJQb29sLmFkZFRyaWdnZXIoY29nbml0by5Vc2VyUG9vbE9wZXJhdGlvbi5QUkVfQVVUSEVOVElDQVRJT04sIG1pZ3JhdGVVc2VyTGFtYmRhKTtcblxuXG4gICAgLy8gQ3JlYXRlIGFuIEFwcCBDbGllbnQgZm9yIHRoZSBVc2VyIFBvb2xcbiAgICBjb25zdCBhcHBDbGllbnQgPSB1c2VyUG9vbC5hZGRDbGllbnQoJ0FwcENsaWVudCcsIHtcbiAgICAgIGF1dGhGbG93czogeyBhZG1pblVzZXJQYXNzd29yZDogdHJ1ZSB9LFxuICAgIH0pO1xuXG4gICAgLy8gT3V0cHV0IHRoZSBDb2duaXRvIFVzZXIgUG9vbCBJRCBhbmQgQXBwIENsaWVudCBJRFxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdVc2VyUG9vbElkJywge1xuICAgICAgdmFsdWU6IHVzZXJQb29sLnVzZXJQb29sSWQsXG4gICAgfSk7XG5cbiAgICBuZXcgY2RrLkNmbk91dHB1dCh0aGlzLCAnQXBwQ2xpZW50SWQnLCB7XG4gICAgICB2YWx1ZTogYXBwQ2xpZW50LnVzZXJQb29sQ2xpZW50SWQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==