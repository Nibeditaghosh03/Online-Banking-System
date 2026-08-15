package com.nibedita.online_banking_system.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OpenAccountRequest {

    private String email;

    private String accountType;
}