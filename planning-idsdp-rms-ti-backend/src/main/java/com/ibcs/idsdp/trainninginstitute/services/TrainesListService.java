package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.web.dto.response.TrainersListResponse;
import com.ibcs.idsdp.util.Response;

/**
 * Created by : rakibul.hasan on 3/27/2022 5:32 PM
 * github : https://github.com/rhmtechno
 *
 */
public interface TrainesListService {
    Response getTrainersListByProfileId(Long profileId,int offset,int pageSize);

    Response getTrainersListByProfileIdWithoutPagination(Long profileId);

    Response getTrainersListByUserIdWithoutPagination(Long userId);
}
