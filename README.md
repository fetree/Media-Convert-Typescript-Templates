# AWS MediaConvert Typescript templates

Hi there, these files contain TS functions to create AWS mediaconvert job templates to transcode videos for common use cases.


# Usage
AWS V2:
```
const job = return templateFunctionName(
	s3InputPath,
	s3OutputPath,
	bucketName,
	mediaConvertQueue,
	mediaConvertRole
);
await mediaConvert.createJob(job).promise();
```
