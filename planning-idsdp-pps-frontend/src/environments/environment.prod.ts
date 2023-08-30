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
export const notificationEndPoint = 'http://localhost:8089/notification/';

export const reportBackend = 'http://localhost/SSRC/report-backend/public/api';
export const gateWayBaseEndPoint = 'https://gwtraining.plandiv.gov.bd/';

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
