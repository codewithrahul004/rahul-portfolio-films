import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setOverwriteOutput(true);
// Every source clip is constant 30fps and the compositions are 30fps, so a
// frame of picture is a frame of source. Nothing is resampled.
