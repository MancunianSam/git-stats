package com.mancuniansam.gitstats.service;

import com.coxautodev.graphql.tools.GraphQLQueryResolver;
import com.mancuniansam.gitstats.dto.CommitCountDTO;
import com.mancuniansam.gitstats.dto.TimeToCloseDTO;
import com.mancuniansam.gitstats.dto.TopLineChangesDTO;
import com.mancuniansam.gitstats.repositories.PullRequestsDataRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class PullRequestQueryService implements GraphQLQueryResolver {

	public static final String NUMBER_OF_PULL_REQUESTS = "numberOfPullRequests";
	public static final String COMMIT_COUNT = "commitCount";
	public static final String DAYS_TO_CLOSE = "daysToClose";
	private PullRequestsDataRepository repository;

	public PullRequestQueryService(PullRequestsDataRepository repository) {
		this.repository = repository;
	}

	public List<TimeToCloseDTO> getTimeToClose(Long repositoryId) {
		List<Map<String, Number>> timeToClose = repository.getTimeToCloseCount(repositoryId);
		return timeToClose.stream().map(this::mapToTimeToCloseDto).collect(Collectors.toList());
	}

	public List<CommitCountDTO> getCommitCount(Long repositioryId) {
		List<Map<String, Number>> commitCount = repository.getCommitCount(repositioryId);
		return commitCount.stream().map(this::mapToCommitCountDto).collect(Collectors.toList());
	}

	public List<TopLineChangesDTO> getTopAdditions(Long repositoryId) {
		return repository.findTop10ByPullRequestsRepository_IdOrderByAdditionsDesc(repositoryId)
				.stream()
				.map(p -> new TopLineChangesDTO(p.getTitle(), p.getAdditions()))
				.collect(Collectors.toList());
	}

	public List<TopLineChangesDTO> getTopDeletions(Long repositoryId) {
		return repository.findTop10ByPullRequestsRepository_IdOrderByDeletionsDesc(repositoryId)
				.stream()
				.map(p -> new TopLineChangesDTO(p.getTitle(), p.getDeletions()))
				.collect(Collectors.toList());
	}

	private TimeToCloseDTO mapToTimeToCloseDto(Map<String, Number> map) {
		return new TimeToCloseDTO(map.get(DAYS_TO_CLOSE), map.get(NUMBER_OF_PULL_REQUESTS));
	}

	private CommitCountDTO mapToCommitCountDto(Map<String, Number> map) {
		return new CommitCountDTO(map.get(COMMIT_COUNT), map.get(NUMBER_OF_PULL_REQUESTS));
	}

}
