package com.ibcs.idsdp.common.exceptions.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

public class ServiceExceptionHolder {

    @Getter
    @RequiredArgsConstructor
    public static class ServiceException extends RuntimeException {
        private final int code;
        private final String message;
    }

    public static class ResourceNotFoundException extends ServiceException {
        public ResourceNotFoundException(String message) {
            super(2000, message);
        }
    }

    public static class ResourceNotFoundDuringWriteRequestException extends ServiceException {
        public ResourceNotFoundDuringWriteRequestException(String message) {
            super(4000, message);
        }
    }

    public static class InvalidRequestException extends ServiceException {
        public InvalidRequestException(String message) {
            super(4100, message);
        }
    }

}
