export class AgencyDashboardModel {
    totalProjects: number;
    approvedProjects: number;
    runningProject: number;
    sendToMinistryDivision: number;
    sendToPlanningCommission: number;
    ecnecProjects: number;

    pecMeetingHeld: number;
    dppNotPrepared: number;
    dppPrepared: number;
    pscMeetingHeld: number;
    dppAtPC: number;

    rtapp: number;
    rdpp: number;
    dpp: number;
    tapp: number;
    fsComplete: number;
    fsNotComplete: number;
    totalFs: number;
    fsCompleteProjectList: any[] = [];
    fsNotCompleteProjectList: any[] = [];
    pecProjectList: any[] = [];
    pscProjectList: any[] = [];
    atPCProjectList: any[] = [];
    preparedProjectList: any[] = [];
    notPreparedProjectList: any[] = [];
    rdppApprovedProjectList: any[] = [];
    rdppNotApprovedProjectList: any[] = [];
    rtappApprovedProjectList: any[] = [];
    rtappNotApprovedProjectList: any[] = [];

}
