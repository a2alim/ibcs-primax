package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.MinioAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Created by : rakibul.hasan on 4/26/2022 9:43 PM
 * github : https://github.com/rhmtechno
 */
public interface AttachmentRepository2 extends JpaRepository<MinioAttachment,Long> {
}
