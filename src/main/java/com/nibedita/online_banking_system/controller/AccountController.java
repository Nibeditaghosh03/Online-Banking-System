package com.nibedita.online_banking_system.controller;


import com.nibedita.online_banking_system.dto.BalanceResponse;
import com.nibedita.online_banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.nibedita.online_banking_system.dto.DepositRequest;
import com.nibedita.online_banking_system.dto.WithdrawRequest;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private UserService userService;

    @GetMapping("/balance")
    public BalanceResponse getBalance(@RequestParam String email) {
    return userService.getBalance(email);
}

@PostMapping("/deposit")
public BalanceResponse deposit(
        @RequestParam String email,
        @RequestBody DepositRequest request) {

    return userService.deposit(email, request);
}

@PostMapping("/withdraw")
public BalanceResponse withdraw(
        @RequestParam String email,
        @RequestBody WithdrawRequest request) {

    return userService.withdraw(email, request);
}

}