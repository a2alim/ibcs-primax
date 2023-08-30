package com.ibcs.idsdp.dpptapp.model.repositories.projectSummariesRepository;


import com.ibcs.idsdp.dpptapp.model.domain.projectSummaries.YearWiseCost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YearWiseCostRepository extends JpaRepository<YearWiseCost, Long> {
    List<YearWiseCost> findAllByProjectUuid(String projectUuid);
}
