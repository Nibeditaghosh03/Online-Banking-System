package com.nibedita.online_banking_system.entity;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

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

    @Column(nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
@Column(nullable = false)
private String password;

    @Column(unique = true, nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private Double balance = 0.0;
    
    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Boolean active;
}
