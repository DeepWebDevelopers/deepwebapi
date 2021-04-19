import { Config } from './interfaces/config';
import * as File from './config/config.json';
import { Terminal } from './client/client';

new Terminal().start(File as Config);
