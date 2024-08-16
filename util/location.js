var geocode = require("node-geocoder");
const reverse_geocode  = require('reverse-geocode');

const options = {
  formatter:null,
  apiKey:"AIzaSyACepJIoDZ1rhhju2bK-lO23qIzaKwXsnY"
}

const normal_geocoder = geocode(options);


const ReverseConvertLocation = async ({latitude,longitude}) => {

  if(!latitude || !longitude){
    console.log("Invalid Location");
    return null;
  }

  console.log(latitude,longitude);

  var address = reverse_geocode.lookup(latitude,longitude,"us");

  console.log(address);

  return address;

}

const ConvertLocation =  async (place) =>{

  const coords = await geocoder.geocode(place);

  if(coords.length <=0){
    return false;
  }

  if(coords.length > 0){

    latitude = coords[0].latitude;
    longitude = coords[0].longitude;

    return {
      latitude:latitude,
      longitude:longitude
    }

  }
  else{
    return false;
  }

}



module.exports.ReverseConvertLocation = ReverseConvertLocation;
module.exports.ConvertLocation = ConvertLocation;
