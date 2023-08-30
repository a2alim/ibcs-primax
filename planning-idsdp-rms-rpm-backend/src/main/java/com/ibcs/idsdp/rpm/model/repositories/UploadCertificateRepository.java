package com.ibcs.idsdp.rpm.model.repositories;

import com.ibcs.idsdp.rpm.model.domain.UploadCertificateImage;
import com.ibcs.idsdp.rpm.model.domain.UploadUsersImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author moniruzzaman.rony
 * @create 10/5/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Repository
public interface UploadCertificateRepository extends JpaRepository<UploadCertificateImage, Long> {
}
