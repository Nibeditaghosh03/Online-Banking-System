package com.nibedita.online_banking_system.dto;

import lombok.Data;

@Data
public class RegisterRequest {

    private String fullName;

    private String email;

    private String password;

    private String phoneNumber;
}