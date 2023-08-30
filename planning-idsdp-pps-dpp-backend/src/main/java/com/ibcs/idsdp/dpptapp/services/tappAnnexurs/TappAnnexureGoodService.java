package com.ibcs.idsdp.dpptapp.services.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodSaveWithChildRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TappAnnexureGoodService {

    /**
     * For create tapp annexure goods records
     * @param request
     * @return
     */
    ResponseWithResults saveWithChild(TappAnnexureGoodSaveWithChildRequest request);

    /**
     * For get tapp annexure goods records by form type
     * @param formType
     * @return
     */
    ResponseWithResults getDataByFormType(String formType, String projectUuid, Boolean isDelete);

    /**
     * For get all tapp annexure goods records
     * @return
     */
    List<TappAnnexureGoods> getListData();

    /**
     *
     * @param uuid
     * @return
     */
    ResponseEntity<ResponseStatus> deleteRow(String uuid);
}
