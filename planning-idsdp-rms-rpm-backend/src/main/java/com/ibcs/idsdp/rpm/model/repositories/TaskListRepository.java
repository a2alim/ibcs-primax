package com.ibcs.idsdp.rpm.model.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.rpm.model.domain.TaskList;

@Repository
public interface TaskListRepository extends ServiceRepository<TaskList> {

	public List<TaskList> findAllTaskListByResearchProgressReportIdAndIsDeleted(Long researchProgressReportId, boolean isDeleted);
}
