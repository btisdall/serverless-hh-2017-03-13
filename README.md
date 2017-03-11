# Serverless Hamburg Talk 2017-03-13

Some code for a [Serverless Hamburg](https://www.meetup.com/Serverless-Hamburg/) talk which does the following:

1. Mocks up an instance registration service, such that might be used by a proprietary security appliance, using API Gateway, Lambda and DynamoDB.
2. Creates an auto scaling group containing a mock security appliance, plus SNS, SQS and Lambdas to automatically register newly created appliances with the registration service when an Auto Scaling `EC2_INSTANCE_LAUNCH` event occurs.
