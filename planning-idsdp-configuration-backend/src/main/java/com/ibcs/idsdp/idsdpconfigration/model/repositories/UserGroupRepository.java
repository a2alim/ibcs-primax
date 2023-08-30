package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MinistryDivision;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SectorDivision;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UserGroup;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserGroupRepository extends ServiceRepository<UserGroup> {
    Page<UserGroup> findAllByCheckedAndIsDeleted(Boolean checked, Boolean isDelete, Pageable pageable);

    UserGroup findByIdAndCheckedAndIsDeleted(long id, Boolean checked, Boolean isDelete);

    List<UserGroup> findAllByMinistryDivisionAndChecked(MinistryDivision ministryDivision, Boolean checked);

    List<UserGroup> findAllByAgencyAndChecked(Agency agency, Boolean checked);

    List<UserGroup> findAllBySectorDivisionAndChecked(SectorDivision sectorDivision, Boolean checked);

    Optional<UserGroup> findById(Long id);

    Optional<UserGroup> findByUserIdAndChecked(Long id, Boolean Checked);

    List<UserGroup> findAllByUserIdInAndChecked(Set<Long> ids, Boolean Checked);

    List<UserGroup> findAllByMinistryDivisionNotAndChecked(MinistryDivision ministryDivision, Boolean checked);

    List<UserGroup> findAllByAgencyNotAndChecked(Agency agency, Boolean checked);

    List<UserGroup> findAllByAgencyNotNull();

    List<UserGroup> findAllByMinistryDivisionAndMinistryDivisionNotNull(MinistryDivision ministryDivision);

    List<UserGroup> findAllBySectorDivisionAndSectorDivisionNotNull(SectorDivision sectorDivision);

    List<UserGroup> findAllBySectorDivisionNotAndCheckedOrEcnecNotNullOrPlanningMinisterNotNull(SectorDivision sectorDivision, Boolean checked);

    List<UserGroup> findAllBySectorDivisionNotNull();

    Optional<UserGroup> findByEcnecAndChecked(String ecnec, Boolean checked);

    List<UserGroup> findAllByEcnecAndChecked(String ecnec, Boolean checked);

    Optional<UserGroup> findByPlanningMinisterAndChecked(String planningMinister, Boolean checked);

    List<UserGroup> findAllByEcnecIsNullAndChecked( Boolean checked);

    List<UserGroup> findAllByPlanningMinisterIsNullAndChecked( Boolean checked);

    Optional<UserGroup> findByUserId(Long userId);
    List<UserGroup> findAllByAgencyId(long id);
    List<UserGroup> findAllByMinistryDivisionId(long id);
    List<UserGroup> findAllBySectorDivisionId(long id);
    List<UserGroup> findAllByPlanningMinister(String type);
    List<UserGroup> findAllByEcnec(String type);
}
