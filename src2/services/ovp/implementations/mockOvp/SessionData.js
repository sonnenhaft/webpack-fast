/*
 * Session Data class for mapping response of OVP auth
 * As seen on: https://accedobroadband.jira.com/wiki/display/VIA/Accedo+OVP+API+Specification+1.4.0#AccedoOVPAPISpecification1.4.0-Createnewtoken
 */
class SessionData {
  constructor(options) {
    this.userId = options.userId;
    this.token = options.token;
    this.expiration = options.expiration;
    this.email = options.email;
  }

  static parseFromJson(stringified) {
    try {
      const data = JSON.parse(stringified);

      return new SessionData(data);
    } catch (e) {
      return null;
    }
  }

  serialize() {
    return JSON.stringify(this);
  }

  isExpired() {
    return this.expiration < Date.now();
  }
}

export default SessionData;
