package com.ibcs.idsdp.dpptapp.services.annexIII_aGoods;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.annexIII_aGoods.AnnexureGoodsRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

public interface AnnexureGoodService {

    /**
     * Get all annexure goods records
     * @param requestBodyDTO
     * @return
     */
    Page<AnnexureGoodsRequest> getAllRecords(PageableRequestBodyDTO requestBodyDTO);

    /**
     * Create for UUID
     * @param code
     * @return
     */
    String generateCodeNumber(String code);

    /**
     * For create annexure goods records
     * @param request
     * @return
     */
    ResponseWithResults saveWithChild(AnnexureGoodSaveWithChildRequest request);

    /**
     * For get annexure goods records by for type
     * @param formType
     * @return
     */
    ResponseWithResults getDataByFormType(String formType, String projectConceptUuid);

    /**
     * For delete annexure goods records
     * @param id
     * @return
     */
    ResponseEntity<ResponseStatus> deleteRow(Long id);

}
