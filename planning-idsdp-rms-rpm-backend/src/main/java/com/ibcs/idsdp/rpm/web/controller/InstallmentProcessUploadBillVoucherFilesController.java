package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessUploadBillVoucherFiles;
import com.ibcs.idsdp.rpm.services.InstallmentProcessUploadBillVoucherFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.FileRequest;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessUploadBillVoucherFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessUploadBillVoucherFilesResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/agreement-installment-files")
public class InstallmentProcessUploadBillVoucherFilesController extends BaseController<InstallmentProcessUploadBillVoucherFiles, InstallmentProcessUploadBillVoucherFilesRequestDto, InstallmentProcessUploadBillVoucherFilesResponseDto> {

    private final InstallmentProcessUploadBillVoucherFilesService installmentProcessUploadBillVoucherFilesService;

    public InstallmentProcessUploadBillVoucherFilesController(BaseService<InstallmentProcessUploadBillVoucherFiles, InstallmentProcessUploadBillVoucherFilesRequestDto, InstallmentProcessUploadBillVoucherFilesResponseDto> service, InstallmentProcessUploadBillVoucherFilesService installmentProcessUploadBillVoucherFilesService) {
        super(service);
        this.installmentProcessUploadBillVoucherFilesService = installmentProcessUploadBillVoucherFilesService;
    }

    @PostMapping(value = "/create-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Response InstallmentProcessUploadBillVoucher(@RequestParam("body") String body, @RequestParam("dlist") String dlist,@RequestParam("modifyFiles") String modifyFiles,
                                                        @RequestParam("file") Optional<MultipartFile[]> files) {
        return installmentProcessUploadBillVoucherFilesService.saveVoucher(body, files,dlist,modifyFiles);
    }


    @GetMapping(path = "/get-by-process-id/{processId}", produces = "application/json")
    public Response saveAgreementInstallment(@PathVariable("processId") Long processId) {
        Response expenditureBudget = installmentProcessUploadBillVoucherFilesService.getByProcessId(processId);
        return expenditureBudget;
    }


}
