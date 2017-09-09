var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "bamazon_db"
});
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


function start() {
  inquirer.prompt([{
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department"]
  }]).then(function(answer) {
    menuSwitch(answer.menu);
  })
}

function menuSwitch(answer) {
  switch (answer) {
    case "View Product Sales by Department":
      viewSales();
      break;
    case "Create New Department":
      createDept();
      break;
  }
}

function viewSales() {
  inquirer.prompt([{
    name: "deptId",
    type: "input",
    message: "Please select the Department ID.",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }
  }]).then(function(answer) {
    var query = "SELECT department_id, dept_name, over_head_costs, SUM(product_sales) AS Total_Sales,"
    query += " SUM(product_sales) - over_head_costs AS Profit FROM departments INNER JOIN Products USING (dept_name) WHERE department_id = ?"
    connection.query(query, answer.deptId, function(error, res) {
      if (error) throw err;
      console.table([{
        department_id: res[0].department_id,
        dept_name: res[0].dept_name,
        over_head_costs: res[0].over_head_costs,
        Total_Sales: res[0].Total_Sales,
        Profit: res[0].Profit
      }])
      resolve();
    })
  })
}

function createDept() {
  inquirer.prompt([{
      name: "name",
      type: "input",
      message: "What is the Name of the new Department?"
    },
    {
      name: "overhead",
      type: "input",
      message: "How much is the overhead to run?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function(answer) {
    connection.query("INSERT INTO departments SET?", {
        dept_name: answer.name,
        over_head_costs: answer.overhead,
      },
      function(err) {
        if (err) throw err;
        console.log("Insertion Successful!");
        resolve();
      })
  })
}
function resolve() {
  inquirer.prompt([{
    name: "continue",
    type: "list",
    message: "Do you want to make another transaction?",
    choices: ["Yes", "No"]
  }]).then(function(answer) {
    if (answer.continue === "Yes") {
      start();
    } else {
      connection.end();
    }
  });
}