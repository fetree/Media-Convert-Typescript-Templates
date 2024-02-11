import { MediaConvert } from 'aws-sdk';

/*
This function takes in a path from S3 and outputs the video in the following resolutions:
480p
720p
1080p
It also creates a "boomerang" preview as well as a thumbnail. 
These are popular for building any apps that display media.
*/

export const mp4Compress = (
    bucketName: string,
    inputPath: string,
    outputPath: string,
    Queue: string,
    Role: string,

  ): MediaConvert.CreateJobRequest => {
    return {
      Queue,
      Role,
      Settings: {
        Inputs: [
          {
            AudioSelectors: {
              'Audio Selector 1': {
                Offset: 0,
                DefaultSelection: 'DEFAULT',
                ProgramSelection: 1,
                SelectorType: 'TRACK',
              },
            },
            FileInput: 's3://' + bucketName + '/' + inputPath,
          },
        ],
        OutputGroups: [
          {
            Name: 'File Group',
            Outputs: [
              {
                ContainerSettings: {
                  Container: 'RAW',
                },
                VideoDescription: {
                  Width: 1080,
                  Height: 1920,
                  CodecSettings: {
                    Codec: 'FRAME_CAPTURE',
                    FrameCaptureSettings: {
                      FramerateNumerator: 30,
                      FramerateDenominator: 88,
                      MaxCaptures: 1,
                      Quality: 80,
                    },
                  },
                },
                Extension: 'jpg',
              },
            ],
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination:
                  's3://' +
                  bucketName +
                  '/' +
                  outputPath
              },
            },
          },
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
                Destination:
                  's3://' +
                  bucketName +
                  '/' +
                  outputPath +
                  '/preview/',
              },
            },
          },
          {
            Name: 'MP4 Group',
            OutputGroupSettings: {
              Type: 'FILE_GROUP_SETTINGS',
              FileGroupSettings: {
                Destination:
                  's3://' +
                  bucketName +
                  '/' +
                  outputPath
              },
            },
            Outputs: [
              {
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      RateControlMode: 'VBR',
                      Bitrate: 5000000, // Adjust the bitrate as desired (in bits per second)
                      CodecProfile: 'MAIN',
                      CodecLevel: 'AUTO',
                      MaxBitrate: 6000000,
                      //BufSize: 5000000,
                    },
                  },
                  Height: 1080,
                  ScalingBehavior: 'DEFAULT',
                  TimecodeInsertion: 'DISABLED',
                  AntiAlias: 'ENABLED',
                },
                ContainerSettings: {
                  Container: 'MP4',
                  Mp4Settings: {
                    CslgAtom: 'INCLUDE',
                    CttsVersion: 0,
                    FreeSpaceBox: 'EXCLUDE',
                    MoovPlacement: 'NORMAL',
                  },
                },
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: 'NORMAL',
                        RateControlMode: 'CBR',
                        CodecProfile: 'LC',
                        CodingMode: 'CODING_MODE_2_0',
                        SampleRate: 48000,
                        Bitrate: 64000, // Adjust the bitrate as desired (in bits per second)
                        RawFormat: 'NONE',
                      },
                    },
                    LanguageCodeControl: 'FOLLOW_INPUT',
                    AudioTypeControl: 'FOLLOW_INPUT',
                  },
                ],
                NameModifier: '_high',
              },
              {
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      RateControlMode: 'VBR',
                      Bitrate: 3000000, // Adjust the bitrate as desired (in bits per second)
                      CodecProfile: 'MAIN',
                      CodecLevel: 'AUTO',
                      MaxBitrate: 3600000,
                    },
                  },
                  Height: 720,
                  ScalingBehavior: 'DEFAULT',
                  TimecodeInsertion: 'DISABLED',
                  AntiAlias: 'ENABLED',
                },
                ContainerSettings: {
                  Container: 'MP4',
                  Mp4Settings: {
                    CslgAtom: 'INCLUDE',
                    CttsVersion: 0,
                    FreeSpaceBox: 'EXCLUDE',
                    MoovPlacement: 'NORMAL',
                  },
                },
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: 'NORMAL',
                        RateControlMode: 'CBR',
                        CodecProfile: 'LC',
                        CodingMode: 'CODING_MODE_2_0',
                        SampleRate: 48000,
                        Bitrate: 64000, // Adjust the bitrate as desired (in bits per second)
                        RawFormat: 'NONE',
                      },
                    },
                    LanguageCodeControl: 'FOLLOW_INPUT',
                    AudioTypeControl: 'FOLLOW_INPUT',
                  },
                ],
                NameModifier: '_high_mid',
              },
              {
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      RateControlMode: 'VBR',
                      Bitrate: 1500000, // Adjust the bitrate as desired (in bits per second)
                      CodecProfile: 'MAIN',
                      CodecLevel: 'AUTO',
                      MaxBitrate: 1800000,
                    },
                  },
                  Height: 480,
                  ScalingBehavior: 'DEFAULT',
                  TimecodeInsertion: 'DISABLED',
                  AntiAlias: 'ENABLED',
                },
                ContainerSettings: {
                  Container: 'MP4',
                  Mp4Settings: {
                    CslgAtom: 'INCLUDE',
                    CttsVersion: 0,
                    FreeSpaceBox: 'EXCLUDE',
                    MoovPlacement: 'NORMAL',
                  },
                },
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: 'NORMAL',
                        RateControlMode: 'CBR',
                        CodecProfile: 'LC',
                        CodingMode: 'CODING_MODE_2_0',
                        SampleRate: 48000,
                        Bitrate: 64000, // Adjust the bitrate as desired (in bits per second)
                        RawFormat: 'NONE',
                      },
                    },
                    LanguageCodeControl: 'FOLLOW_INPUT',
                    AudioTypeControl: 'FOLLOW_INPUT',
                  },
                ],
                NameModifier: '_mid',
              },
              {
                VideoDescription: {
                  CodecSettings: {
                    Codec: 'H_264',
                    H264Settings: {
                      RateControlMode: 'VBR',
                      Bitrate: 800000, // Adjust the bitrate as desired (in bits per second)
                      CodecProfile: 'MAIN',
                      CodecLevel: 'AUTO',
                      MaxBitrate: 960000,
                    },
                  },
                  Height: 360,
                  ScalingBehavior: 'DEFAULT',
                  TimecodeInsertion: 'DISABLED',
                  AntiAlias: 'ENABLED',
                },
                ContainerSettings: {
                  Container: 'MP4',
                  Mp4Settings: {
                    CslgAtom: 'INCLUDE',
                    CttsVersion: 0,
                    FreeSpaceBox: 'EXCLUDE',
                    MoovPlacement: 'NORMAL',
                  },
                },
                AudioDescriptions: [
                  {
                    CodecSettings: {
                      Codec: 'AAC',
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: 'NORMAL',
                        RateControlMode: 'CBR',
                        CodecProfile: 'LC',
                        CodingMode: 'CODING_MODE_2_0',
                        SampleRate: 48000,
                        Bitrate: 64000, // Adjust the bitrate as desired (in bits per second)
                        RawFormat: 'NONE',
                      },
                    },
                    LanguageCodeControl: 'FOLLOW_INPUT',
                    AudioTypeControl: 'FOLLOW_INPUT',
                  },
                ],
                NameModifier: '_low',
              },
            ],
          },
        ],
      },
    };
  };