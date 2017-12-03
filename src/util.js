import axios from 'axios'

module.exports.getToken = function(url) {
    console.log(url)
    axios.post(url, 
        {
          uid: "ee424180-d729-11e7-bc51-0050569a7305",
         auth_code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiT0F1dGhBdXRoQ29kZSIsImlhdCI6MTUxMjE5NjA3NSwiZXhwIjoxNTEyMTk2Njc1LCJhdWQiOiI2ZmJlMTg1MiIsImlzcyI6Ilp1cC5tZSBHYXRld2F5Iiwic3ViIjoiZWU0MjQxODAtZDcyOS0xMWU3LWJjNTEtMDA1MDU2OWE3MzA1IiwianRpIjoiZWU2YjI2NDAtZDcyOS0xMWU3LWE3YzAtYzE3NjJkNjA1NDQ2In0.i62Z4Rjtt40benBwh2k5Nt7d0jPRs-ip1pfVKGWAB3k',
         developer_key: "28f965c90f3a29b0134ef1a9100508569a57fac2",
         secret_key: "0345c170b419013560380050569a7fac"
        }
      )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        // Object.keys(error).forEach((k) => console.log(k))
        console.log(error.response.data);
        console.log(error.request.data)
        console.log('++++')
      });
}

module.exports.templateRoot = function(theType, elements) {
  return [
              {
              attachment: {
                  type: "template",
                  payload: {
                  template_type: theType,
                  elements: elements
                  }
              }
          }
      ]
  }


  module.exports.cardElement = function(image, title, subtitle) {
    return {
        title: title,
        image_url: image,
        subtitle: subtitle,
        buttons: [
          {
            "type": "web_url",
            "title": "Shop Now",
            "url": "http:\/\/www.original.com.br\/"
          }
      ]
    }
}