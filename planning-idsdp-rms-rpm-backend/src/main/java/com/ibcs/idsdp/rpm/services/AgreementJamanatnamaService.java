package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementInstallmentRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementJamanatnamaResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface AgreementJamanatnamaService {

    Response<AgreementJamanatnamaResponseDto> createAgreementJamanatnama(AgreementJamanatnamaResponseDto agreementJamanat);

    BooleanValueHolderDTO updateAgreementJamanatnama(AgreementJamanatnamaResponseDto agreementJamanat);

    Response saveJamanatnama(String body, Optional<MultipartFile[]> files);

    Response updateJamanatnama(Long id, String body, Optional<MultipartFile[]> files);
}
