import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk';



export const hello: APIGatewayProxyHandler = (event, context, callback) => {
  console.log(context);           // successful response
  var params = {
    UserName: "ali.kian"
  };
  var iam = new AWS.IAM();
  iam.listUserTags(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log(data.Tags);           // successful response
      let emailTag = data.Tags.find(tag => tag.Key.toLowerCase() == "email")
      console.log(emailTag.Value);           // successful response

      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Go Serverless Webpack (Typescript) v1.0! Your function executed successfully!',
          input: event,
        }, null, 2),
      };
      callback(null, response);
    }

  });

}

