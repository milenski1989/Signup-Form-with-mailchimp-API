const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
//setting up express to use static files such as styles.css and img for the logo
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//specifying the route of our page
app.get("/", function (req, res) {
  //telling the server what to send to the user when he opens our page
  res.sendFile(__dirname + "/signup.html");
});

////making a post request for the form in the home route
app.post("/", function (req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  //data to send to chimpmail's server
  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  //converting the data form JS to JSON

  const jsonData = JSON.stringify(data);

  const url = "https://us1.api.mailchimp.com/3.0/lists/730dedd825";

  const options = {
    method: "POST",
    auth: "murkov:20c05619725f08461910e32ba28d7fa6-us1",
  };

  //sending request to mailchimp's API
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    //when we get back a response, we are going to check what data day are sending us back
    response.on("data", function (data) {
      //converting from JSON to JS
      console.log(JSON.parse(data));
    });
  });

  //passing back the json data to the mailchimp server
  request.write(jsonData);
  //saying that we are done with the request
  request.end();
});

//making a post request for the form in the failure route

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("the server is running on port 3000");
});

// Mailchimp API Key 20c05619725f08461910e32ba28d7fa6-us1

//List ID
//730dedd825
