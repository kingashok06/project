#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CognitoStack } from '../lib/cognito-stack';

const app = new cdk.App();
const appStack = new cdk.Stack(app, 'AppStack'); // Create a new Stack for the app

new CognitoStack(appStack, 'CognitoStack'); // Initialize the CognitoStack construct
