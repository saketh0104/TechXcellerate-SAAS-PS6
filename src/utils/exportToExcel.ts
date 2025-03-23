import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Subscription {
  name: string;
  cost: number;
  billingFrequency: string;
  renewalDate: string;
  category: string;
}

export const exportToExcel = async (data: Subscription[], fileName: string): Promise<void> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Subscriptions");

  worksheet.mergeCells("A1:E1");
  const titleCell = worksheet.getCell("A1");
  titleCell.value = "Subscription Costs";
  titleCell.font = { bold: true, size: 16 };
  titleCell.alignment = { horizontal: "center", vertical: "middle" };

  worksheet.addRow(["Name", "Cost", "Billing", "Renewal Date", "Category"]);
  const headerRow = worksheet.getRow(2);
  headerRow.eachCell((cell: ExcelJS.Cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center", vertical: "middle" };
  });

  data.forEach((sub) => {
    worksheet.addRow([
      sub.name,
      `₹${sub.cost.toFixed(2)}`,
      sub.billingFrequency,
      new Date(sub.renewalDate).toLocaleDateString(),
      sub.category,
    ]);
  });

  worksheet.addRow([]);
  worksheet.addRow(["Total Monthly Costs", `₹${data
    .filter((sub) => sub.billingFrequency === "monthly")
    .reduce((sum, sub) => sum + parseFloat(sub.cost.toString()), 0)
    .toFixed(2)}`]);
    worksheet.addRow(["Total Annual Costs", `₹${data
      .filter((sub) => sub.billingFrequency === "annual")
      .reduce((sum, sub) => sum + parseFloat(sub.cost.toString()), 0)
      .toFixed(2)}`]);
    
    worksheet.addRow([
      "Total Overall",
      `₹${(
        data
          .filter((sub) => sub.billingFrequency === "annual")
          .reduce((sum, sub) => sum + parseFloat(sub.cost.toString()), 0) +
        data
          .filter((sub) => sub.billingFrequency === "monthly")
          .reduce((sum, sub) => sum + parseFloat(sub.cost.toString()), 0) * 12
      ).toFixed(2)}`
    ]);
    
    worksheet.getRow(worksheet.rowCount).eachCell((cell: ExcelJS.Cell) => {
      cell.font = { bold: true };
    });

  worksheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 20 },
    { width: 25 },
  ];

  const buffer = await (workbook.xlsx as any).writeBuffer();
  saveAs(new Blob([buffer]), `${fileName}.xlsx`);
};