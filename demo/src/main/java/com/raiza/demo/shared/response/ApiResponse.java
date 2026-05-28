package com.raiza.demo.shared.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Map;

@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private final boolean success;
    private final T data;
    private final String message;
    private final int status;
    private final String path;
    private final LocalDateTime timestamp = LocalDateTime.now();
    private final Map<String, String> errors;

    private ApiResponse(boolean success, T data, String message, int status, String path, Map<String, String> errors) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.status = status;
        this.path = path;
        this.errors = errors;
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, 200, null, null);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(true, data, null, 201, null, null);
    }

    public static ApiResponse<Void> error(String message, int status, String path) {
        return new ApiResponse<>(false, null, message, status, path, null);
    }

    public static ApiResponse<Void> validationError(String path, Map<String, String> errors) {
        return new ApiResponse<>(false, null, "Validation failed", 400, path, errors);
    }
}
