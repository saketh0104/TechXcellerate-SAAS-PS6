import { exportToExcel } from "../exportToExcel";
import { saveAs } from "file-saver";
import { vi } from "vitest";

vi.mock("file-saver", () => ({
  saveAs: vi.fn(),
}));

vi.mock("exceljs", () => {
  const mockWorksheet = {
    mergeCells: vi.fn(),
    getCell: vi.fn().mockReturnValue({
      value: "",
      font: {},
      alignment: {},
    }),
    addRow: vi.fn(),
    getRow: vi.fn().mockReturnValue({
      eachCell: vi.fn(),
    }),
    columns: [],
  };

  const mockWorkbook = {
    addWorksheet: vi.fn(() => mockWorksheet),
    xlsx: {
      writeBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
    },
  };

  return {
    Workbook: vi.fn(() => mockWorkbook), 
  };
});

describe("exportToExcel", () => {
  it("should generate an Excel file with the correct data", async () => {
    const mockData = [
      { name: "Netflix", cost: 10, billingFrequency: "monthly", renewalDate: "2025-01-01", category: "Entertainment" },
      { name: "Amazon Prime", cost: 80, billingFrequency: "annual", renewalDate: "2025-12-01", category: "Shopping" },
    ];

    const { Workbook } = await import("exceljs");
    const mockWorkbookInstance = new Workbook(); 
    await exportToExcel(mockData, "subscriptions");

    expect(mockWorkbookInstance.addWorksheet).toHaveBeenCalledWith("Subscriptions");
    expect(mockWorkbookInstance.xlsx.writeBuffer).toHaveBeenCalledTimes(1);

    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), "subscriptions.xlsx");

    const addWorksheetMock = mockWorkbookInstance.addWorksheet as jest.Mock;
    const mockWorksheet = addWorksheetMock.mock.results[0].value;

    expect(mockWorksheet.mergeCells).toHaveBeenCalledWith("A1:E1");
    expect(mockWorksheet.addRow).toHaveBeenCalled();
    expect(mockWorksheet.getCell).toHaveBeenCalledWith("A1");
  });
});