package com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection;

import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.FiscalYearResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SectorTypeResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.SubSectorResponse;
import lombok.Data;

import java.util.List;

@Data
public class GetActiveDataResponse {
    private List<FiscalYearResponse> fiscalYear;
    private List<SectorTypeResponse> sectorTypes;
    private List<SubSectorResponse> SubSectors;
}
