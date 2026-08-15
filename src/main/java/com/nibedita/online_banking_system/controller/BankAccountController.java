package com.nibedita.online_banking_system.controller;

import com.nibedita.online_banking_system.dto.OpenAccountRequest;
import com.nibedita.online_banking_system.entity.BankAccount;
import com.nibedita.online_banking_system.service.BankAccountService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;


    @PostMapping("/open")
    public BankAccount openAccount(
            @RequestBody OpenAccountRequest request
    ) {

        return bankAccountService.openAccount(request);
    }


    @GetMapping
    public List<BankAccount> getUserAccounts(
            @RequestParam String email
    ) {

        return bankAccountService.getUserAccounts(email);
    }
}