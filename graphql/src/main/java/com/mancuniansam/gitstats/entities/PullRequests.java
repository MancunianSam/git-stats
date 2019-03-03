package com.mancuniansam.gitstats.entities;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name="pull_requests")
public class PullRequests {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column
	private LocalDateTime createdAt;

	@Column
	private LocalDateTime closedAt;

	@Column
	private String title;

	@Column
	private String author;

	@Column
	private Boolean merged;

	@Column
	private Integer additions;

	@Column
	private Integer deletions;

	@Column
	private Integer commits;

	@ManyToOne
	@JoinColumn(name = "repository_id")
	private PullRequestsRepository pullRequestsRepository;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getClosedAt() {
		return closedAt;
	}

	public void setClosedAt(LocalDateTime closedAt) {
		this.closedAt = closedAt;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public Boolean getMerged() {
		return merged;
	}

	public void setMerged(Boolean merged) {
		this.merged = merged;
	}

	public Integer getAdditions() {
		return additions;
	}

	public void setAdditions(Integer additions) {
		this.additions = additions;
	}

	public Integer getDeletions() {
		return deletions;
	}

	public void setDeletions(Integer deletions) {
		this.deletions = deletions;
	}

	public Integer getCommits() {
		return commits;
	}

	public void setCommits(Integer commits) {
		this.commits = commits;
	}

	public PullRequestsRepository getPullRequestsRepository() {
		return pullRequestsRepository;
	}

	public void setPullRequestsRepository(PullRequestsRepository pullRequestsRepository) {
		this.pullRequestsRepository = pullRequestsRepository;
	}
}
