package com.ripenly.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "agents")
public class Agent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "base_location", nullable = false, length = 100)
    private String baseLocation;

    @Column(name = "assigned_region")
    private String assignedRegion;

    @Column(name = "flagged_submission_count")
    private int flaggedSubmissionCount = 0;

    // Constructors
    public Agent() {}

    public Agent(String name, String baseLocation) {
        this.name = name;
        this.baseLocation = baseLocation;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getBaseLocation() { return baseLocation; }
    public void setBaseLocation(String baseLocation) { this.baseLocation = baseLocation; }

    public String getAssignedRegion() { return assignedRegion; }
    public void setAssignedRegion(String assignedRegion) { this.assignedRegion = assignedRegion; }

    public int getFlaggedSubmissionCount() { return flaggedSubmissionCount; }
    public void setFlaggedSubmissionCount(int flaggedSubmissionCount) { this.flaggedSubmissionCount = flaggedSubmissionCount; }
}
