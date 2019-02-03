const aws_api_config =  {
    endpoints: [
        {
            name: "MyAPIGatewayAPI",
            endpoint: "https://nifhfdfnti.execute-api.ca-central-1.amazonaws.com",
            region: "ca-central-1",
            service: "execute-api"
        }
        /*
        ,
        {
            name: "MyCustomCloudFrontApi",
            endpoint: "https://api.my-custom-cloudfront-domain.com",

        },
        {
            name: "MyCustomLambdaApi",
            endpoint: "https://lambda.us-east-1.amazonaws.com/2015-03-31/functions/yourFuncName/invocations",
            service: "lambda",
            region: "us-east-1"
        }
        */
    ]
};

export default aws_api_config;