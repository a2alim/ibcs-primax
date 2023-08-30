package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.trainninginstitute.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PreviousPaymentResponse {

    private String installmentType;

    private Integer installmentAmount;

    private Status status;

}
