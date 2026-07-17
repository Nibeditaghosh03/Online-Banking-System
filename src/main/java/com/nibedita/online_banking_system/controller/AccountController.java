package com.nibedita.online_banking_system.controller;


import com.nibedita.online_banking_system.dto.BalanceResponse;
import com.nibedita.online_banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private UserService userService;

    @GetMapping("/balance")
    public BalanceResponse getBalance(@RequestParam String email) {
    return userService.getBalance(email);
}

}