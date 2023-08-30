package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.FspSummaryDTO;

public interface FspSummaryService {

    FspSummaryDTO getFspSummaryByProjectConceptUuid(String projectConceptMasterUuid);
}
