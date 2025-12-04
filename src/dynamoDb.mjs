import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import {getFileExtension, cleanETag} from "./utils.mjs"

const client = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(client)//enables automatic conversion to dynamo db types

export async function saveS3MetadataToDynamoDB(s3Object, eventMetadata, tableName) {
    try {
        // Validate required fields
        if (!s3Object?.eTag || !s3Object?.key) {
            throw new Error('Missing required fields: eTag and key are required');
        }

        // Build the DynamoDB item
        const item = {
            // Partition Key (eTag)
            'eTag': cleanETag(s3Object.eTag),        
            // Sort Key (filename)
            'key': decodeURIComponent(s3Object.key),
            'size': s3Object.size || 0,
            'versionId': s3Object.versionId || 'null',
            'sequencer': s3Object.sequencer || '',          
            // Additional metadata from event
            'bucket': eventMetadata.bucketName,
            'eventTime': eventMetadata.eventTime,
            'eventName': eventMetadata.eventName,
            'uploadTimestamp': new Date().toISOString(),
            'fileExtension': getFileExtension(s3Object.key)
        };

        console.log('Preparing DynamoDB item:', JSON.stringify(item, null, 2));

        // Create and execute PutCommand
        const command = new PutCommand({
            TableName: tableName,
            Item: item,
        })

        const result = await docClient.send(command);
        
        console.log(`Successfully saved ${item.key} to DynamoDB table ${tableName}`);
        
        return {
            success: true,
            item: item,
            metadata: {
                tableName: tableName,
                eTag: item.eTag,
                key: item.key
            }
        };

    } catch (error) {
        console.error('Error saving to DynamoDB:', error);
        
        // Special handling for conditional check failures
        if (error.name === 'ConditionalCheckFailedException') {
            return {
                success: false,
                error: 'Item already exists in DynamoDB',
                errorType: 'DuplicateItem',
                item: null
            };
        }
        
        return {
            success: false,
            error: error.message,
            errorType: error.name || 'UnknownError',
            item: null
        };
    }
}

export async function processSingleS3Upload(s3EventRecord, tableName) {
    // Extract data from S3 event record
    const s3 = s3EventRecord.s3;
    const s3Object = s3.object;
    
    const eventMetadata = {
        bucketName: s3.bucket.name,
        eventTime: s3EventRecord.eventTime,
        eventName: s3EventRecord.eventName
    };
    
    return await saveS3MetadataToDynamoDB(s3Object, eventMetadata, tableName);
}