import { MediaConvert } from 'aws-sdk';

/*
This function creates a job that will output a 3-4 second medium resolution cut of the video passed in. This is common
in media apps like tiktok or instagram reels when viewing all the videos a user has created. The frontend usually displays these
in a loop within some kind of grid.
*/
export const boomerangJob = (
    inputPath: string,
    outputPath: string,
    bucketName: string,
    Queue: string,
    Role: string
  ): MediaConvert.CreateJobRequest => {
    return {
      Queue,
      Role,
      Settings: {
        TimecodeConfig: {
          Source: 'ZEROBASED',
        },
        Inputs: [
          {
            AudioSelectors: {
              'Audio Selector 1': {
                Offset: 0,
                DefaultSelection: 'NOT_DEFAULT',
                ProgramSelection: 1,
                SelectorType: 'TRACK',
                Tracks: [1],
              },
            },
            VideoSelector: {
              ColorSpace: 'FOLLOW',
            },
            FilterEnable: 'AUTO',
            PsiControl: 'USE_PSI',
            FilterStrength: 0,
            DeblockFilter: 'DISABLED',
            DenoiseFilter: 'DISABLED',
            TimecodeSource: 'EMBEDDED',
            FileInput: 's3://' + bucketName + '/' + inputPath,
          },
        ],
        OutputGroups: [
          {
            Name: 'File Group',
            Outputs: [
              {
                ContainerSettings: {
                  Container: 'MP4',
                  Mp4Settings: {},
                },
                VideoDescription: {
                  Width: 100,
                  Height: 178,
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      MaxBitrate: 3500000,
                      RateControlMode: 'QVBR',
                      SceneChangeDetect: 'TRANSITION_DETECTION',
                    },
                  },
                },
              },
            ],
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination: 's3://' + bucketName + outputPath,
              },
            },
          },
        ],
      },
      AccelerationSettings: {
        Mode: 'DISABLED',
      },
      StatusUpdateInterval: 'SECONDS_60',
      Priority: 0,
      HopDestinations: [],
    };
  };