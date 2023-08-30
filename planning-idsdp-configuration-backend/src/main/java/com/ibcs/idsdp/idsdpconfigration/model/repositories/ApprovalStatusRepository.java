package com.ibcs.idsdp.idsdpconfigration.model.repositories;

import com.ibcs.idsdp.idsdpconfigration.model.domain.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApprovalStatusRepository extends JpaRepository<ApprovalStatus, String> {

    List<ApprovalStatus> findAllByStatus(Boolean status);

    Optional<ApprovalStatus> findAllByUuid(String Uuid);

    List<ApprovalStatus> findAllByIsDeleted(Boolean isDelete);

}
