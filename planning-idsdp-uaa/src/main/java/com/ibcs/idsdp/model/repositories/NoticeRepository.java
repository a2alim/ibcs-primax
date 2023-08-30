package com.ibcs.idsdp.model.repositories;

import com.ibcs.idsdp.model.domain.Notice;
import com.ibcs.idsdp.web.dto.NoticeDTO;

import java.util.Date;
import java.util.List;

public interface NoticeRepository extends ServiceRepository<Notice> {
    List<Notice> findAllByIsActiveAndIsDeletedOrderById(Boolean isActive, Boolean isDeleted);

    List<Notice> findAllByTitleContainingIgnoreCaseAndPublishedDateBetweenAndIsActiveAndIsDeleted(String title, Date fromDate, Date toDate, Boolean isActive, Boolean isDeleted);
    List<Notice> findAllByTitleContainingIgnoreCaseAndIsActiveAndIsDeleted(String title, Boolean isActive, Boolean isDeleted);

}
