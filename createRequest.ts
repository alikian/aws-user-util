import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import dynamodb from './dynamodb';

export const handler: APIGatewayProxyHandler = (event, context, callback) => {
    console.log(context);           // successful response
    let userName = "ali.kian"
    var params = {
        UserName: userName
    };
    console.log(event);           // successful response

    var iam = new AWS.IAM();
    iam.listUserTags(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            console.log(data.Tags);           // successful response
            let emailTag = data.Tags.find(tag => tag.Key.toLowerCase() == "email")
            console.log(emailTag.Value);           // successful response
            const id: string = uuid();
            console.log(id);
            const timestamp = new Date().getTime();
            const params = {
                TableName: process.env.DYNAMODB_TABLE,
                Item: {
                    id: id,
                    email: emailTag.Value,
                    createdAt: timestamp,
                    userName: userName,
                    updatedAt: null
                }
            };
            try {
                const data = dynamodb.put(params).promise();
                const response = {
                    statusCode: 200,
                    body: JSON.stringify({params, data}),
                };
                callback(null, response);

            } catch (error) {
                return {
                    statusCode: 400,
                    error: `Could not post: ${error.stack}`
                };
            }
            


        }

    });

}
