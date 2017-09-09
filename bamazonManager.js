var mysql = require("mysql");
var inquirer = require("inquirer");
var deptArr = [];
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
  connection.query("SELECT dept_name FROM departments", function(err, res){
    if (err) throw err;
    
    for (var i = 0; i < res.length; i++) {
      deptArr.push(res[i].dept_name);
    }
  // run the start function after the connection is made to prompt the user
    start();
  });

});

function start() {
  inquirer.prompt([{
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
  }]).then(function(answer) {
    menuSwitch(answer.menu);
  })
}

function menuSwitch(answer) {
  switch (answer) {
    case "View Products for Sale":
      viewProducts();
      break;
    case "View Low Inventory":
      searchLow();
      break;
    case "Add to Inventory":
      addInv();
      break;
    case "Add New Product":
      addProduct();
      break;
  }
}

function viewProducts() {
  connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].item_id);
      console.log("Name: " + res[i].product_name);
      console.log("Cost: " + res[i].price);
      console.log("Stock: " + res[i].stock_quantity);
      console.log("-----------------")
    }
    resolve();
  });
}

function searchLow() {
  connection.query("SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 25", function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log("ID: " + res[i].item_id);
      console.log("Name: " + res[i].product_name);
      console.log("Stock: " + res[i].stock_quantity);
      console.log("-----------------")
    }
    resolve();
  });
}

function addInv() {
  inquirer.prompt([{
      name: "addWhat",
      type: "input",
      message: "Enter the Item Id of the Product.",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "addNum",
      type: "input",
      message: "How many do you wish to add?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function(answer) {
    connection.query("UPDATE Products SET stock_quantity = stock_quantity + ? WHERE item_id = ?", [answer.addNum, answer.addWhat]);
    console.log("Inventory updated!")
    resolve();
  })
}

function addProduct() {
  inquirer.prompt([{
      name: "name",
      type: "input",
      message: "What is the name of the new product?"
    },
    {
      name: "dept",
      type: "list",
      message: "What type of product is this?",
      choices: deptArr
    },
    {
      name: "price",
      type: "input",
      message: "How much does it cost?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "stock",
      type: "input",
      message: "What is the Initial Stock?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function(answer) {
    connection.query("INSERT INTO Products SET?", {
        product_name: answer.name,
        dept_name: answer.dept,
        price: answer.price,
        stock_quantity: answer.stock
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