package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.NoteForNotification;
import com.ibcs.idsdp.rpm.model.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author moniruzzaman.rony
 * @create 11/7/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Repository
public interface NoteForNotificationRepository extends JpaRepository<NoteForNotification, Long> {
}
