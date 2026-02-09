const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '../products.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

const data = XLSX.utils.sheet_to_json(sheet);

const sqlStatements = [];
sqlStatements.push('DELETE FROM products;');
sqlStatements.push('DELETE FROM sqlite_sequence WHERE name="products";');

data.forEach(row => {
    // Basic validation
    if (!row.TIPO_PRENDA) return;

    const name = `${row.TIPO_PRENDA} ${row.CATEGORÍA || ''} ${row.TALLA || ''}`.trim().replace(/'/g, "''");
    const description = (row.DESCRIPCIÓN || '').replace(/'/g, "''");
    // Use PRECIO_50_U as the price, ensure it's a number
    const price = parseInt(row.PRECIO_50_U) || 0;
    const stock = parseInt(row.CANTIDAD_DISPONIBLE) || 0;

    sqlStatements.push(`INSERT INTO products (name, description, price, stock) VALUES ('${name}', '${description}', ${price}, ${stock});`);
});

const outputPath = path.join(__dirname, '../seed_products.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'));

console.log(`Generated ${sqlStatements.length - 2} insert statements.`);
