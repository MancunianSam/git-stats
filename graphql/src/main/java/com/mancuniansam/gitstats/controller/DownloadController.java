package com.mancuniansam.gitstats.controller;

import com.mancuniansam.gitstats.service.ComplexityDownloadService;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class DownloadController {

	private ComplexityDownloadService complexityDownloadService;

	public DownloadController(ComplexityDownloadService complexityDownloadService) {
		this.complexityDownloadService = complexityDownloadService;
	}

	@RequestMapping("/download/{repositoryId}")
	public void downlod(@PathVariable("repositoryId") Long repositoryId, HttpServletResponse response) throws IOException {
		Workbook wb = complexityDownloadService.createComplexityWorkbook(repositoryId);
		response.setHeader("Content-disposition", "attachment; filename=test.xls");
		wb.write( response.getOutputStream() );
	}
}
