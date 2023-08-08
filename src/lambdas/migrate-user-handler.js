"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.migrateUserHandler = void 0;
const CognitoIdentityServiceProvider = require("aws-sdk/clients/cognitoidentityserviceprovider");
const axios_1 = require("axios"); // You may need to install the axios package
const cognitoIdentityProvider = new CognitoIdentityServiceProvider();
const migrateUserHandler = async (event) => {
    console.log('Received event:', JSON.stringify(event));
    if (event.triggerSource === 'UserMigration_Authentication') {
        try {
            // Authenticate against Keycloak using OpenID Connect
            const response = await axios_1.default.post('https://keycloak.novacloud.app/auth/realms/rekap-dev/protocol/openid-connect/token', `grant_type=password&client_id=cognito&client_secret=c0f105ad-f5ac-4ee3-8715-8e61e04f5be0&username=${event.userName}&password=${event.request.password}`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
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
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    else if (event.triggerSource === 'UserMigration_ForgotPassword') {
        try {
            // TODO: Find user in the previous system
            // Retrieve user data and populate response attributes
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }
    else {
        throw new Error(`Bad TriggerSource ${event.triggerSource}`);
    }
    return event;
};
exports.migrateUserHandler = migrateUserHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlncmF0ZS11c2VyLWhhbmRsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtaWdyYXRlLXVzZXItaGFuZGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpR0FBaUc7QUFFakcsaUNBQTBCLENBQUMsNENBQTRDO0FBRXZFLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSw4QkFBOEIsRUFBRSxDQUFDO0FBRTlELE1BQU0sa0JBQWtCLEdBQUcsS0FBSyxFQUFFLEtBQWtDLEVBQXdDLEVBQUU7SUFDbkgsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFFdEQsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLDhCQUE4QixFQUFFO1FBQzFELElBQUk7WUFDRixxREFBcUQ7WUFDckQsTUFBTSxRQUFRLEdBQUcsTUFBTSxlQUFLLENBQUMsSUFBSSxDQUMvQixvRkFBb0YsRUFDcEYscUdBQXFHLEtBQUssQ0FBQyxRQUFRLGFBQWEsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFDeEosRUFBRSxPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsbUNBQW1DLEVBQUUsRUFBRSxDQUNyRSxDQUFDO1lBRUYsSUFBSSxRQUFRLENBQUMsTUFBTSxLQUFLLEdBQUcsRUFBRTtnQkFDM0IsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2FBQzNEO1lBRUQsOEJBQThCO1lBQzlCLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZSxHQUFHLFdBQVcsQ0FBQztZQUM3QyxLQUFLLENBQUMsUUFBUSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7WUFDMUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEdBQUc7Z0JBQzlCLGNBQWMsRUFBRSxNQUFNO2FBQ3ZCLENBQUM7WUFFRix1R0FBdUc7U0FFeEc7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDbkIsTUFBTSxHQUFHLENBQUM7U0FDWDtLQUNGO1NBQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLDhCQUE4QixFQUFFO1FBQ2pFLElBQUk7WUFDRix5Q0FBeUM7WUFFekMsc0RBQXNEO1NBRXZEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sR0FBRyxDQUFDO1NBQ1g7S0FDRjtTQUFNO1FBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxxQkFBcUIsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7S0FDN0Q7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUMsQ0FBQztBQTVDVyxRQUFBLGtCQUFrQixzQkE0QzdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQ29nbml0b0lkZW50aXR5U2VydmljZVByb3ZpZGVyIGZyb20gJ2F3cy1zZGsvY2xpZW50cy9jb2duaXRvaWRlbnRpdHlzZXJ2aWNlcHJvdmlkZXInO1xuaW1wb3J0IHsgQ29nbml0b1VzZXJQb29sVHJpZ2dlckV2ZW50IH0gZnJvbSAnYXdzLWxhbWJkYSc7XG5pbXBvcnQgYXhpb3MgZnJvbSAnYXhpb3MnOyAvLyBZb3UgbWF5IG5lZWQgdG8gaW5zdGFsbCB0aGUgYXhpb3MgcGFja2FnZVxuXG5jb25zdCBjb2duaXRvSWRlbnRpdHlQcm92aWRlciA9IG5ldyBDb2duaXRvSWRlbnRpdHlTZXJ2aWNlUHJvdmlkZXIoKTtcblxuZXhwb3J0IGNvbnN0IG1pZ3JhdGVVc2VySGFuZGxlciA9IGFzeW5jIChldmVudDogQ29nbml0b1VzZXJQb29sVHJpZ2dlckV2ZW50KTogUHJvbWlzZTxDb2duaXRvVXNlclBvb2xUcmlnZ2VyRXZlbnQ+ID0+IHtcbiAgY29uc29sZS5sb2coJ1JlY2VpdmVkIGV2ZW50OicsIEpTT04uc3RyaW5naWZ5KGV2ZW50KSk7XG5cbiAgaWYgKGV2ZW50LnRyaWdnZXJTb3VyY2UgPT09ICdVc2VyTWlncmF0aW9uX0F1dGhlbnRpY2F0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICAvLyBBdXRoZW50aWNhdGUgYWdhaW5zdCBLZXljbG9hayB1c2luZyBPcGVuSUQgQ29ubmVjdFxuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBheGlvcy5wb3N0KFxuICAgICAgICAnaHR0cHM6Ly9rZXljbG9hay5ub3ZhY2xvdWQuYXBwL2F1dGgvcmVhbG1zL3Jla2FwLWRldi9wcm90b2NvbC9vcGVuaWQtY29ubmVjdC90b2tlbicsXG4gICAgICAgIGBncmFudF90eXBlPXBhc3N3b3JkJmNsaWVudF9pZD1jb2duaXRvJmNsaWVudF9zZWNyZXQ9YzBmMTA1YWQtZjVhYy00ZWUzLTg3MTUtOGU2MWUwNGY1YmUwJnVzZXJuYW1lPSR7ZXZlbnQudXNlck5hbWV9JnBhc3N3b3JkPSR7ZXZlbnQucmVxdWVzdC5wYXNzd29yZH1gLFxuICAgICAgICB7IGhlYWRlcnM6IHsgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnIH0gfVxuICAgICAgKTtcblxuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignQXV0aGVudGljYXRpb24gYWdhaW5zdCBLZXljbG9hayBmYWlsZWQnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gU2V0IHRoZSByZXNwb25zZSBhdHRyaWJ1dGVzXG4gICAgICBldmVudC5yZXNwb25zZS5maW5hbFVzZXJTdGF0dXMgPSAnQ09ORklSTUVEJztcbiAgICAgIGV2ZW50LnJlc3BvbnNlLm1lc3NhZ2VBY3Rpb24gPSAnU1VQUFJFU1MnO1xuICAgICAgZXZlbnQucmVzcG9uc2UudXNlckF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIGVtYWlsX3ZlcmlmaWVkOiAndHJ1ZScsXG4gICAgICB9O1xuXG4gICAgICAvLyBSZXRyaWV2ZSBhZGRpdGlvbmFsIHVzZXIgYXR0cmlidXRlcyBmcm9tIEtleWNsb2FrIGFuZCBwb3B1bGF0ZSB0aGVtIGluIGV2ZW50LnJlc3BvbnNlLnVzZXJBdHRyaWJ1dGVzXG5cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZXZlbnQudHJpZ2dlclNvdXJjZSA9PT0gJ1VzZXJNaWdyYXRpb25fRm9yZ290UGFzc3dvcmQnKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIFRPRE86IEZpbmQgdXNlciBpbiB0aGUgcHJldmlvdXMgc3lzdGVtXG5cbiAgICAgIC8vIFJldHJpZXZlIHVzZXIgZGF0YSBhbmQgcG9wdWxhdGUgcmVzcG9uc2UgYXR0cmlidXRlc1xuXG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihgQmFkIFRyaWdnZXJTb3VyY2UgJHtldmVudC50cmlnZ2VyU291cmNlfWApO1xuICB9XG5cbiAgcmV0dXJuIGV2ZW50O1xufTtcbiJdfQ==