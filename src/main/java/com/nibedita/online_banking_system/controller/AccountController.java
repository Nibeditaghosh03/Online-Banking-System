package com.nibedita.online_banking_system.controller;


import com.nibedita.online_banking_system.dto.BalanceResponse;
import com.nibedita.online_banking_system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.nibedita.online_banking_system.dto.DepositRequest;
import com.nibedita.online_banking_system.dto.WithdrawRequest;
import com.nibedita.online_banking_system.dto.TransferRequest;
import java.util.List;
import org.springframework.security.core.Authentication;
import com.nibedita.online_banking_system.dto.TransactionResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private UserService userService;

    @GetMapping("/balance")
    public BalanceResponse getBalance(Authentication authentication) {
         String email = authentication.getName();
    return userService.getBalance(email);
}

@PostMapping("/deposit")
public BalanceResponse deposit(
        Authentication authentication,
       @Valid @RequestBody DepositRequest request) {

      String email = authentication.getName();
    return userService.deposit(email, request);
}

@PostMapping("/withdraw")
public BalanceResponse withdraw(
        Authentication authentication,
       @Valid @RequestBody WithdrawRequest request) {
      
    String email = authentication.getName();
    return userService.withdraw(email, request);
}

@PostMapping("/transfer")
public BalanceResponse transfer(
        Authentication authentication,
       @Valid @RequestBody TransferRequest request) {
        
    String email = authentication.getName();
    return userService.transfer(email, request);
}

@GetMapping("/transactions")
public List<TransactionResponse> getTransactionHistory(
        Authentication authentication) {

    String email = authentication.getName();
    return userService.getTransactionHistory(email);
}

}