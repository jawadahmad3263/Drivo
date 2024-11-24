const mongoose = require("mongoose");
const config = require("../../../../config/config.json");
const mongooseTimestamp = require("mongoose-timestamp");
const winston = require("../../../../config/winston");
let fareEstimationData = new mongoose.Schema({
  distance: { type: Number, required: true },
  fare: { type: Number, required: true },
  ride_class: { type: String, required: true },
});
fareEstimationData.plugin(mongooseTimestamp);
const fare_estimation = mongoose.model("fare_estimation", fareEstimationData);

const seedFareEstimation = async () => {
  try {
    const fares = {
      business: 100, // Example fare for business in pkr
      economy: 50,   
      bike: 30,     
    };

    // Iterate over all categories in config
    for (const category of config.carCategory) {
      const existingEntry = await fare_estimation.findOne({ ride_class: category });
      if (!existingEntry) {
        const fareData = {
          distance: 1000, 
          fare: fares[category] || 0, 
          ride_class: category,
        };
        await fare_estimation.create(fareData);
        winston.info(`Estimated fare for ${category} added successfully.`);
      } else {
        winston.info(`Estimated fare for ${category} already exists.`);
      }
    }
  } catch (err) {
    winston.error("Error adding estimated fares:", err);
  }
};

// Run the seeding function
seedFareEstimation();

module.exports = fare_estimation;

