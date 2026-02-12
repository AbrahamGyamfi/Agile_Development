import { Amplify } from 'aws-amplify';

// Configure Amplify immediately when this module is imported
Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_CLIENT_ID,
    mandatorySignIn: true,
    authenticationFlowType: 'USER_SRP_AUTH'
  }
});

export const API_URL = process.env.REACT_APP_API_URL;
