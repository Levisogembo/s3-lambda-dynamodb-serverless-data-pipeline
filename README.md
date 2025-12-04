# s3-lambda-dynamodb-serverless-data-pipeline
This is an AWS serverless data pipeline infrastructure that stores files in AWS S3 and invokes AWS Lambda to store file metadata in Dynamo DB. A lightweight, event-driven serverless pipeline that automatically processes file uploads from Amazon S3 and stores metadata in Amazon DynamoDB.

## How It Works
1. **File Upload** → User uploads a file to configured S3 bucket
2. **Event Trigger** → S3 automatically invokes Lambda function via event notification
3. **Metadata Extraction** → Lambda extracts file metadata (filename, size, eTag, etc.)
4. **Data Storage** → Lambda writes structured metadata to DynamoDB table
5. **Result** → File metadata is now queryable in DynamoDB

## Technologies Used
| Service | Purpose | Role |
|---------|---------|------|
| **Amazon S3** | File storage and event source | Trigger source |
| **AWS Lambda** | Serverless compute | Data processor |
| **Amazon DynamoDB** | NoSQL database | Metadata storage |
| **Amazon KMS** | Data encryption | Securely store enviroment variables |
| **IAM Roles** | Security & permissions | Access control |

## Use Cases
1. **Document management systems** 
2. **File audit trails and logging** 
3. **Automated data processing pipelines** 

## Setup & Deployment
1. **Create S3 bucket with event notifications**
2. **Deploy Lambda function with DynamoDB permissions**
3. **Create DynamoDB table with appropriate keys**
4. **Configure S3 to trigger Lambda on object creation**
5. **Ensure the table name is encrypted with KMS under enviroment variables for security**

