const axios = require('axios');

async function testPost() {
  try {
    const response = await axios.post('https://engineersbiriyani.onrender.com/api/orders', {
      customer: {
        name: "test",
        phone: "9876543210",
        address: "test address",
        city: "test city",
        pincode: "641001"
      },
      quantity: 1,
      optionType: "1200g"
    }, {
      headers: {
        'Origin': 'https://engineersbiriyani.vercel.app',
      }
    });
    console.log("Success!");
    console.log(response.data);
  } catch (error) {
    console.error("Failed!");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
  }
}

testPost();
