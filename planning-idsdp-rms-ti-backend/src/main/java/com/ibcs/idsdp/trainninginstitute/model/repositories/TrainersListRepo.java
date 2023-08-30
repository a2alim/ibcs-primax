package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainersList;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by : rakibul.hasan on 3/27/2022 5:27 PM
 * github : https://github.com/rhmtechno
 */
@Repository
public interface TrainersListRepo extends ServiceRepository<TrainersList> {
    Page<TrainersList> findByProfileModelAndIsDeleted(TrainingInstituteProfileModel trainingInstituteProfileModel, boolean b, Pageable pageable);

   List<TrainersList> findByProfileModelAndIsDeletedOrderByIdDesc(TrainingInstituteProfileModel trainingInstituteProfileModel,Boolean isDeleted);
}
