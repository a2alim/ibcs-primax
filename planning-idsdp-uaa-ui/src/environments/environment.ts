
export const notificationBackendPrefix = 'notification/';
export const ssoBackendPrefix = 'sso/';
// export const gateWayBaseEndPoint = 'http://202.161.191.131:9403/';
export const gateWayBaseEndPoint = 'http://localhost:8081/';
export const rmsConfigurationBackendPrefix = 'rms-configuration/';
export const rpmBackendPrefix = 'rms-rpm/';
export const tiBackendPrefix = 'rms-ti/';

export const MainDomainName = 'http://localhost:4300';
// export const MainDomainName = 'http://202.161.191.131:9405'; //For IBCS server

export const enableOtp: boolean = false;

export const environment = {
    production: false,
    hmr       : false,
    ibcs: {
        pingEndpoint: 'http://192.168.1.14:8080/ping',
        baseApiEndPoint: gateWayBaseEndPoint,
        ssoApiEndPoint: gateWayBaseEndPoint + ssoBackendPrefix,
        rmsConfigurationBackend: gateWayBaseEndPoint + rmsConfigurationBackendPrefix,
        tiBackendRootUrl: gateWayBaseEndPoint + tiBackendPrefix,
        rpmBackend: gateWayBaseEndPoint + rpmBackendPrefix,

        // ppsUrl: 'http://202.161.191.131:9405/',
        ppsUrl: 'http://localhost:4400/',
        commonServiceUrl: 'http://localhost:4200/',

        rmsFrontendApp: 'http://localhost:4500/',
        npmFrontendApp: 'http://localhost:4600/',
        gisFrontendApp: 'https://123.49.44.29:8013/gis/',

        mainDomainName : MainDomainName
    },
    clientid: 'ibcsplanningidsdp',
    clientSecret: 'planningIdsdpsha$@#929%',
    enableOtp: enableOtp
};
