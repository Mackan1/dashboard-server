const mongoose = require("mongoose");

module.exports = async () => {
    await mongoose.connect(``, { useNewUrlParser: true, useUnifiedTopology: true });
    return mongoose
}
