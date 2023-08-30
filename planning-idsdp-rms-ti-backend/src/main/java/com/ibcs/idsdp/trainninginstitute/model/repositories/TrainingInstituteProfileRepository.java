package com.ibcs.idsdp.trainninginstitute.model.repositories;

import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 12/4/21
 * @github `https://github.com/moniruzzamanrony`
 */
public interface TrainingInstituteProfileRepository extends JpaRepository<TrainingInstituteProfileModel, Long> {

    List<TrainingInstituteProfileModel> findByIsDeleted(Boolean isDeleted);

    Optional<TrainingInstituteProfileModel> findByUserId(String userId);

    Optional<TrainingInstituteProfileModel> findByIsDeletedAndId(boolean b, Long instituteId);

    Page<TrainingInstituteProfileModel> findAllByIsDeletedOrderByIdDesc(boolean b, Pageable pageablef);
}
