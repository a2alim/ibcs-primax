package com.ibcs.idsdp.rpm.services.implementation.jasperServiceImpl;

import com.ibcs.idsdp.rpm.jasperConfig.CusJasperReportDef;
import com.ibcs.idsdp.rpm.jasperConfig.JasperCommonUtils;
import com.ibcs.idsdp.rpm.services.jasperService.ByteToPdfJasperService;
import com.ibcs.idsdp.rpm.services.jasperService.ResearcherProfileService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.concurrent.ExecutionException;

/**
 * Created by : rakibul.hasan on 3/7/2022 11:46 AM
 * github : https://github.com/rhmtechno
 */
@Service
@AllArgsConstructor
public class ByteToPdfJasperServiceImpl implements ByteToPdfJasperService {
    private final JasperCommonUtils jasperCommonUtils;
    private final ResearcherProfileService profileService;


    @Override
    public void profileReport(String uuid, String lang) throws ExecutionException, InterruptedException, IOException {
        CusJasperReportDef profilePdf = profileService.getProfilePdf(uuid, lang);
        ResponseEntity<byte[]> responseEntity = jasperCommonUtils.respondReportOutputWithoutHeader(profilePdf, false);
        byte[] body = responseEntity.getBody();
        try (OutputStream out = new FileOutputStream("C:\\Users\\rakibul.hasan\\Desktop\\byte\\profile.pdf")) {
            assert body != null;
            out.write(body);
        }
    }
}
