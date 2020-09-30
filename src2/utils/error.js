/**
 * Error class for VDK
 * You can change the error code for project's requirement in error config file
 *
 * @sample
 * const vdkError = new VDKError(FACILITY.CONFIGURATION_SERVICE, ERROR.NOT_FOUND, 'll');
 * console.log(vdkError.code);
 * console.log(vdkError.message);
 * console.log(vdkError.stack);
 */
import { FACILITY_CONFIG, ERROR_CONFIG } from '#/config/error';

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    Error.captureStackTrace(this, this.constructor.name);
  }
}

export const FACILITY = {
  CONFIGURATION_SERVICE: 'CONFIGURATION_SERVICE',
  USER_SETTINGS_SERVICE: 'USER_SETTINGS_SERVICE',
  ANALYTICS_SERVICE: 'ANALYTICS_SERVICE',
  STATUS_SERVICE: 'STATUS_SERVICE',
  RESOURCE_SERVICE: 'RESOURCE_SERVICE',
  LOG_SERVICE: 'LOG_SERVICE',
  CONTENT_SERVICE: 'CONTENT_SERVICE',
  PLAYBACK_SERVICE: 'PLAYBACK_SERVICE',
  AUTHENTICATION_SERVICE: 'AUTHENTICATION_SERVICE',
  USER_MANAGER: 'USER_MANAGER',
  GENERAL: 'GENERAL'
};

export const ERROR = {
  NOT_FOUND: 'NOT_FOUND',
  NETWORK: 'NETWORK',
  INTERNAL: 'INTERNAL',
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID: 'INVALID',
  STORAGE: 'STORAGE',
  EMPTY_COLLECTION: 'EMPTY_COLLECTION',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  UNKNOWN: 'UNKNOWN'
};

export class VDKError extends ExtendableError {
  constructor(facility, errorCode, message) {
    super(message);

    this.facility = FACILITY_CONFIG[facility];
    this.errorCode = ERROR_CONFIG[errorCode];
    this.code = this.facility * 1000 + this.errorCode;
  }
}
