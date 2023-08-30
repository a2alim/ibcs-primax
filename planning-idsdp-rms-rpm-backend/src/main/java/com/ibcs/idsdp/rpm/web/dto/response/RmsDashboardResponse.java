package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 1/6/22
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class RmsDashboardResponse {
    private int completedResearchCount;
    private int ongoingResearchCount;
    private int cancelledResearchCount;
    private int defaulterResearchCount;
    private int researchProposalCount;
    private int cancelledProposalCount;
    private List<CategoriesWiseProposalResponse> categoriesWiseProposalResponsesList;

    private int totalInstituteCount;
    private int approveInstituteCount;
    private int unapprovedInstituteCount;
    private List<TrainingInstituteResponse> trainingInstituteResponseList;

    private int grantAcceptedCount;
    private int grantQueryCount;
    private int grantPendingCount;
    private int grantRejectedCount;
    private List<SDGsWiseResearchResponse> sDGsWiseResearchResponseList;
}
