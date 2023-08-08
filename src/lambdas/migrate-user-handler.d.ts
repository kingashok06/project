import { CognitoUserPoolTriggerEvent } from 'aws-lambda';
export declare const migrateUserHandler: (event: CognitoUserPoolTriggerEvent) => Promise<CognitoUserPoolTriggerEvent>;
