var mysql = require("mysql");
var inquirer = require("inquirer");

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
      name: "idChoice",
      type: "input",
      message: "Please select the ID of the product you wish to buy.",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    },
    {
      name: "quantChoice",
      type: "input",
      message: "How many do you want to buy?",
      validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }
  ]).then(function(answer) {
    purchase(answer.idChoice, answer.quantChoice);
  })
}

function purchase(item_id, quantity) {
  connection.query("SELECT product_name, stock_quantity, price, product_sales FROM products WHERE item_id = " + item_id, function(err, res) {
    if (err) throw err;
    if (quantity > res[0].stock_quantity) {
      console.log("ERROR: Insufficent Quantity")
    } else {
      connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: res[0].stock_quantity - quantity,
            product_sales: res[0].product_sales + (quantity * res[0].price)
          },
          {
            item_id: item_id
          }
        ],
        function(error) {
          if (error) throw err;
          console.log("Purchase Successful!");
          console.log("You have bought " + quantity + " " + res[0].product_name + ".");
          console.log("Your total cost comes to $" + (quantity * res[0].price) + ".");
        })
    }
    connection.end();
  })
}