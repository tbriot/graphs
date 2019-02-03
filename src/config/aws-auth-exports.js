const aws_auth_config =  {

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    identityPoolId: 'ca-central-1:6d06ec18-2f08-4155-8f7b-2112114ab8e7',
    
    // REQUIRED - Amazon Cognito Region
    region: 'ca-central-1',

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ca-central-1_K3beAahIZ',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '72jkkmo5pdeus5ksubkl34fc92',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    //mandatorySignIn: false,

    
    /*

    // OPTIONAL - Configuration for cookie storage
    cookieStorage: {
    // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: '.yourdomain.com',
    // OPTIONAL - Cookie path
        path: '/',
    // OPTIONAL - Cookie expiration in days
        expires: 365,
    // OPTIONAL - Cookie secure flag
        secure: true
    },

    // OPTIONAL - customized storage object
    storage: new MyStorage(),
    
    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    authenticationFlowType: 'USER_PASSWORD_AUTH'

    */
};


export default aws_auth_config;