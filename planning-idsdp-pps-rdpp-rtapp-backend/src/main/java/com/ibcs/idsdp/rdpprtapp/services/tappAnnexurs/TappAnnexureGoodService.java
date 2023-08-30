package com.ibcs.idsdp.rdpprtapp.services.tappAnnexurs;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.tappAnnexurs.TappAnnexureGoods;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.tappAnnexurs.TappAnnexureGoodSaveWithChildRequest;
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
    ResponseWithResults getDataByFormType(String formType, Long rtappMasterId, Boolean isDelete);

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
