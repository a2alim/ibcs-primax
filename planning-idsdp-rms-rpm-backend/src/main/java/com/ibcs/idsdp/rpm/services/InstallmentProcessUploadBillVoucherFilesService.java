package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.rpm.web.dto.request.FileRequest;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface InstallmentProcessUploadBillVoucherFilesService {

    Response saveVoucher(String body, Optional<MultipartFile[]> files, String dlist, String modifyFiles);

    Response getByProcessId(Long processId);
}
