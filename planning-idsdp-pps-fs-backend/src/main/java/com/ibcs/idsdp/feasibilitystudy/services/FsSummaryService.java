package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsLinkWithDto;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsSummaryDTO;

public interface FsSummaryService {

    FsSummaryDTO getFsSummaryByProjectConceptUuid(String projectConceptMasterUuid);
    FsSummaryDTO getFsSummaryByProjectConceptId(Long pcId);

    ResponseWithResults getFsReportListWhichNotLinkWithDpp();

    ResponseWithResults getFsReportList(String projectConceptMasterUuid);

    ResponseStatus linkFsWithDpp(FsLinkWithDto fsLinkWithDto);

}
