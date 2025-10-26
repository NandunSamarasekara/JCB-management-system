package com.jcb.jcb_management_systembackend.authentication.dto;

import java.util.Map;

public class AuthResponse {
    private boolean success;
    private String message;
    private Map<String, Object> user;

    public AuthResponse() {
    }

    public AuthResponse(boolean success, String message, Map<String, Object> user) {
        this.success = success;
        this.message = message;
        this.user = user;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }
}
