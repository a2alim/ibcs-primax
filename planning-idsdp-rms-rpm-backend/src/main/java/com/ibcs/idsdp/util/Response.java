package com.ibcs.idsdp.util;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;

import lombok.Data;

@Data
public class Response<R> {

	private boolean success = true;
	private boolean info = false;
	private boolean warning = false;
	private String message;
	private boolean valid = false;

	//private Long id;
	private Map<String, R> model;
	private List<R> items;
	private R obj;
	private Page<R> page;
}
