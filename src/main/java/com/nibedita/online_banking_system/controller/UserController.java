package com.nibedita.online_banking_system.controller;
import com.nibedita.online_banking_system.dto.LoginRequest;
import com.nibedita.online_banking_system.dto.RegisterRequest;
import com.nibedita.online_banking_system.entity.User;
import com.nibedita.online_banking_system.service.UserService;
import com.nibedita.online_banking_system.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/auth")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
private JwtService jwtService;

    @PostMapping("/register")
    public User registerUser(@Valid @RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }
    @PostMapping("/login")
public String loginUser(@Valid @RequestBody LoginRequest request) {
   User user = userService.loginUser(request);
   return jwtService.generateToken(user.getEmail());
}


}