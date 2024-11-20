const express = require("express");
const sql = require("mssql");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors({
  origin: '*',  // หรือระบุ URL ที่ต้องการอนุญาต
}));
require("dotenv").config();

const config = {
  user: sa,
  password: 6600916,
  server: 192.168.1.115,
  database: csc481,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
app.get("/apiLogin", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query(" SELECT * FROM Users;");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  } finally {
    sql.close();
  }
});
app.get("/apiProduct", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM Furniture;");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  } finally {
    sql.close();
  }
});

app.put("/Updateproduct", async (request, respond) => {
  const { Fur_ID, Fur_name, Types, Materials, Stocks, Prices } = request.body;

  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("Fur_ID", sql.VARCHAR);
    ps.input("Fur_name", sql.VARCHAR);
    ps.input("Types", sql.VARCHAR);
    ps.input("Materials", sql.VARCHAR);
    ps.input("Stocks", sql.VARCHAR);
    ps.input("Prices", sql.VARCHAR);
    await ps.prepare(
      "UPDATE Furniture SET Fur_name = @Fur_name, Materials = @Materials, Types=@Types,Stocks=@Stocks,Prices=@Prices WHERE Fur_ID = @Fur_ID"
    );
    await ps.execute({ Fur_ID, Fur_name, Types, Materials, Stocks, Prices });
    await ps.unprepare();
    respond.status(200).send("Update Success");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  } finally {
    sql.close();
  }
});
app.get("/apiProduct/:id", async (request, respond) => {
  const { id } = request.params;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("Fur_ID", sql.VARCHAR);
    await ps.prepare("SELECT * FROM Furniture WHERE Fur_ID = @Fur_ID");
    const result = await ps.execute({ Fur_ID: id });
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.get("/Type", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM FurType");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.get("/Materials", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM Materials");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.get("/Type", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM FurType");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.post("/InsertType", async (request, respond) => {
  const { id, type } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    ps.input("type", sql.VarChar);
    await ps.prepare("INSERT INTO FurType  VALUES (@id,@type)");
    await ps.execute({ id, type });
    await ps.unprepare();
    respond.status(200).send("Type added successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.put("/Updatetype", async (request, respond) => {
  const { id, type } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.NVarChar);
    ps.input("type", sql.NVarChar);
    await ps.prepare("UPDATE FurType SET typename = @type WHERE id = @id");
    await ps.execute({ id, type });
    await ps.unprepare();
    respond.status(200).send("Type updated successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.delete("/deletetype/:id", async (request, respond) => {
  const { id } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    await ps.prepare("DELETE FROM FurType WHERE id = @id");
    await ps.execute({ id });
    await ps.unprepare();
    respond.status(200).send("Type deleted successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.post("/Insertmat", async (request, respond) => {
  const { id, mat } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    ps.input("mat", sql.VarChar);
    await ps.prepare("INSERT INTO Materials  VALUES (@id,@mat)");
    await ps.execute({ id, mat });
    await ps.unprepare();
    respond.status(200).send("Type added successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  }
});
app.put("/Updatemat", async (request, respond) => {
  const { id, data } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.NVarChar);
    ps.input("data", sql.NVarChar);
    await ps.prepare("UPDATE Materials SET matname = @data WHERE id = @id");
    await ps.execute({ id, data });
    await ps.unprepare();
    respond.status(200).send("Type added successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.delete("/deletemat", async (request, respond) => {
  const { id } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.NVarChar);
    await ps.prepare("DELETE FROM Materials WHERE id = @id");
    await ps.execute({ id });
    await ps.unprepare();
    respond.status(200).send("Type deleted successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send("An error occurred");
  }
});
app.delete("/deleteFur/:id", async (request, respond) => {
  const { id } = request.params;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    await ps.prepare("DELETE FROM Furniture WHERE Fur_ID = @id");
    await ps.execute({ id });
    await ps.unprepare();
    respond.status(200).send("Furniture deleted successfully");
  } catch (err) {
    console.log("error");
    respond.status(500).send(err);
  } finally {
    sql.close();
  }
});

app.post("/InsertDetails", async (request, respond) => {
  const { OrderDetailID, InvoiceID, IDFur, Qty, Price } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("OrderDetailID", sql.VarChar);
    ps.input("InvoiceID", sql.VarChar);
    ps.input("IDFur", sql.VarChar);
    ps.input("Qty", sql.VarChar);
    ps.input("Price", sql.VarChar);
    await ps.prepare(
      "INSERT INTO OrderDetail VALUES(@OrderDetailID,@InvoiceID,@IDFur,@Qty,@Price)"
    );
    await ps.execute({ OrderDetailID, InvoiceID, IDFur, Qty, Price });
    await ps.unprepare();
    respond.status(200).send("Details added successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  }
});

app.get("/getRecords", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM Orders");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  }
});
app.get("/getCustomer/:id", async (request, respond) => {
  const { id } = request.params;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    await ps.prepare("SELECT * FROM Customer WHERE CusID = @id");
    const result = await ps.execute({ id });

    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  }
});
app.post("/insertrec", async (request, respond) => {
  const { id, dates, cusid, totalprice } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    ps.input("dates", sql.VarChar);
    ps.input("cusid", sql.VarChar);
    ps.input("totalprice", sql.VarChar);
    await ps.prepare(
      "INSERT INTO Orders VALUES(@id,@dates,@cusid,@totalprice)"
    );
    await ps.execute({ id, dates, cusid, totalprice });
    await ps.unprepare();
    respond.status(200).send("Record added successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  }
});
app.put("/updatestock/:id", async (request, respond) => {
  const id = request.params.id;
  const { stock } = request.body;
  try {
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("id", sql.VarChar);
    ps.input("stock", sql.VarChar);
    await ps.prepare("UPDATE Furniture SET Stocks = @stock WHERE Fur_ID = @id");
    await ps.execute({ id, stock });
    await ps.unprepare();
    respond.status(200).send("Stock updated successfully");
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err.message); // เพิ่ม error message
  }
});
app.get("/getOrderDetails", async (request, respond) => {
  try {
    await sql.connect(config);
    const result = await sql.query("SELECT * FROM OrderDetail");
    respond.status(200).json(result.recordset);
  } catch (err) {
    console.log("Error:", err);
    respond.status(500).send(err);
  }
});
app.post("/InsertFurniture", async (request, respond) => {
  try {
    const { Fur_ID, Fur_name, Types, Materials, Stocks, Price } = request.body;
    await sql.connect(config);
    const ps = new sql.PreparedStatement();
    ps.input("Fur_ID", sql.VarChar);
    ps.input("Fur_name", sql.VarChar);
    ps.input("Types", sql.VarChar);
    ps.input("Materials", sql.VarChar);
    ps.input("Stocks", sql.VarChar);
    ps.input("Price", sql.VarChar);

    await ps.prepare(
      "INSERT INTO Furniture  VALUES (@Fur_ID, @Fur_name, @Types, @Materials, @Stocks, @Price)"
    );
    await ps.execute({ Fur_ID, Fur_name, Types, Materials, Stocks, Price });
    await ps.unprepare();

    respond.status(200).send("Furniture added successfully");
  } catch (err) {
    console.error("Error inserting furniture:", err);
    respond.status(500).send("Error inserting furniture");
  }
});
app.listen(5500, () => {
  console.log("Server is running on http://localhost:5500");
});
