package com.mancuniansam.gitstats.repositories;

import com.mancuniansam.gitstats.entities.PullRequests;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Map;

public interface PullRequestsDataRepository extends CrudRepository<PullRequests, Long> {

	@Query(value="select datediff(closed_at, created_at) daysToClose, count(*) numberOfPullRequests from pull_requests where repository_id = ?1 group by 1", nativeQuery = true)
	List<Map<String, Number>> getTimeToCloseCount(Long repositoryId);

	@Query(value = "select commits commitCount, count(*) numberOfPullRequests from pull_requests where repository_id = ?1 group by 1;", nativeQuery = true)
	List<Map<String, Number>> getCommitCount(Long repositoryId);

	List<PullRequests> findTop10ByPullRequestsRepository_IdOrderByAdditionsDesc(Long repositoryId);

	List<PullRequests> findTop10ByPullRequestsRepository_IdOrderByDeletionsDesc(Long repositoryId);
}
