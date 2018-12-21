package com.mancuniansam.gitstats.service;

import com.mancuniansam.gitstats.entities.ComplexityAggregates;
import com.mancuniansam.gitstats.entities.ComplexityByFile;
import com.mancuniansam.gitstats.entities.ComplexityByFunction;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
@SuppressWarnings("unchecked")
public class ComplexityDownloadService {

	private QueryService queryService;

	public ComplexityDownloadService(QueryService queryService) {
		this.queryService = queryService;
	}

	public Workbook createComplexityWorkbook(Long repositoryId) {

		Workbook wb = new XSSFWorkbook();
		createSheet(wb, getComplexityByFileResults(repositoryId));
		createSheet(wb, getComplexityByFunctionResults(repositoryId));
		return wb;

	}

	private ComplexityConfiguration getComplexityByFunctionResults(Long repositoryId) {
		List<ComplexityByFunction> results = queryService.complexityByFunction(repositoryId);

		Map<String, Function<ComplexityByFunction, String>> functionDescripton = new LinkedHashMap<String, Function<ComplexityByFunction, String>>() {{
			put("Repository Name", f -> f.getRepository().getName());
			put("Function Name", f -> f.getFunction().getName());
			put("NLOC", f -> f.getNloc().toString());
			put("Complexity", f -> f.getComplexity().toString());

		}};
		return new ComplexityConfiguration<>(results, functionDescripton, "Complexity By Function");
	}

	private ComplexityConfiguration getComplexityByFileResults(Long repositoryId) {
		List<ComplexityByFile> results = queryService.complexityByFile(repositoryId);

		Map<String, Function<ComplexityByFile, String>> fileDescription = new LinkedHashMap<String, Function<ComplexityByFile, String>>() {{
			put("Repository Name", f -> f.getRepository().getName());
			put("File Name", f -> f.getFile().getFileName());
			put("NLOC", f -> f.getNloc().toString());
			put("Complexity", f -> f.getComplexity().toString());

		}};
		return new ComplexityConfiguration(results, fileDescription, "Complexity By File");
	}


	@NotNull
	@SuppressWarnings("unchecked")
	private void createSheet(Workbook wb, ComplexityConfiguration<ComplexityAggregates> configuration) {

		Sheet sheet = wb.createSheet(configuration.getSheetName());

		Row headerRow = sheet.createRow(0);
		Map<String, Function<ComplexityAggregates, String>> fileDescription =
				configuration.getFileDescription();
		List<ComplexityAggregates> results = configuration.getResults();

		int headerCount = 0;
		for(String header: fileDescription.keySet()) {
			Cell cell = headerRow.createCell(headerCount);
			cell.setCellValue(header);
			headerCount++;
		}

		for(int i=0; i<results.size(); i++) {
			Row row = sheet.createRow(i+1);
			int cellCount = 0;
			for(String header: fileDescription.keySet()) {
				Cell cell = row.createCell(cellCount);
				cell.setCellValue(fileDescription.get(header).apply(results.get(i)));
				cellCount++;
			}
		}
	}

	private static class ComplexityConfiguration<T extends ComplexityAggregates> {
		private List<T> results;
		private Map<String, Function<T, String>> fileDescription;
		private String sheetName;

		ComplexityConfiguration(List<T> results,
								Map<String, Function<T, String>> fileDescription,
								String sheetName) {
			this.results = results;
			this.fileDescription = fileDescription;
			this.sheetName = sheetName;
		}

		List<T> getResults() {
			return results;
		}

		String getSheetName() {
			return sheetName;
		}

		Map<String, Function<T, String>> getFileDescription() {
			return fileDescription;
		}

	}
}
