package com.ibcs.idsdp.web.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class NoticeRequestDto {

    private Date fromDate;
    private Date toDate;
    private String title;

}
