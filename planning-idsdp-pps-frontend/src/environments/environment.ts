const authBackendPrefix = 'api/';
const ppsConfigurationPrefix = 'pps-configuration/';
const ppsPcBackendPrefix = 'pps-pc/';
const ppsDppBackendPrefix = 'pps-dpp-tapp/';
const ppsProjectManagementBackendPrefix = 'pps-project-management/';
const ppsRDppRtappBackendPrefix = 'pps-rdpp-rtapp/';
const ppsFsBackendPrefix = 'pps-fs/';
const enothiBackendPrefix = 'enothi/';
const ppsReportBackendPrefix = 'pps-report/';
const ppsQueryBackendPrefix = 'pps-query/';
const notificationBackendPrefix = 'notification/';

export const reportBackend = 'http://localhost/SSRC/report-backend/public/api';
// export const reportBackend = 'http://202.161.191.129/SSRC/report-backend/public/api';

export const gateWayBaseEndPoint =  'http://localhost:8081/';
// export const gateWayBaseEndPoint =  'http://202.161.191.131:9403/';
// export const gateWayBaseEndPoint = 'https://gwtraining.plandiv.gov.bd/';
// export const gateWayBaseEndPoint = 'https://gw.plandiv.gov.bd/';

export const notificationEndPoint = gateWayBaseEndPoint + notificationBackendPrefix;

// export const PPsDomainName = 'http://202.161.191.131:9405';
// export const PPsLoginUrl = 'http://202.161.191.131:9402/sign-in'

export const PPsDomainName = 'http://localhost:4400';
export const PPsLoginUrl = 'http://localhost:4300/sign-in'

export const environment = {
    production: true,
    hmr: false,
    ibcs: {
        baseApiEndPoint: gateWayBaseEndPoint,
        configurationApiEndPoint: gateWayBaseEndPoint + ppsConfigurationPrefix,
        ppsPcBaseEndPoint: gateWayBaseEndPoint + ppsPcBackendPrefix,
        ppsDppBackendPoint: gateWayBaseEndPoint + ppsDppBackendPrefix,
        ppsProjectManagementBackendPoint: gateWayBaseEndPoint + ppsProjectManagementBackendPrefix,
        ppsRdppRtappBackendPoint: gateWayBaseEndPoint + ppsRDppRtappBackendPrefix,
        ppsFsBaseEndPoint: gateWayBaseEndPoint + ppsFsBackendPrefix,
        authServerBackendEndpoint: gateWayBaseEndPoint + authBackendPrefix,
        enothiBackendPoint: gateWayBaseEndPoint + enothiBackendPrefix,
        ppsReportEndPoint: gateWayBaseEndPoint + ppsReportBackendPrefix,
        ppsQueryBackendPrefix: gateWayBaseEndPoint + ppsQueryBackendPrefix,

        // ppsUrl: 'http://202.161.191.131:9405/',
        // authUiUrl: 'http://202.161.191.131:9402/',
        // commonServiceUrl: 'http://202.161.191.131:9406/',
        // navigateToUui: 'http://202.161.191.131:9402/navigation',

        ppsUrl: 'http://localhost:4400/',
        authUiUrl: 'http://localhost:4300/',
        navigateToUui: 'http://localhost:4300/navigation',
        commonServiceUrl: 'http://localhost:4200/',
        gisUrl: 'https://123.49.44.29:8013/gis/',

        ppsDomainName:PPsDomainName,
        ppsLoginUrl:PPsLoginUrl
    },
    clientid: 'ibcsplanningidsdp',
    clientSecret: 'planningIdsdpsha$@#929%'
};
