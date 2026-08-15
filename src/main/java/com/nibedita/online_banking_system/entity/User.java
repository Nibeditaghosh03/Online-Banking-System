package com.nibedita.online_banking_system.entity;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
private List<BankAccount> bankAccounts = new ArrayList<>();

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    
    
    
    @Column(nullable = false)
    private String phoneNumber;

   

    

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    
}

