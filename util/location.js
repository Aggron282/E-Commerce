var geocode = require("node-geocoder");
const reverse_geocode  = require('reverse-geocode');

// const options = {
//   formatter:null,
//   apiKey:"AIzaSyACepJIoDZ1rhhju2bK-lO23qIzaKwXsnY"
// }

const options = {
  provider: 'google',

  // Optional depending on the providers
  apiKey: 'AIzaSyACepJIoDZ1rhhju2bK-lO23qIzaKwXsnY', // for Mapquest, OpenCage, APlace, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const normal_geocoder = geocode(options);


const ReverseConvertLocation = async ({latitude,longitude}) => {

  if(!latitude || !longitude){
    console.log("Invalid Location");
    return null;
  }

  const geocoder = geocode(options);
  var address = await reverse_geocode.lookup(latitude,longitude,"us");

  return address;

}

const ConvertLocation =  async (place) =>{

  const data = await normal_geocoder.geocode(place);

  if(data.length <=0){
    return false;
  }

  if(data.length > 0){

      latitude = data[0].latitude;
      longitude = data[0].longitude;

      return  {
        coords: {
          latitude:latitude,
          longitude:longitude,
        },
        address:data[0].formattedAddress
      }

  }
  else{
    return false;
  }

}



module.exports.ReverseConvertLocation = ReverseConvertLocation;
module.exports.ConvertLocation = ConvertLocation;
