import { MediaConvert } from 'aws-sdk';

/*
This function creates a job that will output a video thumbnail as a jpg. If you don't care about costs, 
don't want to deal with a 3rd party sdk such as sharp and keep everything with AWS this is useful, but mediaconvert must
have at least one video transcode, so I just added a simple one that you can hide somewhere in s3. 
*/
export const mp4ToThumbnail = (
    s3InputPath: string,
    s3OutputPath: string,
    bucketName: string,
    Queue: string,
    Role: string
  ): MediaConvert.CreateJobRequest => {
    return {
      Role,
      Queue,
      Settings: {
        Inputs: [
          {
            FileInput: `s3://${bucketName}/${s3InputPath}`, // S3 URL of the input file
          },
        ],
        OutputGroups: [
          {
            Name: 'File Group',
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: `s3://${bucketName}/${s3OutputPath}/`, // Replace with your output S3 bucket
              },
            },
            Outputs: [
              {
                // Video output (compressed or low-resolution version)
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      // You can adjust these settings according to your needs
                      RateControlMode: 'CBR',
                      Bitrate: 5000000, // Example bitrate
                    },
                  },
                },
                ContainerSettings: {
                  Container: 'MP4',
                },
              },
              {
                VideoDescription: {
                  ScalingBehavior: 'DEFAULT',
                  TimecodeInsertion: 'DISABLED',
                  AntiAlias: 'ENABLED',
                  Sharpness: 50,
                  CodecSettings: {
                    Codec: 'FRAME_CAPTURE',
                    FrameCaptureSettings: {
                      FramerateNumerator: 1,
                      FramerateDenominator: 5, // Adjust the frame rate for thumbnail extraction frequency
                      MaxCaptures: 1, // Number of thumbnails to capture
                      Quality: 80,
                    },
                  },
                  DropFrameTimecode: 'ENABLED',
                  ColorMetadata: 'INSERT',
                },
                ContainerSettings: {
                  Container: 'RAW',
                },
                Extension: 'jpg', // Set the output file extension to jpg
              },
            ],
          },
        ],
      },
    };
  };